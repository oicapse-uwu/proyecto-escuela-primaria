import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary-dark text-text-light py-4 mt-auto">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-sm">
                <p>&copy; {currentYear} Sistema Escuela Primaria. Todos los derechos reservados.</p>
            </div>
            <div className="flex space-x-4 text-sm">
                <a href="/ayuda" className="hover:text-primary-light transition-colors">
                Ayuda
                </a>
                <a href="/contacto" className="hover:text-primary-light transition-colors">
                Contacto
                </a>
                <a href="/terminos" className="hover:text-primary-light transition-colors">
                Términos
                </a>
            </div>
            </div>
        </div>
        </footer>
    );
};

export default Footer;