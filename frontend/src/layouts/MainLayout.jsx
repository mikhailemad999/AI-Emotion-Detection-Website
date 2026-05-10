import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  SparklesIcon, 
  ChartBarIcon, 
  ChartPieIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import useEmotion from '../hooks/useEmotion';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { currentAnalysis } = useEmotion();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Dashboard', path: '/dashboard', icon: ChartBarIcon },
    { name: 'Analyzer', path: '/analyzer', icon: SparklesIcon },
    { name: 'Analytics', path: '/analytics', icon: ChartPieIcon },
  ];

  const bottomLinks = [
    { name: 'Profile', path: '/profile', icon: UserCircleIcon },
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  ];

  // Dynamic background style based on current emotion
  const bgStyle = currentAnalysis ? {
    background: `radial-gradient(circle at 50% 0%, ${currentAnalysis.color}20 0%, transparent 70%)`
  } : {};

  return (
    <div className="min-h-screen flex bg-background transition-colors duration-500 relative" style={bgStyle}>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 glass-panel border-r border-y-0 border-l-0 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-display font-bold">
            Emoti<span className="text-gradient">Sense</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-text-muted hover:text-text">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-text-muted hover:bg-surface-hover hover:text-text'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-border space-y-2">
          {user && (
            <>
              {bottomLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-secondary/10 text-secondary font-medium' 
                        : 'text-text-muted hover:bg-surface-hover hover:text-text'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
              <div className="mt-4 px-4 py-3 bg-surface rounded-xl border border-border flex items-center gap-3">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{user.username}</p>
                  <p className="text-xs text-text-muted truncate">{user.email}</p>
                </div>
              </div>
            </>
          )}
          
          {!user && (
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              onClick={() => setIsSidebarOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative z-10 w-full overflow-hidden">
        {/* Topbar (Mobile) & Global Header */}
        <header className="h-16 px-6 flex items-center justify-between lg:justify-end glass-panel sticky top-0 z-30 border-t-0 border-x-0 border-b border-border">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-text-muted hover:text-text"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full glass-panel-hover text-text-muted hover:text-text transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full max-w-6xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
