import { Route, Routes } from 'react-router-dom';
import AlumnoApoderadoPage from '../pages/AlumnoApoderadoPage';
import AlumnoDetallePage from '../pages/AlumnoDetallePage';
import AlumnosPage from '../pages/AlumnosPage';

const AlumnosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AlumnosPage />} />
      <Route path="/:id" element={<AlumnoDetallePage />} />
      <Route path="/relacion-apoderado" element={<AlumnoApoderadoPage />} />
    </Routes>
  );
};

export default AlumnosRoutes;
