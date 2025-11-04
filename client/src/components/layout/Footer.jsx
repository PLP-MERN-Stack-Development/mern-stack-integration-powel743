// /client/src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>
          &copy; {currentYear} MERN Blog Project. All rights reserved.
        </p>
        <p className="text-sm mt-1 text-gray-400">
          Built with React, Express, MongoDB, and Node.js
        </p>
      </div>
    </footer>
  );
};

export default Footer;