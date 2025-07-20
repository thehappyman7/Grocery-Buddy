import React, { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode was previously set
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <Label htmlFor="dark-mode" className="text-sm font-medium text-primary">
          Dark Mode
        </Label>
        <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
      </div>
      <Switch
        id="dark-mode"
        checked={isDark}
        onCheckedChange={toggleDarkMode}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
};

export default DarkModeToggle;