import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import { useState, useContext, useEffect } from 'react';
import { AudioContext } from '../../context/AudioContext'; // FIXED: use named import
import { toast } from 'react-hot-toast';
import { songService } from '../../services/api';

const SongRow = ({ song, index, tableView = false, onLike, playlist = null }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { 
    currentSong, 
    isPlaying, 
    playSong, 
    pauseSong, 
    formatTime,
    playQueue
  } = useContext(AudioContext);
  
  // Check if this is the currently playing song
  const isCurrentSong = currentSong && currentSong._id === song._id;
  
  // Check if song is favorited when component mounts
  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        if (!song?._id) return;
        
        // Fetch the latest favorites
        const favorites = await songService.getFavorites();
        const isFavorite = Array.isArray(favorites) && 
          favorites.some(favSong => favSong._id === song._id);
        setIsLiked(isFavorite);
      } catch (err) {
        console.error('Error checking if song is liked:', err);
      }
    };
    
    checkIfLiked();
  }, [song]);
  
  // Handle play button click
  const handlePlay = (e) => {
    e.stopPropagation();
    
    if (isCurrentSong && isPlaying) {
      pauseSong();
    } else if (isCurrentSong && !isPlaying) {
      playSong();
    } else {
      // If playlist is provided, play from that playlist starting at this song
      if (playlist && Array.isArray(playlist)) {
        playQueue(playlist, index);
      } else {
        // Fallback: Play this song as a single item queue
        playQueue([song], 0);
      }
    }
  };
  
  // Toggle like status
  const toggleLike = async (e) => {
    e.stopPropagation();
    
    try {
      if (isLiked) {
        await songService.removeFromFavorites(song._id);
        setIsLiked(false);
        toast.success('Removed from Liked Songs');
      } else {
        await songService.addToFavorites(song._id);
        setIsLiked(true);
        toast.success('Added to Liked Songs');
      }
      
      // Notify parent component if provided
      if (typeof onLike === 'function') {
        onLike();
      }
    } catch (error) {
      console.error('Error toggling like status:', error);
      toast.error("Couldn't update favorites");
    }
  };
  
  return tableView ? (
    <div 
      className={`grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 items-center p-2 px-4 text-sm rounded-md ${
        isCurrentSong ? 'bg-chakra-accent/30' : isHovered ? 'bg-chakra-dark-light/80' : 'hover:bg-chakra-dark-light/30'
      } group cursor-default transition-colors`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
    >
      {/* Track number/Play button */}
      <div className="flex items-center justify-center h-4">
        {isHovered || isPlaying && isCurrentSong ? (
          <button className="text-white focus:outline-none">
            {isPlaying && isCurrentSong ? (
              <Pause size={14} />
            ) : (
              <Play size={14} fill="currentColor" />
            )}
          </button>
        ) : (
          <span className={`font-medium ${isCurrentSong ? 'text-chakra-accent' : 'text-chakra-subtext'}`}>
            {index + 1}
          </span>
        )}
      </div>
      
      {/* Song info */}
      <div className="flex items-center overflow-hidden">
        <div className="h-10 w-10 flex-shrink-0 bg-black/30 rounded mr-3 overflow-hidden">
          {song.coverImage && song.coverImage !== 'default-cover.jpg' ? (
            <img 
              src={
                song.coverImage.startsWith('http') 
                  ? song.coverImage 
                  : song.filePath
                    ? `http://localhost:5000/music/${song.filePath.split('/').slice(0, -1).join('/')}/cover.jpg`
                    : `http://localhost:5000/uploads/${song.coverImage}`
              } 
              alt={song.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                if (!e.target.dataset.retried) {
                  e.target.dataset.retried = true;
                  e.target.src = `http://localhost:5000/uploads/${song.coverImage || 'default-cover.jpg'}`;
                } else {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1'><path d='M9 18V5l12-2v13'></path><circle cx='6' cy='18' r='3'></circle><circle cx='18' cy='16' r='3'></circle></svg>";
                  e.target.className = "w-full h-full object-contain p-2 bg-gray-800";
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className={`font-medium truncate ${isCurrentSong ? 'text-chakra-accent' : 'text-white'}`}>
            {song.title}
          </h3>
        </div>
      </div>
      
      {/* Album */}
      <div className="truncate text-chakra-subtext">{song.album || '-'}</div>
      
      {/* Artist */}
      <div className="truncate text-chakra-subtext">{song.artist || 'Unknown'}</div>
      
      {/* Duration + Actions */}
      <div className="flex items-center justify-end">
        <button 
          className={`p-1 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity ${
            isLiked ? 'text-chakra-accent opacity-100' : 'text-chakra-subtext hover:text-white'
          }`}
          onClick={toggleLike}
        >
          <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
        <span className="text-chakra-subtext">{formatTime(song.duration)}</span>
        <button className="p-1 rounded-full ml-3 text-chakra-subtext hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  ) : (
    <div 
      className={`flex items-center p-2 rounded-md ${
        isCurrentSong ? 'bg-chakra-accent/30' : isHovered ? 'bg-chakra-dark-light/80' : 'hover:bg-chakra-dark-light/30'
      } transition-colors cursor-pointer group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
    >
      <div className="mr-3 flex-shrink-0 relative">
        <div className="h-12 w-12 bg-black/30 rounded overflow-hidden">
          {song.coverImage && song.coverImage !== 'default-cover.jpg' ? (
            <img 
              src={
                song.coverImage.startsWith('http') 
                  ? song.coverImage 
                  : song.filePath
                    ? `http://localhost:5000/music/${song.filePath.split('/').slice(0, -1).join('/')}/cover.jpg`
                    : `http://localhost:5000/uploads/${song.coverImage}`
              } 
              alt={song.title} 
              className={`w-full h-full object-cover ${isCurrentSong && isPlaying ? 'brightness-75' : ''}`}
              onError={(e) => {
                if (!e.target.dataset.retried) {
                  e.target.dataset.retried = true;
                  e.target.src = `http://localhost:5000/uploads/${song.coverImage || 'default-cover.jpg'}`;
                } else {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1'><path d='M9 18V5l12-2v13'></path><circle cx='6' cy='18' r='3'></circle><circle cx='18' cy='16' r='3'></circle></svg>";
                  e.target.className = "h-full w-full object-contain p-2 bg-gray-800";
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
          )}
          
          {isHovered && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              {isCurrentSong && isPlaying ? (
                <Pause size={18} className="text-white" />
              ) : (
                <Play size={18} className="text-white" fill="currentColor" />
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-grow min-w-0">
        <h3 className={`font-medium truncate ${isCurrentSong ? 'text-chakra-accent' : 'text-white'}`}>
          {song.title}
        </h3>
        <p className="text-sm text-chakra-subtext truncate">{song.artist}</p>
      </div>
      
      <div className="flex-shrink-0 flex items-center ml-4">
        <button 
          className={`p-1 rounded-full ${
            isLiked ? 'text-chakra-accent' : 'text-chakra-subtext hover:text-white opacity-0 group-hover:opacity-100'
          } transition-opacity`}
          onClick={toggleLike}
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
        <span className="ml-3 text-xs text-chakra-subtext">{formatTime(song.duration)}</span>
        <button className="ml-3 p-1 rounded-full text-chakra-subtext hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};

export default SongRow;
