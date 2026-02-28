import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';

const EscuelaLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            {sidebarOpen && <Sidebar />}
            
            {/* TopBar */}
            <TopBar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
            
            {/* Main Content Area */}
            <main 
                className="flex-1"
                style={{
                    marginLeft: sidebarOpen ? '18rem' : '0',
                    marginTop: '4.5rem'
                }}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default EscuelaLayout;
