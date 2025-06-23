import { useContext, useState, useEffect } from 'react';
import { X, GripVertical } from 'lucide-react';
import { AudioContext } from '../../context/AudioContext'; // FIXED: use named import

const QueueDisplay = ({ isOpen, onClose }) => {
  const { 
    queue, 
    queueIndex, 
    currentSong, 
    isPlaying,
    playSong
  } = useContext(AudioContext);
  
  const [currentQueue, setCurrentQueue] = useState([]);
  
  // Update current queue when the queue changes
  useEffect(() => {
    if (queue.length) {
      setCurrentQueue([...queue]);
    }
  }, [queue]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-chakra-dark-light border-l border-gray-800 shadow-lg z-30 
      flex flex-col overflow-hidden transform transition-transform duration-300 ease-out"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
        <h3 className="font-semibold text-white">Now Playing</h3>
        <button 
          className="p-1 text-chakra-subtext hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Queue Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {currentQueue.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-chakra-subtext">Queue is empty</p>
          </div>
        ) : (
          <div>
            {/* Currently Playing */}
            <div className="mb-4">
              <h4 className="text-xs uppercase font-semibold text-chakra-subtext px-2 mb-1">
                Now Playing
              </h4>
              
              {queueIndex < queue.length && (
                <div className="bg-chakra-accent/10 rounded p-2">
                  <QueueItem 
                    song={queue[queueIndex]} 
                    isActive={true} 
                    onClick={() => {}} // Already playing
                  />
                </div>
              )}
            </div>
            
            {/* Next Up */}
            <div>
              <h4 className="text-xs uppercase font-semibold text-chakra-subtext px-2 mb-1">
                Next Up
              </h4>
              
              {currentQueue.slice(queueIndex + 1).map((song, index) => (
                <QueueItem 
                  key={`${song._id}-${index}`} 
                  song={song} 
                  isActive={false}
                  onClick={() => playSong(song)}
                  // In a real app, we would implement drag and drop reordering here
                />
              ))}
              
              {currentQueue.slice(0, queueIndex).map((song, index) => (
                <QueueItem 
                  key={`${song._id}-${index}`} 
                  song={song} 
                  isActive={false}
                  onClick={() => playSong(song)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Individual queue item component
const QueueItem = ({ song, isActive, onClick }) => (
  <div 
    className={`flex items-center p-2 rounded hover:bg-chakra-dark-light/50 ${
      isActive ? 'text-chakra-accent' : 'text-white'
    } cursor-pointer group`}
    onClick={onClick}
  >
    <div className="flex-shrink-0 mr-3 opacity-0 group-hover:opacity-100 cursor-grab">
      <GripVertical size={16} className="text-chakra-subtext" />
    </div>
    
    <div className="h-10 w-10 bg-gray-800 rounded overflow-hidden flex-shrink-0 mr-3">
      {song.coverImage ? (
        <img 
          src={`http://localhost:5000/uploads/${song.coverImage}`}
          alt={song.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-lg">
          🎵
        </div>
      )}
    </div>
    
    <div className="overflow-hidden">
      <p className="text-sm font-medium truncate">{song.title}</p>
      <p className="text-xs text-chakra-subtext truncate">{song.artist}</p>
    </div>
  </div>
);

export default QueueDisplay;
