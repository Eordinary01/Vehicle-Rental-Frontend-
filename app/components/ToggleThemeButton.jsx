import { useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ToggleThemeButton = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
        theme === 'light'
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400'
          : 'bg-gray-700 text-yellow-300 hover:bg-gray-600 focus:ring-yellow-400'
      }`}
      aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
    </button>
  );
};

export default ToggleThemeButton;