import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import PlayerBar from './PlayerBar';

const MainLayout = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-chakra-dark text-chakra-text">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title={title} />
        
        {/* Content area - scrollable */}
        <main className="flex-1 overflow-y-auto pb-24">
          {children || <Outlet />}
        </main>
        
        {/* Player Bar */}
        <PlayerBar />
      </div>
    </div>
  );
};

export default MainLayout;
