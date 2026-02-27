import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminSidebar from '../components/layout/SuperAdminSidebar';
import TopBar from '../components/layout/TopBar';

const SuperAdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Overlay para cerrar sidebar en móvil */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            {/* Sidebar */}
            <SuperAdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            {/* TopBar */}
            <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            
            {/* Main Content Area */}
            <main className={`flex-1 mt-16 lg:mt-[4.5rem] transition-all duration-300 ${
                sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'
            }`}>
                <Outlet />
            </main>
        </div>
    );
};

export default SuperAdminLayout;
