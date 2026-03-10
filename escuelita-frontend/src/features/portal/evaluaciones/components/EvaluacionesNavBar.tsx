import React from 'react';
import { useLocation, Link } from 'react-router-dom';

interface TabItem {
  label: string;
  path: string;
  icon: string;
}

const tabs: TabItem[] = [
  { label: 'Evaluaciones', path: '/escuela/evaluaciones/evaluaciones', icon: '📋' },
  { label: 'Calificaciones', path: '/escuela/evaluaciones/calificaciones', icon: '📊' },
  { label: 'Asistencia', path: '/escuela/evaluaciones/asistencias', icon: '✅' },
  { label: 'Reportes', path: '/escuela/evaluaciones/asistencias-reporte', icon: '📈' },
  { label: 'Promedios', path: '/escuela/evaluaciones/promedios', icon: '📉' },
];

const EvaluacionesNavBar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="grid grid-cols-5 gap-4 mb-8">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-6 py-4 rounded-lg font-medium text-center transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-2">{tab.icon}</div>
            <div className="text-sm">{tab.label}</div>
          </Link>
        );
      })}
    </div>
  );
};

export default EvaluacionesNavBar;
