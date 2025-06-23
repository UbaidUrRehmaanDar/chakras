import { useState, useContext, useRef, useEffect } from 'react';
import { User, LogOut, Settings, ChevronDown, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { uploadService } from '../../services/uploadApi';

const UserProfileMenu = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);
    // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Only allow images
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Limit file size to 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload the avatar using the uploadService
      const result = await uploadService.uploadAvatar(file);
      
      // Update the user in context with the new avatar
      if (updateProfile) {
        await updateProfile({ avatar: result.avatar });
      }
      
      toast.success('Profile picture updated');
      setIsOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
      console.error('Avatar upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="relative" ref={menuRef}>
      {/* Profile button */}
      <button 
        className="flex items-center bg-black/50 rounded-full px-1 py-1 hover:bg-black/70 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-center bg-zinc-600 h-7 w-7 rounded-full overflow-hidden">
          {user?.avatar ? (
            <img 
              src={`http://localhost:5000/uploads/${user.avatar}`} 
              alt={user?.username || 'User'}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path><circle cx='12' cy='7' r='4'></circle></svg>";
                e.target.className = "h-full w-full p-1";
              }}
            />
          ) : (
            <User size={16} />
          )}
        </div>
        <span className="px-2 text-sm font-medium truncate max-w-[100px]">
          {user?.username || 'User'}
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-md shadow-lg bg-chakra-dark-light border border-gray-700 overflow-hidden z-50">
          {/* Menu header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="relative">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-zinc-600">
                  {user?.avatar ? (
                    <img 
                      src={`http://localhost:5000/uploads/${user.avatar}`} 
                      alt={user?.username || 'User'}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'></path><circle cx='12' cy='7' r='4'></circle></svg>";
                        e.target.className = "h-full w-full p-2";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <User size={24} />
                    </div>
                  )}
                </div>
                
                {/* Upload button */}
                <button 
                  className="absolute -right-1 -bottom-1 bg-chakra-accent text-white rounded-full p-1 shadow-md hover:bg-green-600 transition"
                  onClick={triggerFileUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Upload size={14} />
                  )}
                </button>
                
                {/* Hidden file input */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </div>
              
              <div className="ml-3">
                <p className="text-sm font-medium text-white truncate">{user?.username || 'User'}</p>
                <p className="text-xs text-chakra-subtext truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
          
          {/* Menu items */}
          <div className="py-1">
            <Link 
              to="/settings" 
              className="flex items-center px-4 py-2 text-sm text-chakra-text hover:bg-black/30 transition"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} className="mr-2" />
              Account Settings
            </Link>
            
            <button 
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-black/30 transition"
            >
              <LogOut size={16} className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
