import React from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminSidebar from '../components/layout/SuperAdminSidebar';
import TopBar from '../components/layout/TopBar';

const SuperAdminLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <SuperAdminSidebar />
            
            {/* TopBar */}
            <TopBar />
            
            {/* Main Content Area */}
            <main 
                className="flex-1"
                style={{
                    marginLeft: '18rem',
                    marginTop: '4.5rem'
                }}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default SuperAdminLayout;
