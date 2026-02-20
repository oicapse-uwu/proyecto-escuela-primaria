import React, { useState } from 'react';
import './TokenPage.css';

const TokenPage: React.FC = () => {
    // State management for form (optional, but good practice)
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        email: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Solicitud enviada (Simulación)');
    };

    return (
        <div className="container">
            <header className="header">
                <h1 className="title">API Escuelas Primarias</h1>
                <h2 className="subtitle">Desarrolla aplicaciones con nosotros<br />Accede a nuestros servicios</h2>
            </header>

            <section className="description">
                <p>
                    Bienvenidos, la presente plataforma contiene la API desarrollada para el sistema de escuelas primarias. 
                    La API permite el acceso directo al trabajo con la información de nuestra base de datos desde tu aplicación. 
                    Usa una interfaz RESTful y retorna los datos en formato JSON. La información invocada a través de la API 
                    provee un acceso estándar online a datos académicos y administrativos. Registre sus datos y consiga la 
                    autorización para trabajar en nuestra plataforma, ya que requiere de datos de autorización, la puedes 
                    solicitar a través del siguiente formulario:
                </p>
            </section>

            <section className="token-section">
                <div className="token-header">Token de acceso</div>
                <div className="token-content">
                    eyJhbGciOiJlUzI1NiJ9.eyJzdWliOilzMjA2ZWU2NjE3MWMwNjM5MzU4OTY3MzE2YWU4MmJiYWQzYzY2ODU0ODM4OTQ_mXghjsN0sWpnKPGg-cM
                </div>
            </section>

            <section className="form-section">
                <h3 className="form-title">Solicitud de Acceso a Datos</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="text" 
                            name="nombres"
                            className="input-field" 
                            placeholder="Nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="text" 
                            name="apellidos"
                            className="input-field" 
                            placeholder="Apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="email" 
                            name="email"
                            className="input-field" 
                            placeholder="E-mail"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-register">
                        Registrar
                    </button>
                </form>
            </section>
        </div>
    );
};

export default TokenPage;
