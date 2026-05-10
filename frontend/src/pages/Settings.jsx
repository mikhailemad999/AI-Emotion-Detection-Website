import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import useTheme from '../hooks/useTheme';
import useAuth from '../hooks/useAuth';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  
  // Mock states for UI demonstration
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-3xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Settings</h1>
        <p className="text-text-muted">Manage your app preferences and account details.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Appearance Section */}
        <section className="glass-panel p-6 rounded-2xl">
          <h2 className="text-lg font-bold font-display mb-4 border-b border-border pb-4">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme Preference</p>
              <p className="text-sm text-text-muted">Choose between light and dark mode</p>
            </div>
            
            <div className="flex bg-surface p-1 rounded-xl border border-border">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-text-muted hover:text-text'
                }`}
              >
                <SunIcon className="w-4 h-4" /> Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  theme === 'dark' ? 'bg-[#1e1e2e] text-white shadow-sm' : 'text-text-muted hover:text-text'
                }`}
              >
                <MoonIcon className="w-4 h-4" /> Dark
              </button>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="glass-panel p-6 rounded-2xl">
          <h2 className="text-lg font-bold font-display mb-4 border-b border-border pb-4">Preferences</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <div className="mt-1"><BellIcon className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-medium">Daily Reminders</p>
                  <p className="text-sm text-text-muted">Receive a notification to log your mood</p>
                </div>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-surface border border-border'}`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="glass-panel p-6 rounded-2xl">
          <h2 className="text-lg font-bold font-display mb-4 border-b border-border pb-4">Privacy & Security</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <div className="mt-1"><ShieldCheckIcon className="w-5 h-5 text-secondary" /></div>
                <div>
                  <p className="font-medium">Anonymous Data Donation</p>
                  <p className="text-sm text-text-muted">Help improve our AI model by securely sharing anonymized entries</p>
                </div>
              </div>
              <button 
                onClick={() => setDataSharing(!dataSharing)}
                className={`w-12 h-6 rounded-full transition-colors relative ${dataSharing ? 'bg-secondary' : 'bg-surface border border-border'}`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${dataSharing ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="pt-4 mt-4 border-t border-border border-dashed">
              <button className="text-red-500 text-sm font-medium hover:underline">
                Export all my data
              </button>
              <br />
              <button className="text-red-500 text-sm font-medium hover:underline mt-2">
                Delete account permanently
              </button>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Settings;
