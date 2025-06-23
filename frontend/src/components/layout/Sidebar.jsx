import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Library, PlusSquare, Heart, LogOut, Disc3 } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { playlistService } from '../../services/api';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the current path matches the link
  const isActive = (path) => location.pathname === path;
  // Navigation items
  const navItems = [
    { icon: <Home size={22} />, text: 'Home', path: '/' },
    { icon: <Search size={22} />, text: 'Search', path: '/search' },
    { icon: <Library size={22} />, text: 'Library', path: '/library' },
    { icon: <Disc3 size={22} />, text: 'Albums', path: '/albums' },
  ];

  // Library items
  const libraryItems = [
    { icon: <PlusSquare size={20} />, text: 'Create Playlist', path: '/create-playlist' },
    { icon: <Heart size={20} />, text: 'Liked Songs', path: '/liked-songs' },
  ];

  // Fetch user playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        const data = await playlistService.getAllPlaylists();
        setPlaylists(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div className="bg-chakra-dark-light w-64 flex-shrink-0 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="text-2xl font-bold text-chakra-accent flex items-center">
          <span className="mr-2">🎵</span> Chakras
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="mb-6">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-white bg-black/20'
                    : 'text-chakra-subtext hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Library Section */}
      <div className="px-6 pt-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-chakra-subtext mb-4">
          Your Library
        </h2>
        <ul>
          {libraryItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center py-2 text-sm transition-colors ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-chakra-subtext hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Playlists */}
      <div className="px-6 pt-6 overflow-y-auto">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-chakra-subtext mb-4">
          Playlists
        </h2>
        {isLoading ? (
          <div className="text-sm text-chakra-subtext animate-pulse">Loading...</div>
        ) : playlists.length > 0 ? (
          <div className="text-sm text-chakra-subtext">
            {playlists.map((playlist) => (
              <Link 
                key={playlist._id} 
                to={`/playlist/${playlist._id}`}
                className="block py-1.5 hover:text-white transition-colors truncate"
              >
                {playlist.name}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-sm text-chakra-subtext">
            <p className="py-1">No playlists yet</p>
            <button 
              onClick={() => navigate('/create-playlist')}
              className="mt-2 text-chakra-accent hover:underline text-sm"
            >
              Create a playlist
            </button>
          </div>
        )}
      </div>      {/* Logout button at bottom */}
      <div className="mt-auto p-6">
        <button
          onClick={logout}
          className="flex items-center text-chakra-subtext hover:text-white transition-colors"
        >
          <LogOut size={18} className="mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
