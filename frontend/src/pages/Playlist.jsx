import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, Clock3, MoreHorizontal } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import SongRow from '../components/ui/SongRow';
import { playlistService } from '../services/api';
import { AudioContext } from '../context/AudioContext';
import { toast } from 'react-hot-toast';

const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { playQueue, isPlaying, currentSong, pauseSong, queue } = useContext(AudioContext);
  
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        // In a real app, use the playlist ID from params
        const response = await playlistService.getAllPlaylists();
        const foundPlaylist = response.find(p => p._id === id);
        
        if (foundPlaylist) {
          setPlaylist(foundPlaylist);
          setError(null);
        } else {
          setError('Playlist not found');
          toast.error('Playlist not found');
        }
      } catch (err) {
        console.error('Error fetching playlist:', err);
        setError('Failed to load playlist');
        toast.error('Failed to load playlist');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);
  
  // Check if this playlist is currently playing
  const isCurrentPlaylist = () => {
    if (!currentSong || !queue.length || !playlist?.songs?.length) return false;
    
    // Get IDs of songs in playlist and current queue
    const playlistSongIds = playlist.songs.map(song => song._id);
    const queueSongIds = queue.map(song => song._id);
    
    // Check if current queue contains all playlist songs in the same order
    return (
      queueSongIds.length === playlistSongIds.length &&
      queueSongIds.every((id, index) => id === playlistSongIds[index])
    );
  };
  
  // Handle play all button
  const handlePlayAll = () => {
    if (!playlist?.songs?.length) return;
    
    if (isCurrentPlaylist() && isPlaying) {
      pauseSong();
    } else {
      playQueue(playlist.songs, 0);
    }
  };
  
  // Calculate total duration of playlist
  const getTotalDuration = () => {
    if (!playlist?.songs?.length) return '0:00';
    
    const totalSeconds = playlist.songs.reduce((total, song) => total + (song.duration || 0), 0);
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
          {/* Playlist header */}
          <div className="flex items-end p-6 bg-gradient-to-b from-chakra-accent/20 to-chakra-dark">
            <div className="w-52 h-52 mr-6 flex-shrink-0 bg-chakra-dark-light/50 shadow-lg rounded-md overflow-hidden">
              {playlist?.songs && playlist.songs.length > 0 ? (
                <div className="grid grid-cols-2 w-full h-full">
                  {playlist.songs.slice(0, 4).map((song, idx) => (
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
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-4xl">
                  🎵
                </div>
              )}
            </div>
            <div>
              <p className="uppercase text-sm font-medium text-chakra-subtext">Playlist</p>
              <h1 className="text-5xl font-bold my-4">{playlist?.name}</h1>
              <div className="flex items-center text-sm text-chakra-subtext">
                <p className="mr-1">{playlist?.songs?.length || 0} songs</p>
                <span>•</span>
                <p className="ml-1">{getTotalDuration()}</p>
              </div>
            </div>
          </div>
          
          {/* Playlist controls */}
          <div className="p-6 flex items-center">
            <button 
              className={`rounded-full p-3 mr-4 ${
                isCurrentPlaylist() && isPlaying ? 
                'bg-chakra-accent text-white' : 
                'bg-chakra-accent text-white hover:scale-105'
              } transition-transform`}
              onClick={handlePlayAll}
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
            {playlist?.songs && playlist.songs.length > 0 ? (
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
                <div className="px-2">
                  {playlist.songs.map((song, index) => (
                    <SongRow 
                      key={song._id} 
                      song={song} 
                      index={index}
                      tableView={true}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-chakra-subtext">This playlist is empty</p>
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Playlist;
