import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';

const ThemeToggle = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <div className="transition ease-in-out duration-500 rounded-full p-2">
            {theme === 'dark' ? (
                <FaToggleOn
                    onClick={() => setTheme('light')}
                    className="text-white text-2xl cursor-pointer"
                />
            ) : (
                <FaToggleOff
                    onClick={() => setTheme('dark')}
                    className="text-white text-2xl cursor-pointer"
                />
                
            )}
        </div>
    );
};

export default ThemeToggle;
