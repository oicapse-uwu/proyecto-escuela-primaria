import { Route, Routes } from 'react-router-dom';
import MatriculasPage from '../pages/MatriculasPage';
import RequisitosPage from '../pages/RequisitosPage';

const MatriculasRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MatriculasPage />} />
      <Route path="/requisitos" element={<RequisitosPage />} />
    </Routes>
  );
};

export default MatriculasRoutes;
