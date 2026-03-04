export * from './types';
export * from './api/infraestructuraApi';
export {
	useAniosEscolares,
	useAulas,
	useGrados,
	useInstituciones,
	usePeriodos,
	useSedes,
	useSecciones,
} from './hooks/useInfraestructura';

// Components
export { default as SedeForm } from './components/SedeForm';
export { default as GradoForm } from './components/GradoForm';
export { default as SeccionForm } from './components/SeccionForm';
export { default as AulaForm } from './components/AulaForm';
export { default as AnioEscolarForm } from './components/AnioEscolarForm';
export { default as PeriodoForm } from './components/PeriodoForm';

// Pages
export { default as InfraestructuraRoutes } from './routes/InfraestructuraRoutes';
export { default as InstitucionPage } from './pages/InstitucionPage';
export { default as SedesPage } from './pages/SedesPage';
export { default as AnioEscolarPage } from './pages/AnioEscolarPage';
export { default as PeriodosPage } from './pages/PeriodosPage';
export { default as GradosPage } from './pages/GradosPage';
export { default as SeccionesPage } from './pages/SeccionesPage';
export { default as GradosSeccionesPage } from './pages/GradosSeccionesPage';
export { default as AulasPage } from './pages/AulasPage';