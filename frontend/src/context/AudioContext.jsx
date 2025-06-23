import { createContext, useState, useRef, useEffect, useContext, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { songService } from '../services/api';
import { AuthContext } from './AuthContext';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  // Audio state
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [likedSongs, setLikedSongs] = useState(new Set());
  
  // --- Refs for stable functions ---
  const audioRef = useRef(null);
  const isPlayingRef = useRef(isPlaying);
  const isRepeatRef = useRef(isRepeat);
  const queueRef = useRef(queue);
  const queueIndexRef = useRef(queueIndex);
  const currentSongRef = useRef(currentSong);
  const skipToNextRef = useRef();

  // --- Keep refs in sync with state ---
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { isRepeatRef.current = isRepeat; }, [isRepeat]);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { queueIndexRef.current = queueIndex; }, [queueIndex]);
  useEffect(() => { currentSongRef.current = currentSong; }, [currentSong]);

  // --- Stable Player Functions ---
  const playSong = useCallback((song) => {
    if (!song) return;
    
    console.log(`Play command: ${song.title}`); // DEBUG
    setCurrentSong(song);
    audioRef.current.src = `http://localhost:5000/music/${song.filePath}`;
    
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
      }).catch(error => {
        if (error.name === 'AbortError') return;
        console.error('Playback failed:', error);
        toast.error('Unable to play this song');
        setIsPlaying(false);
      });
    }
  }, []);

  const pauseSong = useCallback(() => {
    console.log(`Pause command`); // DEBUG
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlayingRef.current) {
      pauseSong();
    } else if (currentSongRef.current) {
      playSong(currentSongRef.current);
    }
  }, [playSong, pauseSong]);

  const seekTo = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);
  const skipToNext = useCallback(() => {
    console.log('Skip to next command - Queue:', queueRef.current.length, 'Index:', queueIndexRef.current); // DEBUG
    const currentQueue = queueRef.current;
    
    if (currentQueue.length === 0) {
      console.log('No queue available for skip');
      return;
    }
    
    if (currentQueue.length === 1) {
      console.log('Only one song in queue, staying on same song');
      // If only one song, restart it or stay on it
      if (isRepeatRef.current) {
        seekTo(0);
      }
      return;
    }
    
    // Only go to next if not at the end
    if (queueIndexRef.current < currentQueue.length - 1) {
      const nextIndex = queueIndexRef.current + 1;
      console.log('Moving to next song, index:', nextIndex);
      playSong(currentQueue[nextIndex]);
      setQueueIndex(nextIndex);
    } else {
      // At the end of queue
      if (isRepeatRef.current) {
        console.log('Repeat enabled, going to first song');
        playSong(currentQueue[0]);
        setQueueIndex(0);
      } else {
        console.log('At end of queue, no repeat');
        // Stay at current song
      }
    }
  }, [playSong, seekTo]);
    const skipToPrevious = useCallback(() => {
    console.log('Skip to previous command - Queue:', queueRef.current.length, 'Index:', queueIndexRef.current); // DEBUG
    const currentQueue = queueRef.current;
    
    if (currentQueue.length === 0) {
      console.log('No queue available for skip');
      return;
    }
    
    // If more than 3 seconds have passed, restart current song
    if (audioRef.current && audioRef.current.currentTime > 3) {
      console.log('Restarting current song (>3 seconds)');
      seekTo(0);
      return;
    }
    
    if (currentQueue.length === 1) {
      console.log('Only one song in queue, restarting');
      seekTo(0);
      return;
    }
    
    // Only go to previous if not at the start
    if (queueIndexRef.current > 0) {
      const prevIndex = queueIndexRef.current - 1;
      console.log('Moving to previous song, index:', prevIndex);
      playSong(currentQueue[prevIndex]);
      setQueueIndex(prevIndex);
    } else {
      // At the beginning of queue
      if (isRepeatRef.current) {
        console.log('Repeat enabled, going to last song');
        playSong(currentQueue[currentQueue.length - 1]);
        setQueueIndex(currentQueue.length - 1);
      } else {
        console.log('At beginning of queue, restarting current song');
        seekTo(0);
      }
    }
  }, [playSong, seekTo]);

  // --- Effect for Audio Element ---
  useEffect(() => {
    skipToNextRef.current = skipToNext;
  }, [skipToNext]);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;
    
    audio.volume = volume;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      console.log('Song ended'); // DEBUG
      if (isRepeatRef.current) {
        audio.currentTime = 0;
        audio.play();
      } else {
        skipToNextRef.current?.();
      }
    };
    const handleError = () => {
      toast.error('Error playing this track');
      setIsPlaying(false);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []); // This useEffect should only run once.

  // --- Other Functions ---
  useEffect(() => {
    if (user) {
      fetchLikedSongs();
    } else {
      setLikedSongs(new Set());
    }
  }, [user]);

  const fetchLikedSongs = async () => {
    try {
      const favorites = await songService.getFavorites();
      setLikedSongs(new Set(favorites.map(song => song._id)));
    } catch (error) {
      console.error('Failed to fetch liked songs:', error);
    }
  };

  const toggleLike = async (songId) => {
    const newLikedSongs = new Set(likedSongs);
    let message = '';

    try {
      if (newLikedSongs.has(songId)) {
        await songService.removeFromFavorites(songId);
        newLikedSongs.delete(songId);
        message = 'Removed from Liked Songs';
      } else {
        await songService.addToFavorites(songId);
        newLikedSongs.add(songId);
        message = 'Added to Liked Songs';
      }
      
      setLikedSongs(newLikedSongs);
      toast.success(message);
      
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update liked songs.');
    }
  };
  
  const setAudioVolume = (newVolume) => {
    const volumeValue = Math.min(1, Math.max(0, newVolume));
    setVolume(volumeValue);
    
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
      setIsMuted(volumeValue === 0);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };
  
  const shuffleQueue = (songs) => {
    const shuffled = [...songs];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };
  
  const toggleShuffle = () => {
    const newShuffleState = !isShuffle;
    setIsShuffle(newShuffleState);
    
    if (newShuffleState) {
      setOriginalQueue([...queue]);
      if (currentSong && queueIndex !== undefined) {
        const currentSongIndex = queueIndex;
        const newQueue = [...queue];
        const currentSongItem = newQueue.splice(currentSongIndex, 1)[0];
        const shuffledRest = shuffleQueue(newQueue);
        shuffledRest.splice(currentSongIndex, 0, currentSongItem);
        setQueue(shuffledRest);
      } else {
        setQueue(shuffleQueue(queue));
      }
    } else {
      if (originalQueue.length > 0) {
        const originalIndex = currentSong ? originalQueue.findIndex(song => song._id === currentSong._id) : 0;
        setQueue(originalQueue);
        setQueueIndex(originalIndex !== -1 ? originalIndex : 0);
      }
    }
  };
  
  const playQueue = (songs, startIndex = 0) => {
    if (!songs || songs.length === 0) return;
    const songsToPlay = isShuffle ? shuffleQueue(songs) : songs;
    setOriginalQueue(songs);
    setQueue(songsToPlay);
    setQueueIndex(startIndex);
    playSong(songsToPlay[startIndex]);
  };
  
  const addToQueue = (song) => {
    if (!song) return;
    if (queue.find((s) => s._id === song._id)) {
      toast('Song is already in queue.');
      return;
    }
    const newQueue = [...queue, song];
    setQueue(newQueue);
    toast.success('Added to queue');
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const value = {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    queue,
    queueIndex,
    isRepeat,
    isShuffle,
    playSong,
    pauseSong,
    togglePlayPause,
    seekTo,
    setVolume: setAudioVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    playQueue,
    addToQueue,
    skipToNext,
    skipToPrevious,
    formatTime,
    likedSongs,
    toggleLike,
    fetchLikedSongs,
  };  
  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

// Default export for compatibility
export default AudioProvider;
