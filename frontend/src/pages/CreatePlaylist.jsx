import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Save, ArrowLeft, Upload, Image, Globe, Lock } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import SongRow from '../components/ui/SongRow';
import { songService, playlistService } from '../services/api';
import { toast } from 'react-hot-toast';

const CreatePlaylist = () => {
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
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
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file size must be less than 5MB');
        return;
      }
      
      setCoverImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
    const handleCreatePlaylist = async () => {
    console.log('Create playlist button clicked'); // Debug
    console.log('Playlist name:', playlistName.trim()); // Debug
    console.log('Selected songs:', selectedSongs.length); // Debug
    
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
      const playlistData = {
        name: playlistName.trim(),
        description: playlistDescription.trim(),
        isPublic: isPublic
      };
      
      console.log('Creating playlist with data:', playlistData); // Debug
      
      const response = await playlistService.createPlaylist(playlistData);
      console.log('Playlist created response:', response); // Debug
      
      const newPlaylistId = response._id;
      
      // Upload cover image if provided
      if (coverImage && newPlaylistId) {
        try {
          console.log('Uploading cover image...'); // Debug
          await playlistService.uploadPlaylistCover(newPlaylistId, coverImage);
          console.log('Cover image uploaded successfully'); // Debug
        } catch (imageError) {
          console.error('Error uploading cover image:', imageError);
          toast.error('Playlist created but failed to upload cover image');
        }
      }
      
      // Add songs to the playlist
      console.log('Adding songs to playlist...'); // Debug
      for (const song of selectedSongs) {
        try {
          await playlistService.addSongToPlaylist(newPlaylistId, song._id);
        } catch (songError) {
          console.error('Error adding song to playlist:', songError);
        }
      }
      
      toast.success('Playlist created successfully!');
      navigate(`/playlist/${newPlaylistId}`);
    } catch (err) {
      console.error('Error creating playlist:', err);
      toast.error(err.response?.data?.message || 'Failed to create playlist');
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
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
            {/* Cover Image Section */}
            <div className="flex flex-col items-center">
              <div 
                className="w-full aspect-square bg-chakra-dark-light/50 rounded-md flex items-center justify-center cursor-pointer hover:bg-chakra-dark-light/70 transition-colors overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                {coverImagePreview ? (
                  <img 
                    src={coverImagePreview}
                    alt="Playlist cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : selectedSongs.length > 0 ? (
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
                  <div className="flex flex-col items-center text-chakra-subtext">
                    <Image size={48} className="mb-2" />
                    <span className="text-sm">Add Cover</span>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 px-4 py-2 bg-chakra-dark-light hover:bg-chakra-dark text-white rounded text-sm flex items-center gap-2"
              >
                <Upload size={16} />
                Choose Image
              </button>
            </div>
            
            {/* Form Fields */}
            <div>
              {/* Playlist Name */}
              <div className="mb-4">
                <label htmlFor="playlist-name" className="block text-sm font-medium text-chakra-subtext mb-1">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  id="playlist-name"
                  className="w-full bg-chakra-dark px-4 py-2 rounded text-white outline-none focus:ring-1 focus:ring-chakra-accent"
                  placeholder="My awesome playlist"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                />
              </div>
              
              {/* Description */}
              <div className="mb-4">
                <label htmlFor="playlist-description" className="block text-sm font-medium text-chakra-subtext mb-1">
                  Description
                </label>
                <textarea
                  id="playlist-description"
                  rows={3}
                  className="w-full bg-chakra-dark px-4 py-2 rounded text-white outline-none focus:ring-1 focus:ring-chakra-accent resize-none"
                  placeholder="Describe your playlist..."
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
                />
              </div>
              
              {/* Privacy Setting */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-chakra-subtext mb-3">
                  Privacy
                </label>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      className="mr-3 accent-chakra-accent"
                    />
                    <Lock size={16} className="mr-2 text-chakra-subtext" />
                    <div>
                      <div className="text-white">Private</div>
                      <div className="text-xs text-chakra-subtext">Only you can access this playlist</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      className="mr-3 accent-chakra-accent"
                    />
                    <Globe size={16} className="mr-2 text-chakra-subtext" />
                    <div>
                      <div className="text-white">Public</div>
                      <div className="text-xs text-chakra-subtext">Anyone can find and like this playlist</div>
                    </div>
                  </label>
                </div>
              </div>
                {/* Action Area */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex flex-col">
                  <span className="text-chakra-subtext">
                    {selectedSongs.length} {selectedSongs.length === 1 ? 'song' : 'songs'} selected
                  </span>
                  {(selectedSongs.length === 0 || !playlistName.trim()) && (
                    <span className="text-red-400 text-xs mt-1">
                      {!playlistName.trim() ? 'Enter a playlist name' : 'Select at least one song'}
                    </span>
                  )}
                </div>
                <button
                  className="flex items-center px-6 py-3 bg-chakra-accent text-white rounded-full ml-auto hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCreatePlaylist}
                  disabled={saving || selectedSongs.length === 0 || !playlistName.trim()}
                  title={
                    saving ? 'Creating playlist...' :
                    !playlistName.trim() ? 'Enter a playlist name first' :
                    selectedSongs.length === 0 ? 'Select at least one song' :
                    'Create your playlist'
                  }
                >
                  <Save size={16} className="mr-2" />
                  {saving ? 'Creating...' : 'Create Playlist'}
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
