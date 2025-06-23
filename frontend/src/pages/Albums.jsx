import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Music, Clock3, Disc3, RefreshCw } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { albumService } from '../services/api';
import { AudioContext } from '../context/AudioContext';
import { toast } from 'react-hot-toast';

const Albums = () => {  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredAlbum, setHoveredAlbum] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const { playQueue, isPlaying, currentSong, pauseSong, queue } = useContext(AudioContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const data = await albumService.getAllAlbums();
        setAlbums(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching albums:', err);
        setError('Failed to load albums');
        toast.error('Failed to load albums');
      } finally {
        setLoading(false);
      }
    };
      fetchAlbums();
  }, []);

  // Refresh albums data
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      toast.loading('Refreshing albums...', { id: 'refresh' });
      
      const data = await albumService.getAllAlbums();
      setAlbums(data);
      setError(null);
      
      toast.success('Albums refreshed successfully!', { id: 'refresh' });
    } catch (err) {
      console.error('Error refreshing albums:', err);
      toast.error('Failed to refresh albums', { id: 'refresh' });
    } finally {
      setRefreshing(false);
    }
  };

  // Check if an album is currently playing
  const isAlbumPlaying = (album) => {
    if (!currentSong || !queue.length || !album.songs?.length) return false;
    
    const albumSongIds = album.songs.map(song => song._id);
    const currentQueueIds = queue.map(song => song._id);
    
    return (
      currentQueueIds.length === albumSongIds.length &&
      currentQueueIds.every(id => albumSongIds.includes(id))
    );
  };

  // Handle play/pause for an album
  const handleAlbumPlayPause = async (album) => {
    try {
      if (isAlbumPlaying(album) && isPlaying) {
        pauseSong();
      } else {
        // Fetch full song data for the album
        const albumSongs = await albumService.getAlbumSongs(album.albumName);
        playQueue(albumSongs, 0);
      }
    } catch (err) {
      console.error('Error playing album:', err);
      toast.error('Failed to play album');
    }
  };

  // Format duration from seconds to mm:ss
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format total album duration
  const formatAlbumDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chakra-accent"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="bg-red-900/30 text-red-200 p-4 rounded-md">
            {error}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Disc3 size={32} className="mr-3 text-chakra-accent" />
            <h1 className="text-3xl font-bold">Albums</h1>
            <span className="ml-4 text-chakra-subtext">
              {albums.length} album{albums.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-chakra-accent/20 text-chakra-accent hover:bg-chakra-accent/30 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh albums from library"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {albums.length === 0 ? (
          <div className="text-center py-12">
            <Disc3 size={64} className="mx-auto mb-4 text-chakra-subtext" />
            <p className="text-chakra-subtext text-lg">No albums found</p>
            <p className="text-chakra-subtext text-sm mt-2">
              Add some music files with album metadata to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {albums.map((album) => {
              const albumIsPlaying = isAlbumPlaying(album);
              
              return (
                <div
                  key={`${album.artist}-${album.albumName}`}
                  className="group p-4 rounded-lg bg-chakra-dark-light/30 hover:bg-chakra-dark-light/50 transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredAlbum(album.albumName)}
                  onMouseLeave={() => setHoveredAlbum(null)}
                >
                  {/* Album Cover */}
                  <div className="relative mb-4">
                    <div className="aspect-square bg-chakra-dark-light/50 rounded-md overflow-hidden shadow-lg">
                      {album.coverImage ? (
                        <img 
                          src={`http://localhost:5000/uploads/${album.coverImage}`}
                          alt={album.albumName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-chakra-accent/20 to-chakra-dark-light">
                          <Music size={48} className="text-chakra-subtext" />
                        </div>
                      )}
                      
                      {/* Play Button Overlay */}
                      <button
                        className={`absolute bottom-2 right-2 rounded-full p-3 shadow-lg 
                          ${albumIsPlaying ? 'bg-chakra-accent' : 'bg-chakra-accent'} text-white transform 
                          transition-all duration-200 
                          ${hoveredAlbum === album.albumName || albumIsPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} 
                          hover:scale-105`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAlbumPlayPause(album);
                        }}
                      >
                        {albumIsPlaying && isPlaying ? (
                          <Pause size={20} />
                        ) : (
                          <Play size={20} fill="currentColor" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Album Info */}
                  <div>
                    <h3 className={`font-semibold mb-1 truncate ${albumIsPlaying ? 'text-chakra-accent' : 'text-white'}`}>
                      {album.albumName}
                    </h3>
                    <p className="text-sm text-chakra-subtext truncate mb-2">
                      {album.artist}
                    </p>
                    
                    {/* Album Stats */}
                    <div className="flex items-center text-xs text-chakra-subtext">
                      <span>{album.songCount} song{album.songCount !== 1 ? 's' : ''}</span>
                      <span className="mx-2">•</span>
                      <span>{formatAlbumDuration(album.totalDuration)}</span>
                    </div>
                    
                    {album.genre && album.genre !== 'Unknown' && (
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 text-xs bg-chakra-accent/20 text-chakra-accent rounded">
                          {album.genre}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Albums;
