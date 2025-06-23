import { createContext, useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
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
  const [originalQueue, setOriginalQueue] = useState([]); // Store the original queue when shuffle is enabled
  
  // Audio element reference
  const audioRef = useRef(null);
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    // Set initial volume
    audioRef.current.volume = volume;
    
    // Event listeners
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeat) {
        // Repeat the current song
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.error('Error repeating song:', error);
        });
      } else {
        skipToNext();
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
    
    // Clean up
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [isRepeat]);
  
  // Play song function
  const playSong = (song) => {
    if (!song) return;
    
    // If this is a different song than current
    if (!currentSong || currentSong._id !== song._id) {
      setCurrentSong(song);
        // Set audio source
      // Handle both direct filePaths and nested paths
      const audioUrl = `http://localhost:5000/music/${song.filePath}`;
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      
      // Reset current time
      setCurrentTime(0);
    }
    
    // Play the audio
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(error => {
        console.error('Playback failed:', error);
        toast.error('Unable to play this song');
      });
  };
  
  // Pause song function
  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else if (currentSong) {
      playSong(currentSong);
    }
  };
  
  // Seek to position
  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  // Set the volume
  const setAudioVolume = (newVolume) => {
    const volumeValue = Math.min(1, Math.max(0, newVolume));
    setVolume(volumeValue);
    
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
      setIsMuted(volumeValue === 0);
    }
  };
  
  // Toggle mute
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
  
  // Shuffle the queue
  const shuffleQueue = (songs) => {
    // Create a copy of the array
    const shuffled = [...songs];
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  };
  
  // Toggle repeat mode
  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };
  
  // Toggle shuffle mode
  const toggleShuffle = () => {
    const newShuffleState = !isShuffle;
    setIsShuffle(newShuffleState);
    
    if (newShuffleState) {
      // Store original queue and shuffle current queue
      setOriginalQueue([...queue]);
      
      // If we have a current song, make sure it stays as the current song
      // by removing it first and adding it back at the current position
      if (currentSong && queueIndex !== undefined) {
        const currentSongIndex = queueIndex;
        const newQueue = [...queue];
        const currentSongItem = newQueue.splice(currentSongIndex, 1)[0];
        
        // Shuffle the rest
        const shuffledRest = shuffleQueue(newQueue);
        
        // Insert the current song back at its position
        shuffledRest.splice(currentSongIndex, 0, currentSongItem);
        setQueue(shuffledRest);
      } else {
        // No current song, just shuffle the whole queue
        setQueue(shuffleQueue(queue));
      }
    } else {
      // Restore original queue
      if (originalQueue.length > 0) {
        // Find current song in original queue
        const originalIndex = currentSong ? originalQueue.findIndex(song => song._id === currentSong._id) : 0;
        setQueue(originalQueue);
        setQueueIndex(originalIndex !== -1 ? originalIndex : 0);
      }
    }
  };
  
  // Play a queue of songs
  const playQueue = (songs, startIndex = 0) => {
    if (!songs || songs.length === 0) return;
    
    // Set the original queue and apply shuffle if needed
    const songsToPlay = isShuffle ? shuffleQueue(songs) : songs;
    
    setOriginalQueue(songs);
    setQueue(songsToPlay);
    setQueueIndex(startIndex);
    playSong(songsToPlay[startIndex]);
  };
  
  // Skip to next song
  const skipToNext = () => {
    if (queue.length === 0) return;
    
    const nextIndex = (queueIndex + 1) % queue.length;
    setQueueIndex(nextIndex);
    playSong(queue[nextIndex]);
  };
  
  // Skip to previous song
  const skipToPrevious = () => {
    if (queue.length === 0) return;
    
    // If current time > 3 seconds, restart the song instead
    if (currentTime > 3) {
      seekTo(0);
      return;
    }
    
    const prevIndex = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prevIndex);
    playSong(queue[prevIndex]);
  };
  
  // Format time in mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <AudioContext.Provider
      value={{
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
        skipToNext,
        skipToPrevious,
        formatTime
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContext;
