// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    console.log('🎨 Initializing theme...');
    
    try {
      // First check if there's a saved preference
      const savedTheme = localStorage.getItem('theme');
      console.log('💾 Saved theme from localStorage:', savedTheme);
      
      if (savedTheme === 'dark' || savedTheme === 'light') {
        const isStoredDark = savedTheme === 'dark';
        console.log('✅ Using saved theme:', isStoredDark ? 'dark' : 'light');
        return isStoredDark;
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    
    // If no saved preference, check system preference
    if (typeof window !== 'undefined') {
      try {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('🖥️ System prefers dark mode:', systemPrefersDark);
        return systemPrefersDark;
      } catch (error) {
        console.error('Error checking system preference:', error);
      }
    }
    
    console.log('🔄 Fallback to light theme');
    return false;
  });

  // Apply theme function
  const applyTheme = (isDark: boolean) => {
    console.log('🔧 Applying theme:', isDark ? 'dark' : 'light');
    
    try {
      // Clean up all theme classes first
      document.body.classList.remove('dark-theme', 'light-theme', 'dark', 'light');
      document.documentElement.classList.remove('dark-theme', 'light-theme', 'dark', 'light');
      
      // Apply the correct theme
      if (isDark) {
        document.body.classList.add('dark-theme');
        document.documentElement.classList.add('dark-theme');
        document.documentElement.setAttribute('data-theme', 'dark');
        console.log('🌙 Dark theme applied');
      } else {
        document.body.classList.add('light-theme');
        document.documentElement.classList.add('light-theme');
        document.documentElement.setAttribute('data-theme', 'light');
        console.log('☀️ Light theme applied');
      }
      
      // Save to localStorage
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      console.log('💾 Theme saved to localStorage:', isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  };

  // Apply theme when isDarkTheme changes
  useEffect(() => {
    applyTheme(isDarkTheme);
  }, [isDarkTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      console.log('🖥️ System theme changed to:', e.matches ? 'dark' : 'light');
      
      // Only update if no saved preference exists
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme || (savedTheme !== 'dark' && savedTheme !== 'light')) {
        console.log('🔄 No saved preference, updating to system theme');
        setIsDarkTheme(e.matches);
      } else {
        console.log('⏭️ Saved preference exists, ignoring system change');
      }
    };

    console.log('👂 Listening for system theme changes');
    try {
      mediaQuery.addEventListener('change', handleChange);
    } catch (error) {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      console.log('🛑 Stopped listening for system theme changes');
      try {
        mediaQuery.removeEventListener('change', handleChange);
      } catch (error) {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const toggleTheme = () => {
    console.log('🔄 Theme toggle requested - current:', isDarkTheme ? 'dark' : 'light');
    const newTheme = !isDarkTheme;
    console.log('🔄 Theme will change to:', newTheme ? 'dark' : 'light');
    setIsDarkTheme(newTheme);
  };

  const setTheme = (isDark: boolean) => {
    console.log('🎯 Theme set directly to:', isDark ? 'dark' : 'light');
    setIsDarkTheme(isDark);
  };

  // Debug: log current state
  useEffect(() => {
    console.log('📊 Current theme state:', {
      isDarkTheme,
      bodyClasses: document.body.className,
      htmlClasses: document.documentElement.className,
      dataTheme: document.documentElement.getAttribute('data-theme'),
      localStorage: localStorage.getItem('theme')
    });
  }, [isDarkTheme]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};