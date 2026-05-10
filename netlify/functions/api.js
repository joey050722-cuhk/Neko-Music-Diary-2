import axios from 'axios';

export const handler = async function(event, context) {
  // Event path is /api/netease/playlist/12345
  const pathParts = event.path.split('/');
  const id = pathParts[pathParts.length - 1];
  
  if (!id || id === 'playlist') {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Missing ID' }) };
  }

  const endpoints = [
    `https://music.163.com/api/v1/playlist/detail?id=${id}&n=50`,
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
        timeout: 5000
      });
      if (response.data?.playlist || response.data?.result) {
        playlistData = response.data.playlist || response.data.result;
        break;
      }
    } catch (e) {
      console.warn(`Endpoint ${endpoint} failed, trying next...`);
    }
  }
  
  if (playlistData) {
    const rawTracks = playlistData.tracks || playlistData.songs || [];
    const songs = rawTracks.map(track => ({
      id: track.id.toString(),
      title: track.name,
      artist: (track.ar || track.artists || []).map(a => a.name).join(', '),
      albumArt: track.al?.picUrl || (track.album && track.album.picUrl),
      keywords: track.al?.name ? [track.al.name] : [],
      mp3Url: `https://music.163.com/song/media/outer/url?id=${track.id}.mp3`
    }));

    return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ success: true, songs })
    };
  } else {
    return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ success: false, message: 'Not found' })
    };
  }
}
