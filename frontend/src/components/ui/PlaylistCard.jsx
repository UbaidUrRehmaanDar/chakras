import { Play, Pause, Trash2, Heart, User } from 'lucide-react';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AudioContext } from '../../context/AudioContext'; // FIXED: use named import
import { playlistService } from '../../services/api';

const PlaylistCard = ({ playlist, onDelete, isPublic = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(playlist.likes?.length || 0);
  const [loadingLike, setLoadingLike] = useState(false);
  const { playQueue, currentSong, isPlaying, pauseSong, queue } = useContext(AudioContext);
  
  // Check if this playlist is currently playing
  const isCurrentPlaylist = () => {
    if (!currentSong || !queue.length || !playlist.songs || !playlist.songs.length) {
      return false;
    }
    
    // Check if the current playing song is from this playlist
    const playlistSongIds = playlist.songs.map(song => song._id);
    const currentQueueIds = queue.map(song => song._id);
    
    // Check if the queued songs match the playlist songs
    return (
      currentQueueIds.length === playlistSongIds.length &&
      currentQueueIds.every(id => playlistSongIds.includes(id))
    );
  };
    // Handle play/pause
  const handlePlayPause = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCurrentPlaylist() && isPlaying) {
      pauseSong();
    } else {
      playQueue(playlist.songs, 0);
    }
  };
    // Handle delete
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(playlist._id);
    }
  };

  // Handle like/unlike for public playlists
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isPublic) return;
    
    setLoadingLike(true);
    try {
      const result = await playlistService.togglePlaylistLike(playlist._id);
      setIsLiked(result.isLiked);
      setLikesCount(result.likesCount);
      toast.success(result.message);
    } catch (error) {
      console.error('Error toggling playlist like:', error);
      toast.error('Failed to update like status');
    } finally {
      setLoadingLike(false);
    }
  };
  
  // Get first 4 song covers for the collage
  const coverImages = playlist.songs && playlist.songs.length > 0
    ? playlist.songs.slice(0, 4).map(song => 
        song.coverImage ? `http://localhost:5000/uploads/${song.coverImage}` : null
      )
    : [];
    
  // Fill remaining spots with placeholder
  while (coverImages.length < 4) {
    coverImages.push(null);
  }

  const playlistIsCurrentlyPlaying = isCurrentPlaylist() && isPlaying;

  return (
    <Link
      to={`/playlist/${playlist._id}`} 
      className="p-4 rounded-md bg-chakra-dark-light/50 hover:bg-chakra-dark-light transition duration-200 cursor-pointer group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">        {/* Playlist cover image collage */}
        <div className="aspect-square bg-black/30 rounded-md overflow-hidden shadow-lg mb-4">
          {playlist.coverImage ? (
            <img 
              src={`http://localhost:5000/uploads/${playlist.coverImage}`}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : playlist.songs && playlist.songs.length > 0 ? (
            <div className="grid grid-cols-2 w-full h-full">
              {coverImages.map((cover, idx) => (
                <div key={idx} className="overflow-hidden">
                  {cover ? (
                    <img 
                      src={cover}
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
            {/* Action buttons overlay */}
          <div className={`absolute top-2 right-2 flex space-x-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            {/* Like button for public playlists */}
            {isPublic && (
              <button
                className={`rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105 ${
                  isLiked ? 'bg-red-600 text-white' : 'bg-black/50 text-white hover:bg-black/70'
                } ${loadingLike ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleLike}
                disabled={loadingLike}
                title={isLiked ? 'Unlike playlist' : 'Like playlist'}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
            )}
            
            {/* Delete button for user playlists */}
            {onDelete && !isPublic && (
              <button
                className="rounded-full p-2 bg-red-600/80 text-white transition-all duration-200 hover:bg-red-600 hover:scale-105"
                onClick={handleDelete}
                title="Delete playlist"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          
          {/* Play button overlay */}
          <button
            className={`absolute bottom-2 right-2 rounded-full p-3 shadow-lg 
              ${playlistIsCurrentlyPlaying ? 'bg-chakra-accent' : 'bg-chakra-accent'} text-white transform 
              transition-all duration-200 
              ${isHovered || playlistIsCurrentlyPlaying ? 'opacity-100' : 'opacity-0'} 
              hover:scale-105`}
            onClick={handlePlayPause}
          >
            {playlistIsCurrentlyPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </button>
        </div>
          {/* Playlist info */}
        <h3 className={`font-semibold ${playlistIsCurrentlyPlaying ? 'text-chakra-accent' : 'text-white'} mb-1 truncate`}>
          {playlist.name}
        </h3>
        <p className="text-sm text-chakra-subtext truncate">
          {playlist.songs ? playlist.songs.length : 0} songs
        </p>
        
        {/* Public playlist additional info */}
        {isPublic && (
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <div className="flex items-center">
              <User size={12} className="mr-1" />
              <span>{playlist.owner?.username || 'Unknown'}</span>
            </div>
            {likesCount > 0 && (
              <div className="flex items-center">
                <Heart size={12} className="mr-1" />
                <span>{likesCount}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default PlaylistCard;
