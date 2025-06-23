import { Play, Pause, Heart } from 'lucide-react';
import { useState, useContext, useEffect } from 'react';
import AudioContext from '../../context/AudioContext';
import { AuthContext } from '../../context/AuthContext';
import { songService } from '../../services/api';
import { toast } from 'react-hot-toast';

const SongCard = ({ song, onLike }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const { 
    currentSong, 
    isPlaying, 
    pauseSong,
    formatTime,
    playQueue
  } = useContext(AudioContext);
  
  const { user } = useContext(AuthContext);
  
  // Check if this card's song is the current playing song
  const isCurrentSong = currentSong && song && currentSong._id === song._id;
  
  // Check if song is in user's favorites when component mounts
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
  
  // Handle play/pause
  const handlePlayPause = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isCurrentSong && isPlaying) {
      pauseSong();
    } else {
      // Play just this song as a single-item queue
      playQueue([song], 0);
    }
  };
  
  // Toggle like status
  const toggleLike = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    // If user is not logged in, show message
    if (!user) {
      toast.error('Please log in to like songs');
      return;
    }
    
    try {
      // Optimistically update UI
      setIsLiked(prev => !prev);
      
      let result;
      if (isLiked) {
        // Unlike the song
        result = await songService.removeFromFavorites(song._id);
        if (result.success) {
          toast.success('Removed from Liked Songs');
        } else {
          // If API call failed, revert UI
          setIsLiked(true);
          toast.error(result.message || 'Failed to remove from Liked Songs');
        }
      } else {
        // Like the song
        result = await songService.addToFavorites(song._id);
        if (result.success) {
          toast.success('Added to Liked Songs');
        } else {
          // If API call failed, revert UI
          setIsLiked(false);
          toast.error(result.message || 'Failed to add to Liked Songs');
        }
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

  return (
    <div 
      className="p-4 rounded-md bg-chakra-dark-light/50 hover:bg-chakra-dark-light transition duration-200 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlayPause}
    >
      <div className="relative">        {/* Song cover image */}        
        <div className="aspect-square bg-black/30 rounded-md overflow-hidden shadow-lg mb-4">            
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
                  e.target.className = "w-full h-full object-contain p-6 bg-gray-800";
                }
              }}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-4xl bg-gray-800 ${isCurrentSong && isPlaying ? 'brightness-75' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
          )}
          
          {/* Play button overlay */}
          <button
            className={`absolute bottom-2 right-2 rounded-full p-3 shadow-lg 
              ${isCurrentSong && isPlaying ? 'bg-white text-black' : 'bg-chakra-accent text-white'} 
              transform transition-all duration-200 
              ${isHovered || (isCurrentSong && isPlaying) ? 'opacity-100' : 'opacity-0'} 
              hover:scale-105`}
            onClick={handlePlayPause}
          >
            {isCurrentSong && isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
          </button>
        </div>
        
        {/* Song info */}
        <h3 className={`font-semibold mb-1 truncate ${isCurrentSong ? 'text-chakra-accent' : 'text-white'}`}>
          {song.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-chakra-subtext truncate">{song.artist}</p>
          <div className="flex items-center">
            <span className="text-xs text-chakra-subtext mr-2">
              {formatTime(song.duration)}
            </span>
            <button 
              className={`p-1 rounded-full ${isLiked ? 'text-chakra-accent' : 'text-gray-400 hover:text-white'}`}
              onClick={toggleLike}
            >
              <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
