import { useState, useEffect } from 'react';
import { Plus, Check, Info } from 'lucide-react';
import { playlistService } from '../../services/api';
import { toast } from 'react-hot-toast';

const AddToPlaylistMenu = ({ song, isOpen, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSongInPlaylist, setIsSongInPlaylist] = useState({});

  // Fetch user playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!isOpen) return;
      
      try {
        setLoading(true);
        const data = await playlistService.getAllPlaylists();
        setPlaylists(data);
        
        // Check if song is already in each playlist
        const songInPlaylistMap = {};
        data.forEach(playlist => {
          songInPlaylistMap[playlist._id] = playlist.songs.some(
            playlistSong => playlistSong._id === song._id
          );
        });
        
        setIsSongInPlaylist(songInPlaylistMap);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setError('Could not fetch your playlists');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [isOpen, song._id]);

  // Add song to playlist
  const addToPlaylist = async (playlistId) => {
    try {
      if (isSongInPlaylist[playlistId]) {
        toast.success('Song is already in this playlist');
        return;
      }
      
      await playlistService.addSongToPlaylist(playlistId, song._id);
      setIsSongInPlaylist({...isSongInPlaylist, [playlistId]: true});
      toast.success('Song added to playlist');
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      toast.error('Failed to add song to playlist');
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-chakra-dark-light rounded-lg shadow-lg w-full max-w-sm overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Add to Playlist</h3>
          <div className="mt-2 flex items-center">            {song.coverImage && song.coverImage !== 'default-cover.jpg' ? (
              <img 
                src={
                  song.coverImage.startsWith('http') 
                    ? song.coverImage 
                    : song.filePath
                      ? `http://localhost:5000/music/${song.filePath.split('/').slice(0, -1).join('/')}/cover.jpg`
                      : `http://localhost:5000/uploads/${song.coverImage}`
                }
                alt={song.title}
                className="h-10 w-10 object-cover rounded-sm mr-3"
                onError={(e) => {
                  if (!e.target.dataset.retried) {
                    e.target.dataset.retried = true;
                    e.target.src = `http://localhost:5000/uploads/${song.coverImage || 'default-cover.jpg'}`;
                  } else {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='1'><path d='M9 18V5l12-2v13'></path><circle cx='6' cy='18' r='3'></circle><circle cx='18' cy='16' r='3'></circle></svg>";
                    e.target.className = "h-10 w-10 p-2 bg-gray-800 rounded-sm mr-3";
                  }
                }}
              />
            ) : (
              <div className="h-10 w-10 flex items-center justify-center bg-gray-800 rounded-sm mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1">
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
              </div>
            )}
            <div className="truncate">
              <p className="text-sm font-medium text-white truncate">{song.title}</p>
              <p className="text-xs text-chakra-subtext truncate">{song.artist}</p>
            </div>
          </div>
        </div>
        
        <div className="max-h-60 overflow-y-auto p-2">
          {loading ? (
            <div className="p-4 text-center text-chakra-subtext">Loading playlists...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-400">{error}</div>
          ) : playlists.length === 0 ? (
            <div className="p-4 text-center text-chakra-subtext">
              <Info size={24} className="mx-auto mb-2" />
              You don't have any playlists yet
            </div>
          ) : (
            playlists.map(playlist => (
              <div 
                key={playlist._id}
                onClick={() => addToPlaylist(playlist._id)}
                className="flex items-center justify-between p-3 hover:bg-chakra-dark/50 rounded-md cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-800 rounded-sm flex items-center justify-center text-chakra-accent mr-3">
                    {playlist.coverImage ? (
                      <img 
                        src={`http://localhost:5000/uploads/${playlist.coverImage}`}
                        alt={playlist.name}
                        className="h-full w-full object-cover rounded-sm"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5"></path>
                        <polygon points="9 15 9 19 13 17 9 15"></polygon>
                      </svg>
                    )}
                  </div>
                  <span className="text-white text-sm">{playlist.name}</span>
                </div>
                
                {isSongInPlaylist[playlist._id] ? (
                  <Check size={18} className="text-chakra-accent" />
                ) : (
                  <Plus size={18} className="text-chakra-subtext" />
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button 
            className="px-4 py-2 bg-chakra-dark hover:bg-chakra-dark-light transition rounded-md text-white text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistMenu;
