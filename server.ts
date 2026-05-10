import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route for NetEase Playlist
  app.get("/api/netease/playlist/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Fetching playlist: ${id}`);
      
      // Attempt multiple API variations for resilience
      const endpoints = [
        `https://music.163.com/api/v1/playlist/detail?id=${id}&n=50`, // Minimal tracks for maximum speed
        `https://music.163.com/api/playlist/detail?id=${id}`
      ];

      let playlistData = null;
      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(endpoint, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
              'Referer': 'https://music.163.com/'
            },
            timeout: 5000 // Responsive UI but enough for 50 tracks
          });
          if (response.data?.playlist || response.data?.result) {
            playlistData = response.data.playlist || response.data.result;
            // NetEase sometimes puts tracks in 'tracks' or 'trackIds'
            // If tracks is empty but trackIds exists, we might need a second call, 
            // but usually for public playlists 'tracks' is populated.
            break;
          }
        } catch (e) {
          console.warn(`Endpoint ${endpoint} failed, trying next...`);
        }
      }
      
      if (playlistData) {
        // NetEase can store tracks in 'tracks' or 'result.tracks' or 'playlist.tracks'
        // Sometimes it only returns 'trackIds', but usually detail API returns first few tracks.
        const rawTracks = playlistData.tracks || playlistData.songs || [];
        
        if (rawTracks.length === 0 && playlistData.trackIds && playlistData.trackIds.length > 0) {
            console.log("No tracks found, but trackIds exist. Trying to fetch them...");
            // We could fetch more here, but for now let's hope for the best with tracks field.
        }

        const songs = rawTracks.map((track: any) => ({
          id: track.id.toString(),
          title: track.name,
          artist: (track.ar || track.artists || []).map((a: any) => a.name).join(', '),
          albumArt: track.al?.picUrl || (track.album && track.album.picUrl),
          keywords: track.al?.name ? [track.al.name] : [],
          mp3Url: `https://music.163.com/song/media/outer/url?id=${track.id}.mp3`
        }));
        
        console.log(`Found ${songs.length} songs`);
        if (songs.length > 0) {
            res.json({ success: true, songs });
        } else {
            res.status(404).json({ success: false, error: "Playlist is empty or tracks are private" });
        }
      } else {
        res.status(404).json({ success: false, error: "Playlist not found or private" });
      }
    } catch (error: any) {
      console.error("NetEase API Error:", error.message);
      res.status(500).json({ success: false, error: "Failed to fetch playlist" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
