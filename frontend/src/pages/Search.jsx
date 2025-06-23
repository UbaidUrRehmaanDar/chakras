import { useState, useEffect, useContext } from 'react';
import MainLayout from '../components/layout/MainLayout';
import SearchInput from '../components/ui/SearchInput';
import SongRow from '../components/ui/SongRow';
import { songService } from '../services/api';
import { Music, Mic, Disc, Play, Pause } from 'lucide-react';
import { AudioContext } from '../context/AudioContext';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { playQueue, isPlaying, pauseSong, queue } = useContext(AudioContext);
  
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    try {
      setLoading(true);
      // In a real app, this would be an API call to search
      // For this demo, we'll simulate a search with the getAllSongs endpoint
      const songs = await songService.getAllSongs();
      
      // Simple client-side filtering
      const results = songs.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) || 
        song.artist.toLowerCase().includes(query.toLowerCase()) ||
        (song.album && song.album.toLowerCase().includes(query.toLowerCase()))
      );
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching songs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Check if current search results match the current queue
  const isSearchResultsPlaying = () => {
    if (searchResults.length === 0 || queue.length === 0 || !isPlaying) return false;
    
    // Check if current queue contains all search results in the same order
    const searchResultIds = searchResults.map(song => song._id);
    const queueIds = queue.map(song => song._id);
    
    return (
      queueIds.length === searchResultIds.length &&
      queueIds.every((id, index) => id === searchResultIds[index])
    );
  };
  
  // Handle play all button
  const handlePlayAll = () => {
    if (searchResults.length === 0) return;
    
    if (isSearchResultsPlaying()) {
      pauseSong();
    } else {
      playQueue(searchResults, 0);
    }
  };
  
  // Categories for empty state
  const categories = [
    { name: 'Top Genres', icon: <Music size={40} className="text-purple-500" /> },
    { name: 'New Releases', icon: <Disc size={40} className="text-green-500" /> },
    { name: 'Popular Artists', icon: <Mic size={40} className="text-blue-500" /> },
  ];

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-6">
          <SearchInput onSearch={handleSearch} />
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-chakra-accent"></div>
          </div>
        ) : searchQuery ? (
          // Display search results
          <div>
            <div className="flex items-center mb-4">
              <h2 className="text-2xl font-bold mr-4">Search Results for "{searchQuery}"</h2>
              
              {searchResults.length > 0 && (
                <button 
                  className={`rounded-full p-2 ${
                    isSearchResultsPlaying() ? 'bg-chakra-accent text-white' : 'bg-chakra-accent text-white hover:scale-105'
                  } transition-transform flex items-center`}
                  onClick={handlePlayAll}
                >
                  {isSearchResultsPlaying() ? (
                    <Pause size={18} />
                  ) : (
                    <Play size={18} fill="currentColor" />
                  )}
                  <span className="ml-2 text-sm font-medium">Play All</span>
                </button>
              )}
            </div>
            
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-chakra-subtext text-lg">No results found for "{searchQuery}"</p>
                <p className="text-gray-500 mt-2">Try searching for something else</p>
              </div>
            ) : (
              <div className="bg-chakra-dark-light/30 rounded-md overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 p-2 px-4 border-b border-gray-700/50 text-sm text-chakra-subtext font-medium">
                  <div>#</div>
                  <div>Title</div>
                  <div>Album</div>
                  <div>Artist</div>
                  <div className="text-right">Duration</div>
                </div>
                
                {/* Table Body */}
                <div className="px-2">
                  {searchResults.map((song, index) => (
                    <SongRow 
                      key={song._id}
                      song={song}
                      index={index}
                      tableView={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Display browse categories when no search query
          <div>
            <h2 className="text-2xl font-bold mb-6">Browse All</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-chakra-dark-light to-gray-800 p-6 rounded-lg cursor-pointer hover:shadow-lg transition duration-200"
                >
                  <div className="mb-4">{category.icon}</div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </div>
              ))}
              
              {/* More category placeholders */}
              {Array(5).fill(0).map((_, index) => (
                <div 
                  key={`placeholder-${index}`} 
                  className="bg-gradient-to-br from-chakra-dark-light to-gray-800 p-6 rounded-lg cursor-pointer hover:shadow-lg transition duration-200"
                >
                  <div className="mb-4 flex items-center justify-center h-10 w-10 rounded-full bg-chakra-accent">
                    <Music size={20} />
                  </div>
                  <h3 className="text-lg font-semibold">Category {index + 4}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Search;
