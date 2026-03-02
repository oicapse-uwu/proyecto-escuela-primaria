import { RouteObject } from 'react-router-dom';
import EspecialidadesPage from '../pages/EspecialidadesPage';

export const especialidadesRoutes: RouteObject[] = [
    {
        path: 'especialidades', // La ruta será /escuela/especialidades (o según tu configuración)
        element: <EspecialidadesPage />
    }
];