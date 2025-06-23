import { useState, useEffect, useRef, useContext } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, 
  Repeat, Shuffle, ListMusic, Heart, Maximize2, Minimize2, PlusCircle
} from 'lucide-react';
import { AudioContext } from '../../context/AudioContext'; // FIXED: use named import
import QueueDisplay from '../ui/QueueDisplay';
import AddToPlaylistMenu from '../ui/AddToPlaylistMenu';
import { toast } from 'react-hot-toast';

const PlayerBar = () => {
  // Audio context for player controls
  const {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    isRepeat,
    isShuffle,
    togglePlayPause,
    seekTo,
    setVolume: setAudioVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    skipToNext,
    skipToPrevious,
    formatTime,
    likedSongs, // Get liked songs from context
    toggleLike, // Get toggle function from context
  } = useContext(AudioContext);

  // Local state
  const [isExpanded, setIsExpanded] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isPlaylistMenuOpen, setIsPlaylistMenuOpen] = useState(false);
  
  // References
  const progressBarRef = useRef(null);
  
  // Determine if the current song is liked
  const isCurrentSongLiked = currentSong && likedSongs.has(currentSong._id);

  // Handle progress bar clicks
  const handleProgressChange = (e) => {
    if (!currentSong) return;
    
    const clickPosition = (e.clientX - progressBarRef.current.getBoundingClientRect().left) / 
                          progressBarRef.current.offsetWidth;
    const newTime = clickPosition * duration;
    seekTo(newTime);
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setAudioVolume(newVolume);
  };
  
  // Handle toggling like status
  const handleToggleLike = () => {
    if (currentSong) {
      toggleLike(currentSong._id);
    }
  };

  // Toggle queue display
  const toggleQueueDisplay = () => {
    setIsQueueOpen(!isQueueOpen);
  };

  // Volume icon based on volume level
  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };  return (
    <>
      <QueueDisplay isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      {currentSong && (
        <AddToPlaylistMenu 
          song={currentSong} 
          isOpen={isPlaylistMenuOpen} 
          onClose={() => setIsPlaylistMenuOpen(false)} 
        />
      )}
      <div className={`fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-3 flex items-center z-20 ${!currentSong ? 'opacity-80' : ''}`}>
        {/* Currently playing song info */}
        <div className="flex items-center w-1/4">
          {currentSong ? (
            <>              <div className="h-14 w-14 bg-gray-700 rounded shadow-md mr-3 flex-shrink-0 overflow-hidden">                  {currentSong.coverImage && currentSong.coverImage !== 'default-cover.jpg' ? (
                  <img 
                    src={
                      currentSong.coverImage.startsWith('http') 
                        ? currentSong.coverImage 
                        : currentSong.filePath
                          ? `http://localhost:5000/music/${currentSong.filePath.split('/').slice(0, -1).join('/')}/cover.jpg`
                          : `http://localhost:5000/uploads/${currentSong.coverImage}`
                    } 
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (!e.target.dataset.retried) {
                        e.target.dataset.retried = true;
                        e.target.src = `http://localhost:5000/uploads/${currentSong.coverImage || 'default-cover.jpg'}`;
                      } else {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1'><path d='M9 18V5l12-2v13'></path><circle cx='6' cy='18' r='3'></circle><circle cx='18' cy='16' r='3'></circle></svg>";
                        e.target.className = "w-full h-full p-4 bg-gray-800";
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1">
                      <path d="M9 18V5l12-2v13"></path>
                      <circle cx="6" cy="18" r="3"></circle>
                      <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-medium text-white truncate">{currentSong.title}</h4>
                <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
              </div>
              <button 
                className={`ml-4 p-1 rounded-full ${isCurrentSongLiked ? 'text-chakra-accent' : 'text-gray-400 hover:text-white'}`}
                onClick={handleToggleLike}
                title="Like"
              >
                <Heart size={16} fill={isCurrentSongLiked ? 'currentColor' : 'none'} />
              </button>
              <button 
                className="ml-2 p-1 rounded-full text-gray-400 hover:text-white"
                onClick={() => setIsPlaylistMenuOpen(true)}
                title="Add to playlist"
              >
                <PlusCircle size={16} />
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-400">No song selected</p>
          )}
        </div>
        
        {/* Playback controls */}
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center mb-2">
            <button 
              className={`mx-2 ${isShuffle ? 'text-chakra-accent' : 'text-gray-400 hover:text-white'}`}
              onClick={toggleShuffle}
              disabled={!currentSong}
            >
              <Shuffle size={18} />
            </button>
            <button 
              className="mx-2 text-gray-400 hover:text-white"
              onClick={skipToPrevious}
              disabled={!currentSong}
            >
              <SkipBack size={18} />
            </button>
            <button 
              className="mx-2 bg-white rounded-full p-2 text-black hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={togglePlayPause}
              disabled={!currentSong}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
            </button>
            <button 
              className="mx-2 text-gray-400 hover:text-white"
              onClick={skipToNext}
              disabled={!currentSong}
            >
              <SkipForward size={18} />
            </button>
            <button 
              className={`mx-2 ${isRepeat ? 'text-chakra-accent' : 'text-gray-400 hover:text-white'}`}
              onClick={toggleRepeat}
              disabled={!currentSong}
            >
              <Repeat size={18} />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="flex items-center w-full max-w-lg">
            <span className="text-xs text-gray-400 w-10 text-right">
              {currentSong ? formatTime(currentTime) : '0:00'}
            </span>
            <div 
              className="mx-2 h-1 rounded-full bg-gray-700 flex-1 cursor-pointer relative"
              ref={progressBarRef}
              onClick={currentSong ? handleProgressChange : undefined}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-chakra-accent rounded-full"
                style={{ width: `${currentSong ? (currentTime / (duration || 1)) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400 w-10">
              {currentSong ? formatTime(duration || 0) : '0:00'}
            </span>
          </div>
        </div>
        
        {/* Volume controls and extra buttons */}
        <div className="flex items-center justify-end w-1/4">
          <button 
            className={`mx-2 ${isQueueOpen ? 'text-chakra-accent' : 'text-gray-400 hover:text-white'}`}
            onClick={toggleQueueDisplay}
          >
            <ListMusic size={18} />
          </button>
          <button 
            className="mx-2 text-gray-400 hover:text-white"
            onClick={toggleMute}
          >
            <VolumeIcon />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 accent-chakra-accent"
          />
          <button 
            className="ml-4 text-gray-400 hover:text-white"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={!currentSong}
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>
    </>
  );
};

export default PlayerBar;
