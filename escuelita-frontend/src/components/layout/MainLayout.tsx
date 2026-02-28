import React from 'react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    showFooter?: boolean;
    showSidebar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
    children, 
    showHeader = false, 
    showFooter = false,
    showSidebar = true 
}) => {
    const sidebarOpen = true;

    return (
        <div className="min-h-screen flex flex-col bg-bg-body">
            {showHeader && <Header />}
            
            <div className={`flex flex-1 ${showHeader ? 'pt-16' : ''}`}>
                {showSidebar && <Sidebar isOpen={sidebarOpen} />}
                
                <main 
                    className={`flex-1 ${showSidebar && sidebarOpen ? 'lg:ml-72' : ''}`}
                >
                    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
                        {children}
                    </div>
                </main>
            </div>
            
            {showFooter && <Footer />}
        </div>
    );
};

export default MainLayout;
