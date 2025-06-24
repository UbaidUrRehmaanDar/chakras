import { useEffect, useState, useContext } from 'react';
import { songService, playlistService } from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import SongCard from '../components/ui/SongCard';
import SongRow from '../components/ui/SongRow';
import PlaylistCard from '../components/ui/PlaylistCard';
import { AudioContext } from '../context/AudioContext';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currentSong, isPlaying } = useContext(AudioContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const songsData = await songService.getAllSongs();
        setSongs(songsData);
        
        try {
          const [playlistsData, publicPlaylistsData] = await Promise.all([
            playlistService.getAllPlaylists(),
            playlistService.getPublicPlaylists()
          ]);
          setPlaylists(playlistsData);
          setPublicPlaylists(publicPlaylistsData);
        } catch (playlistError) {
          console.error('Error fetching playlists:', playlistError);
          
          // Fallback to demo playlists if API fails
          setPlaylists([
            {
              _id: '1',
              name: 'Chill Vibes',
              songs: songsData.slice(0, 4),
            },
            {
              _id: '2',
              name: 'Workout Mix',
              songs: songsData.slice(2, 5),
            }
          ]);
          setPublicPlaylists([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <MainLayout title="Home">
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chakra-accent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 text-red-200 p-4 rounded-md my-4">
            {error}
          </div>
        ) : (          <>
            {}
            {playlists.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {playlists.slice(0, 6).map((playlist) => (
                    <PlaylistCard 
                      key={playlist._id} 
                      playlist={playlist}
                    />
                  ))}
                </div>
              </section>
            )}

            {}
            {publicPlaylists.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Discover Public Playlists</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {publicPlaylists.slice(0, 6).map((playlist) => (
                    <PlaylistCard 
                      key={playlist._id} 
                      playlist={playlist}
                      isPublic={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {songs.slice(0, 6).map((song) => (
                  <SongCard 
                    key={song._id} 
                    song={song}
                    playlist={songs}
                  />
                ))}
              </div>
            </section>
            
            {}
            <section>
              <h2 className="text-2xl font-bold mb-4">All Songs</h2>
              <div className="bg-chakra-dark-light/30 rounded-md overflow-hidden">
                {}
                <div className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 p-2 px-4 border-b border-gray-700/50 text-sm text-chakra-subtext font-medium">
                  <div>#</div>
                  <div>Title</div>
                  <div>Album</div>
                  <div>Artist</div>
                  <div className="text-right">Duration</div>
                </div>
                  {}
                <div className="px-2">
                  {songs.map((song, index) => (
                    <SongRow 
                      key={song._id}
                      song={song}
                      index={index}
                      tableView={true}
                      playlist={songs}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
