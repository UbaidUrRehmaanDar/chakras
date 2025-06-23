import { useContext } from 'react';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import UserProfileMenu from '../ui/UserProfileMenu';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-chakra-dark-light/50 sticky top-0 z-10 backdrop-blur-sm">
      {/* Navigation buttons */}
      <div className="flex items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center justify-center h-8 w-8 rounded-full bg-black/40 mr-2"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={() => navigate(1)} 
          className="flex items-center justify-center h-8 w-8 rounded-full bg-black/40"
        >
          <ChevronRight size={20} />
        </button>
        
        {/* Page title */}
        {title && (
          <h1 className="ml-6 text-2xl font-bold">{title}</h1>
        )}
      </div>
      
      {/* User info and actions */}
      <div className="flex items-center">
        <button 
          className="flex items-center justify-center h-8 w-8 rounded-full bg-black/40 mr-2"
        >
          <Bell size={18} />
        </button>
          <UserProfileMenu />
      </div>
    </header>
  );
};

export default Header;
