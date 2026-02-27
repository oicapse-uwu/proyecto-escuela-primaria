import {
    Building2,
    CreditCard,
    TrendingUp,
    Users
} from 'lucide-react';
import React from 'react';

const Dashboard: React.FC = () => {
    // TODO: Conectar con API para obtener estadísticas reales
    // const [stats, setStats] = useState(null);
    // const [loading, setLoading] = useState(true);

    const statsConfig = [
        {
            title: 'Instituciones Activas',
            icon: Building2,
            color: 'bg-blue-500'
        },
        {
            title: 'Suscripciones',
            icon: CreditCard,
            color: 'bg-green-500'
        },
        {
            title: 'Usuarios Totales',
            icon: Users,
            color: 'bg-purple-500'
        },
        {
            title: 'Ingresos del Mes',
            icon: TrendingUp,
            color: 'bg-yellow-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        Vista general del sistema
                    </p>
                </div>

                {/* Stats Grid - Placeholders */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsConfig.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div 
                                key={index}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-gray-600 text-sm font-medium mb-3">
                                    {stat.title}
                                </h3>
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                                </div>
                                <p className="text-xs text-gray-400 text-center mt-2">
                                    Conectando con API...
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Institutions Table - Placeholder */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Instituciones Recientes
                        </h2>
                    </div>
                    <div className="p-12 text-center">
                        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium mb-2">
                            Esperando datos de la API
                        </p>
                        <p className="text-gray-400 text-sm">
                            La tabla se poblará automáticamente cuando se conecte con el backend
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
