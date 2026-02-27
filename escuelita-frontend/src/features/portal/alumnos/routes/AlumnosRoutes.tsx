import { Route, Routes } from 'react-router-dom';
import AlumnosPage from '../pages/AlumnosPage';

const AlumnosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AlumnosPage />} />
    </Routes>
  );
};

export default AlumnosRoutes;
