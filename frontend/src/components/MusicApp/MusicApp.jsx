import { useEffect, useContext } from 'react';
import { AudioContext } from '../../context/AudioContext';
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';
import PlayerBar from './PlayerBar';
import './MusicApp.css';

const MusicApp = () => {
  const {
    currentSong,
    isPlaying,
    isShuffle,
    isRepeat,
    playQueue,
    togglePlayPause,
    skipToPrevious,
    skipToNext,
    toggleShuffle,
    toggleRepeat
  } = useContext(AudioContext);
  // Local state for UI
  const [currentView, setCurrentView] = React.useState('Albums');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Load music data on mount
  useEffect(() => {
    // No need to load data here since AudioContext handles it
  }, []);

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  const handlePlayAlbum = (album) => {
    // Convert album to songs and play
    console.log('Playing Album:', album.title);
    // For now, just log - you can implement album to songs conversion
  };

  const handleDownloadAlbum = (album) => {
    console.log('Downloading Album:', album.title);
    // Add download logic here
  };
  const handlePlayPause = () => {
    togglePlayPause();
  };

  const handleNext = () => {
    skipToNext();
  };

  const handlePrevious = () => {
    skipToPrevious();
  };

  const handleShuffle = () => {
    toggleShuffle();
  };

  const handleRepeat = () => {
    toggleRepeat();
  };

  return (
    <div className="music-app">
      <div className="music-app__layout">
        <Sidebar 
          currentView={currentView} 
          onNavigate={handleNavigation} 
        />
        
        <div className="music-app__main">
          <Header 
            currentView={currentView}
            searchQuery={searchQuery}
            onSearch={handleSearch}
          />
          
          <MainContent 
            currentView={currentView}
            searchQuery={searchQuery}
            onPlayAlbum={handlePlayAlbum}
            onDownloadAlbum={handleDownloadAlbum}
          />
        </div>
      </div>
      
      <PlayerBar            currentSong={currentSong}
            isPlaying={isPlaying}
            isShuffled={isShuffle}
            isRepeated={isRepeat}
        onPlayPause={handlePlayPause}
        onPrevious={handlePrevious}            onNext={handleNext}
            onShuffle={handleShuffle}
            onRepeat={handleRepeat}
            onPrevious={handlePrevious}
      />
    </div>
  );
};

export default MusicApp;
