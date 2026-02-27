import { MainLayout } from './components/layout'

function App() {
  return (
    <MainLayout showHeader={false} showFooter={false} showSidebar={true}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Bienvenido al Sistema de Gestión Escolar
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-primary mb-2">Alumnos</h3>
            <p className="text-text-secondary">Gestiona la información de los estudiantes</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold text-primary mb-2">Docentes</h3>
            <p className="text-text-secondary">Administra el personal docente</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-primary mb-2">Cursos</h3>
            <p className="text-text-secondary">Organiza los cursos y materias</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-primary mb-2">Asistencias</h3>
            <p className="text-text-secondary">Registra la asistencia diaria</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-primary mb-2">Calificaciones</h3>
            <p className="text-text-secondary">Gestiona las notas y evaluaciones</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-primary mb-2">Pagos</h3>
            <p className="text-text-secondary">Administra pagos y pensiones</p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default App