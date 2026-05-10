import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Sparkles, RefreshCw, Heart, Cat as CatIcon, Volume2, VolumeX, Share2, X, Settings, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Song, OutfitSuggestion } from '../types';
import { DEFAULT_FAVORITE_SONGS } from '../constants';
import { getOutfitSuggestion } from '../services/geminiService';
import { Accessory } from './Accessories';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-white rounded-3xl border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] p-6 z-10 ${className}`}>
    {children}
  </div>
);

const HandDrawnBg: React.FC = React.memo(() => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40 bg-[#fff1f2]" 
       style={{ backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.2) 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
));

const SketchyCat: React.FC<{ accessory?: string; pose?: 'sitting' | 'lying' }> = React.memo(({ accessory, pose = 'sitting' }) => {
  const [reactions, setReactions] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [activePart, setActivePart] = useState<string | null>(null);

  const spawnReaction = (e: React.MouseEvent, emoji: string, part: string) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setReactions(prev => [...prev, { id: Date.now() + Math.random(), x, y, emoji }]);
    setActivePart(part);
    setTimeout(() => {
      setReactions(prev => prev.slice(1));
    }, 1000);
    setTimeout(() => {
      setActivePart(null);
    }, 300);
  };

  return (
    <div className="relative w-56 h-56 mx-auto mb-4 flex items-center justify-center select-none group">
      <AnimatePresence>
        {reactions.map(reaction => (
          <motion.div
            key={reaction.id}
            initial={{ opacity: 1, y: reaction.y, x: reaction.x, scale: 0.5 }}
            animate={{ opacity: 0, y: reaction.y - 50, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute pointer-events-none z-50 text-2xl drop-shadow-md"
            style={{ left: 0, top: 0 }}
          >
            {reaction.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
      <svg viewBox="0 0 100 100" className="w-full h-full text-stone-800 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="65" r="32" fill="#fff1f2" stroke="#fda4af" strokeWidth="0.5" strokeDasharray="2 2" />
        
        {pose === 'sitting' ? (
          <g>
            {/* TAIL (pissed off) */}
            <motion.g 
              className="cursor-pointer hover:stroke-pink-400 transition-colors" 
              onClick={(e: React.MouseEvent) => spawnReaction(e, '💢', 'tail')} 
              onPointerDown={(e: React.MouseEvent) => spawnReaction(e, '💢', 'tail')}
              animate={activePart === 'tail' ? { rotate: [0, 20, -20, 0] } : { rotate: [0, 5, -5, 0] }}
              transition={activePart === 'tail' ? { duration: 0.3 } : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ transformOrigin: "68px 82px" }}
            >
              <path d="M68 82 Q 85 85 82 65" strokeWidth="3" fill="transparent" />
            </motion.g>
            
            {/* BODY/BACK (loving it) */}
            <motion.g 
              className="cursor-pointer hover:stroke-pink-400 transition-colors" 
              onClick={(e: React.MouseEvent) => spawnReaction(e, '💖', 'body')} 
              onPointerDown={(e: React.MouseEvent) => spawnReaction(e, '💖', 'body')}
              animate={activePart === 'body' ? { scale: [1, 1.05, 1] } : { scale: [1, 1.02, 1] }}
              transition={activePart === 'body' ? { duration: 0.3 } : { repeat: Infinity, duration: 3, ease: "easeInOut" }}
              style={{ transformOrigin: "50px 60px" }}
            >
              <path d="M70 60 Q 75 80 65 85 Q 50 90 35 85 Q 25 80 30 60 Q 35 40 50 40 Z" fill="transparent" stroke="transparent" strokeWidth="15" />
              <path d="M35 85 Q 25 80 30 60 Q 35 40 50 40 Q 65 40 70 60 Q 75 80 65 85 Q 50 90 35 85" fill="white" />
              <path d="M32 65 Q 28 85 45 88" strokeWidth="2.5" />
              <path d="M55 88 Q 72 85 68 65" strokeWidth="2.5" />
            </motion.g>

            {/* BELLY (purring/sparkles) */}
            <g className="cursor-pointer hover:stroke-pink-400 transition-colors" onClick={(e) => spawnReaction(e, '✨', 'belly')} onPointerDown={(e) => spawnReaction(e, '✨', 'belly')}>
              <circle cx="50" cy="70" r="12" fill="transparent" stroke="transparent" />
            </g>

            {/* HEAD (music/happy) */}
            <motion.g 
              className="cursor-pointer hover:stroke-pink-400 transition-colors" 
              onClick={(e: React.MouseEvent) => spawnReaction(e, '🎵', 'head')} 
              onPointerDown={(e: React.MouseEvent) => spawnReaction(e, '🎵', 'head')}
              animate={activePart === 'head' ? { y: [0, -5, 0], rotate: [0, -5, 5, 0] } : { rotate: [0, 2, -2, 0] }}
              transition={activePart === 'head' ? { duration: 0.3 } : { repeat: Infinity, duration: 5, ease: "easeInOut" }}
              style={{ transformOrigin: "50px 45px" }}
            >
              <path d="M60 42 Q 68 45 70 55 Q 65 60 60 50 Z" fill="#fecaca" stroke="none" />
              <path d="M42 42 L 35 28 L 48 38" fill="white" strokeWidth="3" />
              <path d="M58 42 L 65 28 L 52 38" fill="white" strokeWidth="3" />
              <circle cx="46" cy="52" r="1.5" fill="currentColor" />
              <circle cx="54" cy="52" r="1.5" fill="currentColor" />
              <path d="M48 58 Q 50 60 52 58" strokeWidth="2" />
              <circle cx="41" cy="56" r="3" fill="#fb7185" fillOpacity="0.3" stroke="none" />
              <circle cx="59" cy="56" r="3" fill="#fb7185" fillOpacity="0.3" stroke="none" />
              <path d="M25 55 L 18 54" strokeWidth="1.5" />
              <path d="M25 59 L 18 60" strokeWidth="1.5" />
              <path d="M75 55 L 82 54" strokeWidth="1.5" />
              <path d="M75 59 L 82 60" strokeWidth="1.5" />
            </motion.g>
          </g>
        ) : (
          <g transform="translate(0, 10)">
            {/* TAIL (pissed off) */}
            <motion.g 
              className="cursor-pointer hover:stroke-pink-400 transition-colors" 
              onClick={(e: React.MouseEvent) => spawnReaction(e, '💢', 'tail')} 
              onPointerDown={(e: React.MouseEvent) => spawnReaction(e, '💢', 'tail')}
              animate={activePart === 'tail' ? { rotate: [0, 15, -15, 0] } : { rotate: [0, 3, -3, 0] }}
              transition={activePart === 'tail' ? { duration: 0.3 } : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ transformOrigin: "75px 75px" }}
            >
              <path d="M75 75 Q 85 85 70 82" strokeWidth="3" fill="transparent" />
            </motion.g>

            {/* BODY (sleepy/ZZZ) */}
            <motion.g 
              className="cursor-pointer hover:stroke-pink-400 transition-colors" 
              onClick={(e: React.MouseEvent) => spawnReaction(e, '💤', 'body')} 
              onPointerDown={(e: React.MouseEvent) => spawnReaction(e, '💤', 'body')}
              animate={activePart === 'body' ? { scale: [1, 1.05, 1] } : { scale: [1, 1.02, 1], y: [0, 1, 0] }}
              transition={activePart === 'body' ? { duration: 0.3 } : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ transformOrigin: "50px 70px" }}
            >
              <path d="M20 70 Q 20 50 50 50 Q 80 50 80 70 Q 80 85 50 85 Q 20 85 20 70" fill="white" />
            </motion.g>

            {/* HEAD (music/happy) */}
            <motion.g 
              className="cursor-pointer hover:stroke-pink-400 transition-colors" 
              onClick={(e: React.MouseEvent) => spawnReaction(e, '🎵', 'head')} 
              onPointerDown={(e: React.MouseEvent) => spawnReaction(e, '🎵', 'head')}
              animate={activePart === 'head' ? { rotate: [0, -10, 10, 0] } : { rotate: [0, 1, -1, 0] }}
              transition={activePart === 'head' ? { duration: 0.3 } : { repeat: Infinity, duration: 6, ease: "easeInOut" }}
              style={{ transformOrigin: "42px 50px" }}
            >
              <path d="M70 52 Q 78 55 80 65 Q 70 70 65 60 Z" fill="#fecaca" stroke="none" />
              <path d="M25 60 Q 20 40 40 40 Q 55 40 50 55" fill="white" />
              <path d="M28 42 L 22 30 L 35 40" fill="white" strokeWidth="3" />
              <path d="M45 42 L 52 30 L 40 40" fill="white" strokeWidth="3" />
              <circle cx="32" cy="50" r="1.5" fill="currentColor" />
              <circle cx="42" cy="50" r="1.5" fill="currentColor" />
              <path d="M35 55 Q 37 57 39 55" strokeWidth="2" />
              <circle cx="28" cy="54" r="2.5" fill="#fb7185" fillOpacity="0.3" stroke="none" />
              <circle cx="46" cy="54" r="2.5" fill="#fb7185" fillOpacity="0.3" stroke="none" />
            </motion.g>
          </g>
        )}
      </svg>
      
      {accessory && (
        <motion.div 
          initial={{ scale: 0, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          key={accessory}
          className="absolute inset-0 pointer-events-none"
        >
          <Accessory type={accessory} className="w-full h-full scale-110" />
        </motion.div>
      )}
    </div>
  );
});

const Clock: React.FC<{ weather: string }> = ({ weather }) => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-pink-300 uppercase tracking-widest pl-1">
        {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })}
      </span>
      <div className="flex items-end gap-2 -mt-1 pl-1">
        <span className="text-3xl font-black text-stone-800 tracking-tighter leading-none">
          {time}
        </span>
        <span className="text-xs font-medium text-stone-400 mb-0.5">/ {weather}</span>
        
        {/* Dynamic Elements Line */}
        <div className="flex items-center gap-2.5 ml-1 mb-1">
          <motion.div animate={{ y: [0, -2, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
            <svg width="12" height="12" viewBox="0 0 100 100" className="text-emerald-400 opacity-60" fill="none" stroke="currentColor" strokeWidth="8">
              <path d="M50 50 Q 60 20 70 50 Q 100 60 70 70 Q 60 100 50 70 Q 20 60 50 50" />
              <circle cx="60" cy="60" r="10" fill="currentColor" stroke="none"/>
            </svg>
          </motion.div>
          <motion.div animate={{ y: [0, -2, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}>
            <svg width="10" height="10" viewBox="0 0 100 100" className="text-teal-400 opacity-60" fill="currentColor">
              <path d="M50 10 L 58 42 L 90 50 L 58 58 L 50 90 L 42 58 L 10 50 L 42 42 Z" />
            </svg>
          </motion.div>
          <motion.div animate={{ y: [0, -2, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}>
             <svg width="14" height="14" viewBox="0 0 100 100" className="text-lime-500 opacity-60" fill="currentColor">
               <circle cx="50" cy="50" r="16" />
               <circle cx="28" cy="25" r="12" />
               <circle cx="50" cy="12" r="12" />
               <circle cx="72" cy="25" r="12" />
             </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default function MainApp() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [suggestion, setSuggestion] = useState<OutfitSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [showCatalog, setShowCatalog] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBgMusicPlaying, setIsBgMusicPlaying] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [pose, setPose] = useState<'sitting' | 'lying'>('sitting');
  const [playlistId, setPlaylistId] = useState('2426162777'); // User's requested playlist
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>(() => {
    const cached = localStorage.getItem(`playlist_${playlistId}`);
    try {
      const parsed = cached ? JSON.parse(cached) : [];
      return parsed; // Removed DEFAULT_FAVORITE_SONGS fallback so it will fetch real songs
    } catch {
      return [];
    }
  });
  const [syncLoading, setSyncLoading] = useState(false);
  const [suggestionCache, setSuggestionCache] = useState<Record<string, OutfitSuggestion>>({});
  const [currentTime, setCurrentTime] = useState<string>(''); // Keep for initial render if needed
  const [weatherContext, setWeatherContext] = useState<string>('清爽');
  const [audioError, setAudioError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  
  const [isBuffering, setIsBuffering] = useState(false);
  
  // Audio unlocker for browser policies
  useEffect(() => {
    const unlock = () => {
      console.log("Unlocking audio context...");
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          audioRef.current?.pause();
          setIsAudioUnlocked(true);
        }).catch(() => {});
      }
      window.removeEventListener('click', unlock);
    };
    window.addEventListener('click', unlock);
    return () => window.removeEventListener('click', unlock);
  }, []);

  // Update weather context less frequently (once an hour is enough)
  useEffect(() => {
    const updateWeather = () => {
        const now = new Date();
        const hour = now.getHours();
        const month = now.getMonth();
        let context = '清爽';
        if (month >= 5 && month <= 8) context = hour > 10 && hour < 16 ? '炎热阳光' : '温润夏夜';
        else if (month >= 11 || month <= 1) context = '寒冷冬日';
        if (hour >= 18 || hour <= 6) context += ' 繁星点点';
        setWeatherContext(context);
    };
    updateWeather();
    const interval = setInterval(updateWeather, 3600000); 
    return () => clearInterval(interval);
  }, []);

  const hasSyncedRef = useRef(false);

  const fetchSongsFromNetease = async (id: string) => {
      let data = null;
      try {
          // Attempt 1: Our local proxy if we are running in full-stack mode
          const resLocal = await fetch(`/api/netease/playlist/${id}`);
          if (resLocal.ok) {
              const resData = await resLocal.json();
              if (resData.success && resData.songs) return resData.songs;
          }
      } catch (e) {}

      try {
          // Attempt 2: Public proxy 1 (Binaryify)
          const res = await fetch(`https://neteasecloudmusicapi.vercel.app/playlist/detail?id=${id}`);
          data = await res.json();
      } catch (e) {
          try {
             // Attempt 3: allorigins raw proxy
             const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://music.163.com/api/v1/playlist/detail?id=${id}`)}`);
             data = await res.json();
          } catch(err) {
             console.error("All proxies failed.");
             return null;
          }
      }

      const rawTracks = data?.playlist?.tracks || data?.result?.tracks || [];
      if (rawTracks.length === 0) return null;

      return rawTracks.map((track: any) => ({
          id: track.id.toString(),
          title: track.name,
          artist: (track.ar || track.artists || []).map((a: any) => a.name).join(', '),
          albumArt: track.al?.picUrl || (track.album && track.album.picUrl),
          keywords: track.al?.name ? [track.al.name] : [],
          mp3Url: `https://music.163.com/song/media/outer/url?id=${track.id}.mp3`
      }));
  };

  // Auto-sync on first mount or whenever playlistId changes
  useEffect(() => {
    const autoSync = async () => {
        if (!playlistId) return;
        
        // Prevent repeated fast sync calls
        if (hasSyncedRef.current) return;
        hasSyncedRef.current = true;

        setSyncLoading(true);
        try {
            const songs = await fetchSongsFromNetease(playlistId);
            if (songs && songs.length > 0) {
                setPlaylistSongs(songs);
                localStorage.setItem(`playlist_${playlistId}`, JSON.stringify(songs));
            } else if (playlistSongs.length === 0) {
                // Failsafe to default ONLY if API fails completely and we have zero songs
                setPlaylistSongs(DEFAULT_FAVORITE_SONGS);
            }
        } catch (err) {
            console.error("Auto-sync failed", err);
            if (playlistSongs.length === 0) setPlaylistSongs(DEFAULT_FAVORITE_SONGS);
        } finally {
            setSyncLoading(false);
        }
    };
    autoSync();
  }, [playlistId]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const appUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleAudioError = (e: any) => {
    console.error("Audio playback error:", e);
    setAudioError("这首歌可能由于版权或网络原因无法播放 T_T");
  };

  // Sync volume changes to elements
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    if (bgMusicRef.current) bgMusicRef.current.volume = volume;
  }, [volume]);

  const toggleMusic = () => {
    if (bgMusicRef.current) {
        if (!bgMusicRef.current.src) {
            bgMusicRef.current.src = 'https://assets.mixkit.co/music/preview/mixkit-lo-fi-hip-hop-02-715.mp3';
            bgMusicRef.current.loop = true;
        }
        
        if (isBgMusicPlaying) {
            bgMusicRef.current.pause();
        } else {
            // Pause main audio if playing background
            if (audioRef.current) audioRef.current.pause();
            setIsPlaying(false);
            bgMusicRef.current.volume = volume;
            bgMusicRef.current.play().catch(err => {
                console.error("Ambience music failed to play:", err);
            });
        }
        setIsBgMusicPlaying(!isBgMusicPlaying);
    }
  };

  const syncPlaylist = async () => {
    if (!playlistId) return;
    setSyncLoading(true);
    try {
        const songs = await fetchSongsFromNetease(playlistId);
        if (songs && songs.length > 0) {
            setPlaylistSongs(songs);
            localStorage.setItem(`playlist_${playlistId}`, JSON.stringify(songs));
            setShowSettings(false);
        } else {
            console.warn('Sync failed: Playlist incorrect or private');
            alert('同步失败：未找到有效歌曲 (可能歌单设置了隐私或ID错误)');
        }
    } catch (err) {
        console.error(err);
        alert('同步异常，请网络检查或稍后再试');
    } finally {
        setSyncLoading(false);
    }
  };

  const ACCESSORY_NAMES_ZH: Record<string, string> = {
    red_scarf: '温暖红围巾',
    yellow_hat: '小黄帽',
    pink_bow: '少女粉蝴蝶结',
    cool_sunglasses: '酷酷太阳镜',
    green_leaf: '清新小绿叶',
    flower: '娇点小花',
    headphones: '专业级耳机',
    star_glasses: '璀璨星镜',
    toast: '美味吐司片',
    bell: '悦耳小铃铛'
  };
  const ACCESSORIES = Object.keys(ACCESSORY_NAMES_ZH);

  const drawCard = async (explicitSong?: Song) => {
    // If we're already loading a suggestion, do not allow another draw to overlap
    if (loading || playlistSongs.length === 0) return;
    
    setLoading(true);
    setPose(Math.random() > 0.5 ? 'sitting' : 'lying');
    
    // Stop background music if it's playing to prioritize the drawn song
    if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
    }
    setIsBgMusicPlaying(false);
    setIsPlaying(false);
    setAudioError(null);

    // Pick a random song or use explicit
    let song = explicitSong;
    if (!song) {
        const randomIndex = Math.floor(Math.random() * playlistSongs.length);
        song = playlistSongs[randomIndex];
    }
    setCurrentSong(song);
    
    // Instantly transition the screen, show song info immediately
    setIsFirstTime(false);
    setSuggestion(null);

    // Pick a random accessory that is DIFFERENT from the last one if possible
    let chosenAccessory = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)];
    if (suggestion && suggestion.catAccessory === chosenAccessory) {
      // Try twice more to get a different one
      const remaining = ACCESSORIES.filter(a => a !== suggestion.catAccessory);
      chosenAccessory = remaining[Math.floor(Math.random() * remaining.length)];
    }
    
    // Auto-play the song safely
    if (audioRef.current && song.mp3Url) {
        const audio = audioRef.current;
        
        // Ensure volume and unmuted status
        audio.volume = volume;
        audio.muted = false;
        
        // Wait for previous play to potentially finish
        if (playPromiseRef.current) {
            try { await playPromiseRef.current; } catch(e) {}
        }

        audio.pause();
        
        // Try multiple URL formats for best compatibility
        const primaryUrl = song.mp3Url;
        const secondaryUrl = `https://link.hhtjim.com/163/${song.id}.mp3`;
        
        audio.src = primaryUrl;
        audio.currentTime = 0;
        
        playPromiseRef.current = audio.play();
        playPromiseRef.current.then(() => {
            setIsPlaying(true);
            setAudioError(null);
        }).catch(err => {
            if (err.name !== 'AbortError') {
                console.warn("Primary source failed, trying fallback...", err);
                audio.src = secondaryUrl;
                audio.currentTime = 0;
                audio.play().then(() => {
                    setIsPlaying(true);
                    setAudioError(null);
                }).catch(err2 => {
                    console.error("All audio sources failed:", err2);
                    setIsPlaying(false);
                    if (err2.name === 'NotAllowedError') {
                      setAudioError("浏览器拦截了自动播放，请点击下方音符按钮播放");
                    } else {
                      setAudioError("该曲目在当前环境下无法播放 (CORS/Region Lock)");
                    }
                });
            }
        });
    }

    // Check cache first for faster response
    if (suggestionCache[song.id]) {
        setSuggestion(suggestionCache[song.id]);
        setLoading(false);
    } else {
        try {
            // Fetch the suggestion while the user is already listening to the music!
            const res = await getOutfitSuggestion(song, weatherContext, new Date().toLocaleString(), chosenAccessory);
            setSuggestion(res);
            setSuggestionCache(prev => ({ ...prev, [song.id]: res }));
        } catch (err) {
            // Silence quota errors completely for the user
            if (!(err instanceof Error && err.message.includes('429'))) {
                console.error("Suggestion fetch encountered an issue:", err);
            }

            // High-quality local library for seamless fallback
            const outfitLibrary = [
                { items: "白衬衫 + 浅红格纹裙 + 乐福鞋", style: ["清新学院", "甜美系", "舒适"] },
                { items: "燕麦色针织衫 + 米色阔腿裤 + 帆布鞋", style: ["温柔晚秋", "居家感", "惬意"] },
                { items: "碎花连衣裙 + 淡粉针织开衫 + 绑带凉鞋", style: ["法式田园", "少女心", "浪漫"] },
                { items: "浅蓝卫衣 + 牛仔背带裤 + 棒球帽", style: ["活泼可爱", "街头感", "随性"] },
                { items: "鹅黄色开衫 + 蕾丝内搭 + 牛仔裙", style: ["明亮春夏", "复古风", "活泼"] },
                { items: "深灰色西装外套 + 黑色百褶裙 + 短靴", style: ["甜酷风", "都市感", "干练"] },
                { items: "奶茶色长裙 + 棕色皮质小挎包", style: ["森林系", "复古", "稳重"] },
                { items: "撞色毛衣 + 直筒牛仔裤 + 刺绣运动鞋", style: ["撞色系", "街头潮人", "活力"] }
            ];
            
            const chosen = outfitLibrary[Math.floor(Math.random() * outfitLibrary.length)];

            const fallback = {
                description: `听着《${song.title}》，感觉整个人都变轻盈了。今天可以试试 ${chosen.items}，这种${chosen.style.join(' & ')}的搭配，最适合此时此刻的旋律。愿你像风中飞舞的蝴蝶一样自由 ✨。`,
                humanKeywords: [...chosen.style, (song.keywords && song.keywords[0]) || "治愈系"],
                catAccessory: chosenAccessory,
                catAccessoryName: ACCESSORY_NAMES_ZH[chosenAccessory] || "随机萌物挂件"
            };
            setSuggestion(fallback);
        } finally {
            setLoading(false);
        }
    }
  };

  return (
    <div className="min-h-screen bg-[#fff1f2] font-sans text-stone-800 p-4 md:p-8 flex flex-col items-center relative overflow-hidden pb-32">
      <HandDrawnBg />
      
      {/* Primary Audio Player for Songs */}
      <audio 
        ref={audioRef} 
        preload="auto"
        onPlay={() => { setIsPlaying(true); setIsBuffering(false); }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
        onError={handleAudioError} 
        onEnded={() => {
            setIsPlaying(false);
            drawCard();
        }}
      />
      {/* Ambience Audio */}
      <audio ref={bgMusicRef} preload="metadata" />

      {/* Header */}
      <div className="w-full max-w-md mb-2 flex justify-between items-center px-1">
        <Clock weather={weatherContext} />
      </div>

      <header className="w-full max-w-md mb-8 flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-2xl border-2 border-pink-100 z-50 shadow-[4px_4px_0px_0px_rgba(251,113,133,0.1)]">
        <div className="flex items-center gap-2">
          <CatIcon className="w-6 h-6 text-pink-400" />
          <h1 className="font-black text-lg tracking-tight text-pink-500 italic">Neko Music Box</h1>
        </div>
        <div className="flex gap-1 md:gap-2">
            <button 
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-pink-100 rounded-full transition-colors group"
                title="Sync Playlist"
            >
                <Settings className="w-4 h-4 md:w-5 md:h-5 text-stone-400 group-hover:text-pink-500" />
            </button>
            <button 
                onClick={() => setShowQR(true)}
                className="p-2 hover:bg-pink-100 rounded-full transition-colors group"
                title="Share via QR"
            >
                <Share2 className="w-4 h-4 md:w-5 md:h-5 text-stone-400 group-hover:text-pink-500" />
            </button>
            <button 
                onClick={toggleMusic}
                className="p-2 hover:bg-pink-100 rounded-full transition-colors group"
                title="Ambience Music"
            >
                {isBgMusicPlaying ? <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-pink-400 animate-spin-slow" /> : <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-stone-400 group-hover:text-pink-500" />}
            </button>
            <button 
                onClick={() => setShowCatalog(!showCatalog)}
                className="p-2 hover:bg-pink-100 rounded-full transition-colors group"
            >
                <Music className="w-4 h-4 md:w-5 md:h-5 text-stone-400 group-hover:text-pink-500" />
            </button>
        </div>
      </header>

      {/* Settings Modal (NetEase Sync) */}
      <AnimatePresence>
        {showSettings && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-white p-8 rounded-3xl border-2 border-stone-800 shadow-[10px_10px_0px_0px_rgba(41,37,36,1)] max-w-sm w-full"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-xl">导入网易云歌单 ✨</h3>
                        <button onClick={() => setShowSettings(false)}><X className="w-6 h-6" /></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">歌单 ID</label>
                            <input 
                                type="text"
                                value={playlistId}
                                onChange={(e) => setPlaylistId(e.target.value)}
                                placeholder="输入网易云公开歌单ID"
                                className="w-full p-4 bg-stone-50 border-2 border-stone-100 rounded-2xl focus:border-pink-400 outline-none transition-colors font-bold"
                            />
                            <p className="text-[10px] text-stone-400 mt-2 italic font-medium">提示：歌单ID在分享链接中，如 playlist?id=24381616</p>
                        </div>
                        <button 
                            onClick={syncPlaylist}
                            disabled={syncLoading}
                            className="w-full py-4 bg-pink-400 text-white font-black rounded-2xl border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] flex items-center justify-center gap-2 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50"
                        >
                            {syncLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                            同步歌单歌曲
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-white p-8 rounded-3xl border-2 border-stone-800 shadow-[10px_10px_0px_0px_rgba(41,37,36,1)] max-w-sm w-full text-center"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-xl">传送门 ✨</h3>
                        <button onClick={() => setShowQR(false)}><X className="w-6 h-6" /></button>
                    </div>
                  <div className="bg-white p-4 rounded-2xl border-2 border-pink-200 mb-6 flex justify-center shadow-inner">
                        <QRCodeSVG value={appUrl} size={180} bgColor="#ffffff" fgColor="#fb7185" level="H" />
                  </div>
                    <p className="text-sm text-stone-500 font-bold mb-2">扫一扫，把盲盒猫咪发给闺蜜吧！</p>
                    <p className="text-[10px] text-pink-400 leading-relaxed bg-pink-50 p-3 rounded-xl italic border border-pink-100">
                        ✨ 贴士：如果扫码后需要登录，请在 AI Studio 右上角点击 <span className="font-bold underline">"Share"</span>，然后将权限改为 <span className="font-bold">"Anyone with the link"</span>，这样闺蜜就能免登录直接玩啦！
                    </p>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-md flex-1 flex flex-col gap-6 z-10">
        <AnimatePresence mode="wait">
          {showCatalog ? (
             <motion.div
              key="catalog"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
             >
                <Card>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black italic">闺蜜的收藏夹</h2>
                    <button onClick={() => setShowCatalog(false)} className="text-stone-400 hover:text-stone-800 p-2 bg-stone-50 rounded-full">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {playlistSongs.length === 0 && <div className="text-center py-10 text-stone-300 italic">还没有同步歌曲哦...</div>}
                    {playlistSongs.map(song => (
                      <div 
                        key={song.id} 
                        onClick={() => { 
                          if (!loading) {
                            drawCard(song); 
                            setShowCatalog(false); 
                          }
                        }}
                        className="p-4 border-2 border-stone-100 rounded-2xl hover:border-pink-200 hover:bg-pink-50/50 transition-all flex items-center gap-3 group cursor-pointer active:scale-95"
                      >
                        <div className="w-12 h-12 bg-white border-2 border-stone-100 rounded-xl flex items-center justify-center group-hover:border-pink-400 transition-all overflow-hidden shadow-sm flex-shrink-0">
                            {song.albumArt ? (
                                <img src={song.albumArt} alt="cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                <Music className="w-5 h-5 text-stone-300 group-hover:text-pink-400" />
                            )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="font-black text-sm tracking-tight truncate">{song.title}</div>
                            <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest truncate">{song.artist}</div>
                            {suggestionCache[song.id] && (
                                <div className="flex gap-1 mt-1">
                                    {suggestionCache[song.id].humanKeywords.slice(0, 2).map((k, i) => (
                                        <span key={i} className="text-[8px] px-1.5 py-0.5 bg-pink-100 text-pink-500 rounded-full font-bold">#{k}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Heart className="w-4 h-4 text-pink-100 group-hover:text-pink-400 transition-colors" />
                      </div>
                    ))}
                  </div>
                </Card>
             </motion.div>
          ) : isFirstTime ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-white border-2 border-stone-800 rounded-3xl shadow-[8px_8px_0px_0px_rgba(41,37,36,1)]"
            >
              <div className="mb-8 relative scale-110">
                  <div className="absolute inset-0 bg-pink-100 rounded-full scale-150 blur-2xl opacity-40"></div>
                  <SketchyCat pose={pose} />
              </div>
              <h2 className="text-2xl font-black mb-4 tracking-tighter">嘿，今日份的温暖！</h2>
              <p className="text-stone-500 mb-10 leading-relaxed text-sm font-medium">
                从你的歌单收藏中随机抽取一首<br/>看看猫咪今天会穿成什么样来见你？
              </p>
                <button
                  disabled={loading || playlistSongs.length === 0}
                  onClick={() => {
                      if (!loading) drawCard();
                  }}
                  className="group relative w-full py-5 bg-pink-400 text-white font-black text-xl rounded-2xl border-2 border-stone-800 shadow-[6px_6px_0px_0px_rgba(41,37,36,1)] active:shadow-none active:translate-x-1.5 active:translate-y-1.5 transition-all overflow-hidden disabled:opacity-50"
                >
                <motion.div 
                    className="absolute inset-0 bg-white/20 -translate-x-full skew-x-12"
                    animate={{ translateX: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                />
                {playlistSongs.length === 0 ? (
                    syncLoading ? '正在读取闺蜜歌单...' : '歌单读取失败'
                ) : loading || isBuffering ? '正在开启 ✨' : '点开惊喜 ✨'}
              </button>
              {syncLoading && <div className="mt-4 text-[10px] text-stone-300 font-bold animate-pulse">正在从云端同步更多旋律...</div>}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              {/* Music Card */}
              <Card className="relative overflow-hidden group">
                <motion.div 
                    animate={loading ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="absolute -top-6 -right-6 opacity-5 pointer-events-none"
                >
                  <Music className="w-40 h-40" />
                </motion.div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-stone-50 border-2 border-stone-100 rounded-2xl flex items-center justify-center relative group-hover:border-pink-400 transition-all overflow-hidden shadow-md">
                        {currentSong?.albumArt ? (
                            <img src={currentSong.albumArt} alt="cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            <Music className="w-8 h-8 text-stone-200 group-hover:text-pink-400 transition-colors" />
                        )}
                        {audioError && (
                            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center">
                                <VolumeX className="w-6 h-6 text-white" />
                            </div>
                        )}
                        <div className="absolute top-0 right-0 w-3 h-3 bg-red-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em] mb-1">Today's Pick</div>
                        <h3 className="text-2xl font-black tracking-tight line-clamp-1">{currentSong?.title}</h3>
                        <div className="text-stone-400 text-xs font-bold italic line-clamp-1">{currentSong?.artist}</div>
                        {audioError && <div className="text-[10px] text-red-400 font-bold mt-1 animate-pulse">{audioError}</div>}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                    {currentSong?.keywords?.map(kw => (
                        <span key={kw} className="px-3 py-1.5 bg-stone-50 border border-stone-100 rounded-lg text-[10px] font-black text-stone-500 uppercase tracking-widest shadow-sm">
                        # {kw}
                        </span>
                    ))}
                </div>

                <div className="border-t-2 border-dashed border-stone-100 pt-6 min-h-[140px] relative">
                    {loading && !suggestion ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                             <RefreshCw className="w-6 h-6 text-pink-300 animate-spin mb-3" />
                             <div className="text-xs font-bold text-stone-400">正在为你构思今日穿搭...</div>
                             <div className="text-[10px] text-pink-300 mt-1">（摸摸头上的小猫咪吧！）</div>
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-4 h-4 text-pink-300" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">穿搭建议 & 悄悄话</span>
                            </div>
                            <p className="text-stone-600 leading-relaxed mb-6 text-sm font-bold bg-[#fff1f2] p-4 rounded-2xl border-2 border-pink-100/50 italic">
                                "{suggestion?.description}"
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {suggestion?.humanKeywords?.map(kw => (
                                <span key={kw} className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-black shadow-[3px_3px_0px_0px_rgba(251,113,133,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">
                                    {kw}
                                </span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
              </Card>

              {/* Cat Section - THE DRESS UP */}
              <Card className="bg-pink-50/10 border-stone-200 relative pt-12 overflow-hidden shadow-[6px_6px_0px_0px_rgba(41,37,36,1)]">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-200 via-rose-300 to-pink-200"></div>
                <div className="flex flex-col items-center">
                    <div className="mb-6 relative group">
                         <AnimatePresence mode="wait">
                            <motion.div
                                key={loading ? 'loading' : 'cat'}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.2 }}
                            >
                                <SketchyCat pose={pose} accessory={loading ? undefined : suggestion?.catAccessory} />
                            </motion.div>
                         </AnimatePresence>
                    </div>
                    
                    {!loading && suggestion && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border-2 border-stone-800 rounded-2xl py-4 px-8 shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] flex items-center gap-4 group hover:bg-pink-50 transition-colors"
                        >
                            <div className="p-3 bg-pink-100 rounded-xl group-hover:bg-white transition-colors">
                                <CatIcon className="w-5 h-5 text-pink-400" />
                            </div>
                            <div className="text-left">
                                <div className="text-[10px] font-black text-stone-300 uppercase tracking-widest leading-none mb-1.5">Today's Cat Wear</div>
                                <div className="font-black text-lg tracking-tight text-stone-800 italic">{suggestion.catAccessoryName}</div>
                            </div>
                        </motion.div>
                    )}
                </div>
              </Card>

              <button
                disabled={loading}
                onClick={() => { if (!loading) drawCard(); }}
                className="w-full py-5 bg-pink-400 text-white font-black text-lg rounded-2xl border-2 border-stone-800 shadow-[6px_6px_0px_0px_rgba(41,37,36,1)] flex items-center justify-center gap-3 active:shadow-none active:translate-x-1.5 active:translate-y-1.5 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                再次开启音乐盲盒
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Mini Player */}
      <AnimatePresence>
        {!isFirstTime && currentSong && (
            <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="fixed bottom-6 inset-x-4 md:inset-x-auto md:w-full md:max-w-md bg-white border-2 border-stone-800 rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(251,113,133,1)] z-[90] flex items-center justify-between"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div 
                        className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center shrink-0 cursor-pointer hover:bg-pink-200 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (audioRef.current) {
                                if (isPlaying) audioRef.current.pause();
                                else audioRef.current.play().catch(() => setAudioError("请点击页面任意处激活音频"));
                            }
                        }}
                    >
                        {isBuffering ? (
                            <RefreshCw className="w-5 h-5 text-pink-400 animate-spin" />
                        ) : (
                            <Music className={`w-5 h-5 text-pink-400 ${isPlaying ? 'animate-pulse' : ''}`} />
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-xs font-black truncate">{currentSong.title}</div>
                        <div className="text-[10px] text-stone-400 truncate uppercase font-bold">{currentSong.artist}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 border-r border-stone-100 mr-1">
                        <button 
                            onClick={() => {
                                const newVol = volume === 0 ? 0.8 : 0;
                                setVolume(newVol);
                                if (audioRef.current) audioRef.current.volume = newVol;
                                if (bgMusicRef.current) bgMusicRef.current.volume = newVol;
                            }}
                            className="p-1 hover:bg-stone-50 rounded"
                        >
                            {volume === 0 ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-pink-400" />}
                        </button>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={volume}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setVolume(val);
                                if (audioRef.current) audioRef.current.volume = val;
                                if (bgMusicRef.current) bgMusicRef.current.volume = val;
                            }}
                            className="w-16 md:w-20 accent-pink-400 h-1 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <button 
                        onClick={() => {
                            if (audioRef.current) {
                                if (audioRef.current.paused) audioRef.current.play();
                                else audioRef.current.pause();
                            }
                        }}
                        className="w-10 h-10 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center hover:bg-pink-100 transition-colors"
                    >
                        {isPlaying ? <Volume2 className="w-5 h-5" /> : <Music className="w-5 h-5" />}
                    </button>
                    <button 
                        onClick={() => { if (!loading) drawCard(); }}
                        className="p-2 text-stone-400 hover:text-pink-500 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-12 mb-20 text-stone-300 text-[10px] font-black tracking-[0.5em] uppercase text-center opacity-50 z-10">
        Netease Music × Bestie Pink Edition
      </footer>
    </div>
  );
}

