import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Heart } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import PlaylistCard from '../components/ui/PlaylistCard';
import { playlistService } from '../services/api';
import { toast } from 'react-hot-toast';

const Library = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const data = await playlistService.getAllPlaylists();
        setPlaylists(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching playlists:', err);
        setError('Failed to load your playlists');
        toast.error('Failed to load playlists');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlaylists();
  }, []);

  return (
    <MainLayout title="Your Library">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Your Library</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chakra-accent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 text-red-200 p-4 rounded-md my-4">
            {error}
          </div>
        ) : (
          <div>
            {/* Special items at the top */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
              {/* Liked Songs */}
              <Link
                to="/liked-songs" 
                className="p-4 rounded-md bg-gradient-to-br from-chakra-accent/40 to-chakra-dark-light hover:bg-chakra-dark-light transition duration-200 cursor-pointer group"
              >
                <div className="relative">
                  <div className="aspect-square rounded-md overflow-hidden shadow-lg mb-4 flex items-center justify-center bg-chakra-accent/20">
                    <Heart size={64} className="text-chakra-accent" fill="currentColor" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">Liked Songs</h3>
                  <p className="text-sm text-chakra-subtext">Your favorite tracks</p>
                </div>
              </Link>
              
              {/* Create Playlist */}
              <Link
                to="/create-playlist" 
                className="p-4 rounded-md bg-chakra-dark-light/50 hover:bg-chakra-dark-light transition duration-200 cursor-pointer group"
              >
                <div className="relative">
                  <div className="aspect-square rounded-md overflow-hidden shadow-lg mb-4 flex items-center justify-center bg-chakra-dark-light/80">
                    <PlusCircle size={64} className="text-chakra-subtext" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">Create Playlist</h3>
                  <p className="text-sm text-chakra-subtext">Add your favorite songs</p>
                </div>
              </Link>
            </div>
            
            {/* User playlists */}
            <h2 className="text-xl font-bold mb-4">Your Playlists</h2>
            {playlists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {playlists.map((playlist) => (
                  <PlaylistCard key={playlist._id} playlist={playlist} />
                ))}
              </div>
            ) : (
              <div className="bg-chakra-dark-light/30 p-8 rounded-md text-center">
                <p className="text-chakra-subtext mb-4">You don't have any playlists yet</p>
                <Link 
                  to="/create-playlist"
                  className="inline-flex items-center px-4 py-2 bg-chakra-accent text-white rounded-full hover:bg-opacity-90 transition-opacity"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Create Playlist
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Library;
