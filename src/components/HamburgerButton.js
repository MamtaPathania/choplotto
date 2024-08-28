import React from 'react';
import { FaBars } from 'react-icons/fa';

const HamburgerButton = ({ setMobileMenu, mobileMenu }) => {
    return (
        <button 
            onClick={() => setMobileMenu(!mobileMenu)} 
            className="text-white focus:outline-none">
            <FaBars size={25} />
        </button>
    );
};

export default HamburgerButton;
