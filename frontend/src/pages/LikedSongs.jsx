import { useState, useEffect, useContext, useCallback } from 'react';
import { Play, Pause, Clock3, MoreHorizontal, Heart } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import SongRow from '../components/ui/SongRow';
import { songService } from '../services/api';
import { AudioContext } from '../context/AudioContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { playQueue, isPlaying, currentSong, pauseSong, queue } = useContext(AudioContext);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Memoize the fetch function to avoid recreating it on each render
  const fetchLikedSongs = useCallback(async () => {
    // Don't try to fetch if not logged in
    if (!token) {
      setLoading(false);
      setError('Please log in to view your liked songs');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching liked songs...');
      
      // Get user's favorites from the API
      const favorites = await songService.getFavorites();
      console.log('Received favorites:', favorites);
      
      if (Array.isArray(favorites)) {
        setLikedSongs(favorites);
        setError(null);
      } else {
        console.warn('Received non-array favorites response:', favorites);
        setLikedSongs([]);
      }
    } catch (err) {
      console.error('Error fetching liked songs:', err);
      
      // Handle the error gracefully
      setLikedSongs([]); // Set empty array instead of leaving previous data
      
      if (err.response?.status === 401) {
        setError('You need to log in to view your liked songs');
        toast.error('Please log in first');
        // Optionally redirect to login
        // navigate('/login');
      } else {
        setError('Failed to load liked songs. Please try again later.');
        toast.error('Failed to load liked songs');
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    // Fetch on mount
    fetchLikedSongs();
    
    // Set up an interval to refresh the liked songs every 10 seconds
    // Using 10 seconds instead of 5 to reduce API load
    const interval = setInterval(fetchLikedSongs, 10000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(interval);
  }, [fetchLikedSongs]); // Dependency on fetchLikedSongs which depends on token
  
  // Function to refresh the liked songs list
  const refreshLikedSongs = async () => {
    try {
      setLoading(true);
      // Get user's favorites from the API
      const favorites = await songService.getFavorites();
      setLikedSongs(Array.isArray(favorites) ? favorites : []);
      setError(null);
    } catch (err) {
      console.error('Error refreshing liked songs:', err);
      setError('Failed to refresh liked songs');
    } finally {
      setLoading(false);
    }
  };

  // Check if liked songs playlist is currently playing
  const isCurrentPlaylist = () => {
    if (!currentSong || !queue.length || !likedSongs.length) return false;
    
    // Get IDs of liked songs and current queue
    const likedSongIds = likedSongs.map(song => song._id);
    const queueSongIds = queue.map(song => song._id);
    
    // Check if current queue contains all liked songs in the same order
    return (
      queueSongIds.length === likedSongIds.length &&
      queueSongIds.every((id, index) => id === likedSongIds[index])
    );
  };
  
  // Handle play all button
  const handlePlayAll = () => {
    if (!likedSongs.length) return;
    
    if (isCurrentPlaylist() && isPlaying) {
      pauseSong();
    } else {
      playQueue(likedSongs, 0);
    }
  };
  
  // Calculate total duration
  const getTotalDuration = () => {
    if (!likedSongs.length) return '0:00';
    
    const totalSeconds = likedSongs.reduce((total, song) => total + (song.duration || 0), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    return hours > 0 
      ? `${hours} hr ${minutes} min`
      : `${minutes} min`;
  };

  return (
    <MainLayout>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chakra-accent"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-full">
          <div className="bg-red-900/30 text-red-200 p-4 rounded-md">
            {error}
          </div>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="flex items-end p-6 bg-gradient-to-b from-chakra-accent/20 to-chakra-dark">
            <div className="w-52 h-52 mr-6 flex-shrink-0 bg-chakra-dark-light/50 shadow-lg rounded-md overflow-hidden 
              flex items-center justify-center">
              <Heart size={64} className="text-chakra-accent" fill="currentColor" />
            </div>
            <div>
              <p className="uppercase text-sm font-medium text-chakra-subtext">Playlist</p>
              <h1 className="text-5xl font-bold my-4">Liked Songs</h1>
              <div className="flex items-center text-sm text-chakra-subtext">
                <p className="mr-1">{likedSongs.length} songs</p>
                <span>•</span>
                <p className="ml-1">{getTotalDuration()}</p>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="p-6 flex items-center">
            <button 
              className={`rounded-full p-3 mr-4 ${
                isCurrentPlaylist() && isPlaying ? 
                'bg-chakra-accent text-white' : 
                'bg-chakra-accent text-white hover:scale-105'
              } transition-transform`}
              onClick={handlePlayAll}
              disabled={likedSongs.length === 0}
            >
              {isCurrentPlaylist() && isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} fill="currentColor" />
              )}
            </button>
            
            <button 
              className="text-chakra-subtext hover:text-white p-2"
              aria-label="More options"
            >
              <MoreHorizontal size={24} />
            </button>
          </div>
          
          {/* Song list */}
          <div className="px-6 pb-24">
            {likedSongs.length > 0 ? (
              <div className="bg-chakra-dark-light/30 rounded-md overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 p-2 px-4 border-b border-gray-700/50 text-sm text-chakra-subtext font-medium">
                  <div>#</div>
                  <div>Title</div>
                  <div>Album</div>
                  <div>Artist</div>
                  <div className="text-right flex items-center justify-end">
                    <Clock3 size={16} />
                  </div>
                </div>
                
                {/* Table Body */}
                <div className="px-2">                  {likedSongs.map((song, index) => (
                    <SongRow 
                      key={song._id} 
                      song={song} 
                      index={index}
                      tableView={true}
                      onLike={refreshLikedSongs}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-chakra-subtext">You haven't liked any songs yet</p>
                <p className="text-chakra-subtext text-sm mt-2">Click the heart icon on a song to add it to your Liked Songs</p>
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default LikedSongs;
