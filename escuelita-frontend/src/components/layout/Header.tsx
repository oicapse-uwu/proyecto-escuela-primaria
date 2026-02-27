import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-primary text-text-light shadow-md h-16 fixed top-0 left-0 right-0 z-40">
        <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-text-light">Sistema Escuela Primaria</h1>
            </div>
            
            <div className="flex items-center space-x-4">
            <button className="hover:bg-primary-dark px-3 py-2 rounded transition-colors">
                <span className="text-sm">Usuario</span>
            </button>
            <button className="hover:bg-primary-dark px-3 py-2 rounded transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </button>
            </div>
        </div>
        </header>
    );
};

export default Header;