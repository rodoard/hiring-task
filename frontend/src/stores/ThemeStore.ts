import { makeAutoObservable } from 'mobx';

class ThemeStore {
  isDarkMode: boolean;

  constructor() {
    // Initialize theme from localStorage, default to light mode if not set
    const savedTheme = localStorage.getItem('app-theme');
    this.isDarkMode = savedTheme === 'dark';
    
    makeAutoObservable(this);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('app-theme', this.isDarkMode ? 'dark' : 'light');
  }
}

export const themeStore = new ThemeStore();
