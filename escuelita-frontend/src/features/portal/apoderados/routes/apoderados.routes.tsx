import { Route, Routes } from 'react-router-dom';
import ApoderadosPage from '../pages/ApoderadosPage';

const ApoderadosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ApoderadosPage />} />
    </Routes>
  );
};

export default ApoderadosRoutes;
