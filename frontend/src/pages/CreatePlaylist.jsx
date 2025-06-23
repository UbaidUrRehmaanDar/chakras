import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Save, ArrowLeft } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import SongRow from '../components/ui/SongRow';
import { songService, playlistService } from '../services/api';
import { toast } from 'react-hot-toast';

const CreatePlaylist = () => {
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const allSongs = await songService.getAllSongs();
        setSongs(allSongs);
        setError(null);
      } catch (err) {
        console.error('Error fetching songs:', err);
        setError('Failed to load songs');
        toast.error('Failed to load songs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSongs();
  }, []);
  
  const handleSongToggle = (song) => {
    setSelectedSongs(prevSelected => {
      const songIndex = prevSelected.findIndex(s => s._id === song._id);
      
      if (songIndex !== -1) {
        // Remove from selection
        const newSelection = [...prevSelected];
        newSelection.splice(songIndex, 1);
        return newSelection;
      } else {
        // Add to selection
        return [...prevSelected, song];
      }
    });
  };
  
  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }
    
    if (selectedSongs.length === 0) {
      toast.error('Please select at least one song');
      return;
    }
    
    try {
      setSaving(true);
      
      // Create the playlist
      const newPlaylist = await playlistService.createPlaylist(playlistName);
      
      // Add songs to the playlist
      for (const song of selectedSongs) {
        await playlistService.addSongToPlaylist(newPlaylist._id, song._id);
      }
      
      toast.success('Playlist created successfully!');
      navigate(`/playlist/${newPlaylist._id}`);
    } catch (err) {
      console.error('Error creating playlist:', err);
      toast.error('Failed to create playlist');
    } finally {
      setSaving(false);
    }
  };
  
  const isSongSelected = (songId) => {
    return selectedSongs.some(song => song._id === songId);
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button 
            className="mr-4 p-2 rounded-full hover:bg-chakra-dark-light"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Create New Playlist</h1>
        </div>
        
        {/* Playlist details form */}
        <div className="bg-chakra-dark-light/30 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-center">
            <div className="w-full aspect-square bg-chakra-dark-light/50 rounded-md flex items-center justify-center text-5xl">
              {selectedSongs.length > 0 ? (
                <div className="grid grid-cols-2 w-full h-full">
                  {selectedSongs.slice(0, 4).map((song, idx) => (
                    <div key={idx} className="w-full h-full overflow-hidden">
                      {song.coverImage ? (
                        <img 
                          src={`http://localhost:5000/uploads/${song.coverImage}`} 
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-xl">
                          🎵
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <PlusCircle size={64} className="text-chakra-subtext" />
              )}
            </div>
            
            <div>
              <div className="mb-4">
                <label htmlFor="playlist-name" className="block text-sm font-medium text-chakra-subtext mb-1">
                  Playlist Name
                </label>
                <input
                  type="text"
                  id="playlist-name"
                  className="w-full bg-chakra-dark px-4 py-2 rounded text-white outline-none focus:ring-1 focus:ring-chakra-accent"
                  placeholder="Enter a name for your playlist"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                />
              </div>
              
              <div className="flex items-center text-sm">
                <span className="text-chakra-subtext mr-2">
                  {selectedSongs.length} {selectedSongs.length === 1 ? 'song' : 'songs'} selected
                </span>
                <button
                  className="flex items-center px-4 py-2 bg-chakra-accent text-white rounded-full ml-auto hover:opacity-90 transition-opacity disabled:opacity-50"
                  onClick={handleCreatePlaylist}
                  disabled={saving || selectedSongs.length === 0 || !playlistName.trim()}
                >
                  <Save size={16} className="mr-2" />
                  {saving ? 'Saving...' : 'Save Playlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Available songs */}
        <div className="mb-24">
          <h2 className="text-xl font-bold mb-4">Select Songs</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chakra-accent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 text-red-200 p-4 rounded-md">
              {error}
            </div>
          ) : (
            <div className="bg-chakra-dark-light/30 rounded-md overflow-hidden">
              <div className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 p-2 px-4 border-b border-gray-700/50 text-sm text-chakra-subtext font-medium">
                <div>#</div>
                <div>Title</div>
                <div>Album</div>
                <div>Artist</div>
                <div className="text-right">Duration</div>
              </div>
              
              <div className="px-2">
                {songs.map((song, index) => (
                  <div
                    key={song._id}
                    className={`py-1 ${isSongSelected(song._id) ? 'bg-chakra-accent/10' : ''}`}
                    onClick={() => handleSongToggle(song)}
                  >
                    <SongRow 
                      song={song} 
                      index={index} 
                      tableView={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CreatePlaylist;
