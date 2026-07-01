// Enterprise Mall - Employee Layout
// Layout wrapper for employee-facing pages (Header + Footer + Outlet)

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const EmployeeLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow page-container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default EmployeeLayout;
