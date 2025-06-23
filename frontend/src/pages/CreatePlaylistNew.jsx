import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Image, Globe, Lock, X, Plus, Check } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
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
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
    useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const allSongs = await songService.getAllSongs();
        setSongs(Array.isArray(allSongs) ? allSongs : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching songs:', err);
        setSongs([]); // Set empty array as fallback
        
        // Better error handling for network issues
        if (err.code === 'ERR_NETWORK' || err.message === 'Network Error' || !err.response) {
          setError('Cannot connect to server. Please make sure the backend is running.');
        } else {
          setError('Failed to load songs');
        }
        
        toast.error('Failed to load songs. Please check your connection.');
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
  
  const removeSongFromSelection = (songId) => {
    setSelectedSongs(prevSelected => prevSelected.filter(s => s._id !== songId));
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
      
      const response = await playlistService.createPlaylist(playlistData);
      const newPlaylistId = response._id;
      
      // Upload cover image if provided
      if (coverImage && newPlaylistId) {
        try {
          await playlistService.uploadPlaylistCover(newPlaylistId, coverImage);
        } catch (imageError) {
          console.error('Error uploading cover image:', imageError);
          toast.error('Playlist created but failed to upload cover image');
        }
      }
      
      // Add songs to the playlist
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
    const addAllFilteredSongs = () => {
    const songsToAdd = filteredSongs.filter(song => !isSongSelected(song._id));
    setSelectedSongs(prevSelected => [...prevSelected, ...songsToAdd]);
  };

  const isSongSelected = (songId) => {
    return selectedSongs.some(song => song._id === songId);
  };
  // Filter songs based on search term
  const filteredSongs = Array.isArray(songs) ? songs.filter(song => 
    song?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song?.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song?.album?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center">
              <button 
                className="mr-4 p-2 rounded-full hover:bg-chakra-dark-light"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-3xl font-bold">Create New Playlist</h1>
            </div>
            <p className="text-chakra-subtext text-sm mt-2 ml-16">
              Fill in your playlist details on the left, then browse and add songs from the right panel
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Playlist Details */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="bg-chakra-dark-light/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Playlist Cover</h2>
              <div className="flex items-center gap-4">
                <div 
                  className="w-32 h-32 bg-chakra-dark-light/50 rounded-md flex items-center justify-center cursor-pointer hover:bg-chakra-dark-light/70 transition-colors overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {coverImagePreview ? (
                    <img 
                      src={coverImagePreview}
                      alt="Playlist cover preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-chakra-subtext">
                      <Image size={32} className="mb-2" />
                      <span className="text-xs">Add Cover</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-chakra-dark-light hover:bg-chakra-dark text-white rounded text-sm flex items-center gap-2"
                  >
                    <Upload size={16} />
                    Choose Image
                  </button>
                  {coverImagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImage(null);
                        setCoverImagePreview(null);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Playlist Info */}
            <div className="bg-chakra-dark-light/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Playlist Details</h2>
              
              {/* Playlist Name */}
              <div className="mb-4">
                <label htmlFor="playlist-name" className="block text-sm font-medium text-chakra-subtext mb-2">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  id="playlist-name"
                  className="w-full bg-chakra-dark px-4 py-3 rounded text-white outline-none focus:ring-2 focus:ring-chakra-accent"
                  placeholder="My awesome playlist"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                />
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <label htmlFor="playlist-description" className="block text-sm font-medium text-chakra-subtext mb-2">
                  Description
                </label>
                <textarea
                  id="playlist-description"
                  rows={3}
                  className="w-full bg-chakra-dark px-4 py-3 rounded text-white outline-none focus:ring-2 focus:ring-chakra-accent resize-none"
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
                  <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-chakra-dark-light/50 transition-colors">
                    <input
                      type="radio"
                      name="privacy"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      className="mr-3 accent-chakra-accent"
                    />
                    <Lock size={16} className="mr-3 text-chakra-subtext" />
                    <div>
                      <div className="text-white font-medium">Private</div>
                      <div className="text-xs text-chakra-subtext">Only you can access this playlist</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-chakra-dark-light/50 transition-colors">
                    <input
                      type="radio"
                      name="privacy"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      className="mr-3 accent-chakra-accent"
                    />
                    <Globe size={16} className="mr-3 text-chakra-subtext" />
                    <div>
                      <div className="text-white font-medium">Public</div>
                      <div className="text-xs text-chakra-subtext">Anyone can find and like this playlist</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Selected Songs Summary */}
            <div className="bg-chakra-dark-light/30 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Selected Songs ({selectedSongs.length})</h2>
                {selectedSongs.length > 0 && (
                  <button
                    onClick={() => setSelectedSongs([])}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Clear All
                  </button>
                )}
              </div>
                {selectedSongs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎵</div>
                  <p className="text-chakra-subtext">
                    No songs selected yet. Choose songs from the list on the right.
                  </p>
                  <p className="text-chakra-subtext text-sm mt-2">
                    Click the + button next to any song to add it to your playlist.
                  </p>
                </div>
              ) : (                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedSongs.map((song, index) => (
                    <div key={song._id} className="flex items-center justify-between p-2 bg-chakra-dark/50 rounded hover:bg-chakra-dark/70 transition-colors group">
                      <div className="flex items-center">
                        <span className="text-chakra-subtext text-sm mr-3 w-6 text-center">{index + 1}</span>
                        <div>
                          <div className="text-white text-sm font-medium">{song.title}</div>
                          <div className="text-chakra-subtext text-xs">{song.artist}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeSongFromSelection(song._id)}
                        className="text-red-400 hover:text-red-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove from playlist"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Create Button */}
              <div className="mt-6 pt-4 border-t border-chakra-dark-light/50">
                <button
                  className="w-full flex items-center justify-center px-6 py-3 bg-chakra-accent text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCreatePlaylist}
                  disabled={saving || selectedSongs.length === 0 || !playlistName.trim()}
                >
                  <Save size={16} className="mr-2" />
                  {saving ? 'Creating Playlist...' : 'Create Playlist'}
                </button>
                
                {(selectedSongs.length === 0 || !playlistName.trim()) && (
                  <p className="text-red-400 text-xs mt-2 text-center">
                    {!playlistName.trim() ? 'Enter a playlist name' : 'Select at least one song'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Song Selection */}
          <div className="bg-chakra-dark-light/30 rounded-lg">            <div className="p-6 border-b border-chakra-dark-light/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Add Songs</h2>
                <div className="flex items-center gap-4">
                  {filteredSongs.length > 0 && filteredSongs.some(song => !isSongSelected(song._id)) && (
                    <button
                      onClick={addAllFilteredSongs}
                      className="text-chakra-accent text-sm hover:text-chakra-accent-light"
                    >
                      Add All ({filteredSongs.filter(song => !isSongSelected(song._id)).length})
                    </button>
                  )}
                  <div className="text-sm text-chakra-subtext">
                    {selectedSongs.length} selected • {filteredSongs.length} available
                  </div>
                </div>
              </div>
              
              {/* Search */}
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                className="w-full bg-chakra-dark px-4 py-3 rounded text-white outline-none focus:ring-2 focus:ring-chakra-accent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="p-4">              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chakra-accent mb-4"></div>
                  <p className="text-chakra-subtext">Loading your music library...</p>
                </div>
              ) : error ? (
                <div className="bg-red-900/30 text-red-200 p-4 rounded-md">
                  {error}
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredSongs.map((song) => {
                    const isSelected = isSongSelected(song._id);
                    return (                      <div
                        key={song._id}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                          isSelected 
                            ? 'bg-chakra-accent/20 border border-chakra-accent/50 shadow-lg' 
                            : 'hover:bg-chakra-dark/50 hover:shadow-md'
                        }`}
                        onClick={() => handleSongToggle(song)}
                      ><div className="flex-1">
                          <div className="text-white font-medium">{song.title}</div>
                          <div className="text-chakra-subtext text-sm">
                            {song.artist} • {song.album}
                            {song.duration && ` • ${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`}
                          </div>
                        </div>
                        
                        <button
                          className={`p-2 rounded-full transition-colors ${
                            isSelected 
                              ? 'bg-chakra-accent text-white' 
                              : 'bg-chakra-dark-light text-chakra-subtext hover:text-white'
                          }`}
                        >
                          {isSelected ? <Check size={16} /> : <Plus size={16} />}
                        </button>
                      </div>
                    );
                  })}
                    {filteredSongs.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🔍</div>
                      <p className="text-chakra-subtext">
                        {searchTerm ? 'No songs found matching your search.' : 'No songs available.'}
                      </p>
                      {searchTerm && (
                        <p className="text-chakra-subtext text-sm mt-2">
                          Try searching for different keywords or check your spelling.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreatePlaylist;
