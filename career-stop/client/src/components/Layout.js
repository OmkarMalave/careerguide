import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-grow w-full">
        <div className="max-w-[1920px] mx-auto px-6 sm:px-8 lg:px-12">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 