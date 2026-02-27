import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';

const EscuelaLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />
            
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

export default EscuelaLayout;
