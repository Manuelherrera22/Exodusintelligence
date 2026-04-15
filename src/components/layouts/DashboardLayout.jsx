import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <>
      <div className="aurora-background"></div>
      <Outlet />
    </>
  );
};

export default DashboardLayout;
