import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = ({ onSearch, placeholder = 'Search for songs, artists, or albums...' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  
  // Handle input change and search trigger
  const handleChange = (e) => {
    setQuery(e.target.value);
    // You might want to debounce this in a real app
    onSearch && onSearch(e.target.value);
  };
  
  // Clear search
  const clearSearch = () => {
    setQuery('');
    onSearch && onSearch('');
    inputRef.current.focus();
  };
  
  // Focus effect
  useEffect(() => {
    if (isFocused) {
      document.body.classList.add('search-active');
    } else {
      document.body.classList.remove('search-active');
    }
    
    return () => {
      document.body.classList.remove('search-active');
    };
  }, [isFocused]);

  return (
    <div 
      className={`flex items-center px-3 py-2 rounded-full bg-white/10 
        ${isFocused ? 'ring-2 ring-white/50' : 'hover:bg-white/20'} 
        transition-all duration-200 w-full max-w-md`}
    >
      <Search size={18} className="text-white mr-2" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-transparent text-white placeholder-gray-400 outline-none w-full"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {query && (
        <button 
          onClick={clearSearch}
          className="text-gray-400 hover:text-white p-1"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
