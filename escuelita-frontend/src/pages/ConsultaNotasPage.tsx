import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://primaria.spring.informaticapp.com:4040';

// Tipos

interface SedeInfo {
  idSede: number;
  nombreSede: string;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  telefono?: string;
  correoInstitucional?: string;
  ugel?: string;
  institucion?: {
    nombre?: string;
    logoPath?: string;
    nombreDirector?: string;
    tipoGestion?: string;
    codModular?: string;
  };
}

interface AlumnoInfo {
  idAlumno: number;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  fotoUrl?: string;
}

interface PeriodoInfo {
  idPeriodo: number;
  nombrePeriodo: string;
}

interface EvaluacionInfo {
  idEvaluacion: number;
  temaEspecifico?: string;
  fechaEvaluacion?: string;
  idPeriodo?: PeriodoInfo;
  idTipoNota?: { nombre: string; formato: string };
  idTipoEvaluacion?: { nombre: string };
}

interface CalificacionItem {
  idCalificacion: number;
  notaObtenida: string;
  observaciones?: string;
  fechaCalificacion?: string;
  idEvaluacion?: EvaluacionInfo;
}

interface NotasResponse {
  sede: SedeInfo;
  alumno: AlumnoInfo;
  calificaciones: CalificacionItem[];
}

// Helpers 
function badgeColor(nota: string): string {
  const n = parseFloat(nota);
  if (!isNaN(n)) {
    if (n >= 18) return 'bg-green-100 text-green-700 ring-1 ring-green-300';
    if (n >= 14) return 'bg-blue-100 text-blue-700 ring-1 ring-blue-300';
    if (n >= 11) return 'bg-amber-100 text-amber-700 ring-1 ring-amber-300';
    return 'bg-red-100 text-red-700 ring-1 ring-red-300';
  }
  const letra = nota.trim().toUpperCase();
  if (letra === 'AD') return 'bg-green-100 text-green-700 ring-1 ring-green-300';
  if (letra === 'A') return 'bg-blue-100 text-blue-700 ring-1 ring-blue-300';
  if (letra === 'B') return 'bg-amber-100 text-amber-700 ring-1 ring-amber-300';
  if (letra === 'C') return 'bg-red-100 text-red-700 ring-1 ring-red-300';
  return 'bg-gray-100 text-gray-600 ring-1 ring-gray-300';
}

function formatFecha(fechaStr?: string): string {
  if (!fechaStr) return 'â€”';
  try {
    return new Date(fechaStr).toLocaleDateString('es-PE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  } catch {
    return fechaStr;
  }
}

function initiales(nombre?: string): string {
  if (!nombre) return '?';
  return nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// Componente 

export default function ConsultaNotasPage() {
  const { idSede } = useParams<{ idSede: string }>();

  const [sedeInfo, setSedeInfo] = useState<SedeInfo | null>(null);
  const [sedeError, setSedeError] = useState(false);
  const [imgError, setImgError] = useState(false);

  const [dni, setDni] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultado, setResultado] = useState<NotasResponse | null>(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!idSede) return;
    axios
      .get<SedeInfo>(`${BASE_URL}/portal/sede/${idSede}`)
      .then((res) => setSedeInfo(res.data))
      .catch(() => setSedeError(true));
  }, [idSede]);

  const buscarNotas = async () => {
    const dniBuscar = dni.trim();
    if (!dniBuscar) { inputRef.current?.focus(); return; }
    setResultado(null);
    setErrorBusqueda('');
    setBuscando(true);
    try {
      const res = await axios.get<NotasResponse>(
        `${BASE_URL}/portal/notas/${idSede}/${encodeURIComponent(dniBuscar)}`
      );
      setResultado(res.data);
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { mensaje?: string } } };
      if (e.response?.status === 404) {
        setErrorBusqueda(
          e.response?.data?.mensaje ||
            'No se encontró ningún alumno con ese DNI en esta institución.'
        );
      } else {
        setErrorBusqueda('Ocurrió un error al consultar. Inténtelo nuevamente.');
      }
    } finally {
      setBuscando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') buscarNotas();
  };

  const calificacionesPorPeriodo = (): Map<string, CalificacionItem[]> => {
    const map = new Map<string, CalificacionItem[]>();
    if (!resultado?.calificaciones) return map;
    for (const c of resultado.calificaciones) {
      const key = c.idEvaluacion?.idPeriodo?.nombrePeriodo ?? 'Sin perÃ­odo';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }
    return map;
  };

  // Render

  if (sedeError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🏫</div>
          <h1 className="text-xl font-semibold text-gray-700">Institución no encontrada</h1>
          <p className="text-gray-500 mt-2 text-sm">El enlace no corresponde a ninguna institución activa.</p>
        </div>
      </div>
    );
  }

  const inst = sedeInfo?.institucion;
  const logoUrl = inst?.logoPath ? `${BASE_URL}${inst.logoPath}` : null;
  const nombreInst = inst?.nombre ?? sedeInfo?.nombreSede ?? '';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* â”€â”€ Hero Institucional â”€â”€ */}
      <div
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-2xl mx-auto px-4 pt-12 pb-16 flex flex-col items-center text-center">

          {/* Logo grande */}
          <div className="mb-5">
            {sedeInfo ? (
              logoUrl && !imgError ? (
                <img
                  src={logoUrl}
                  alt={nombreInst}
                  onError={() => setImgError(true)}
                  className="w-28 h-28 rounded-2xl object-contain bg-white p-2 shadow-xl ring-4 ring-white/30"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-white/20 backdrop-blur ring-4 ring-white/30 shadow-xl flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{initiales(nombreInst)}</span>
                </div>
              )
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-white/10 animate-pulse" />
            )}
          </div>

          {/* Nombre y datos */}
          {sedeInfo ? (
            <>
              <h1 className="text-2xl font-bold leading-tight tracking-tight">
                {nombreInst}
              </h1>
              <p className="mt-1.5 text-white/70 text-sm font-medium">
                {sedeInfo.nombreSede}
                {sedeInfo.distrito ? ` · ${sedeInfo.distrito}` : ''}
                {sedeInfo.provincia ? `, ${sedeInfo.provincia}` : ''}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                {inst?.nombreDirector && (
                  <span className="bg-white/15 backdrop-blur rounded-full px-3 py-1">
                    Dir. {inst.nombreDirector}
                  </span>
                )}
                {sedeInfo.ugel && (
                  <span className="bg-white/15 backdrop-blur rounded-full px-3 py-1">
                    UGEL {sedeInfo.ugel}
                  </span>
                )}
                {inst?.tipoGestion && (
                  <span className="bg-white/15 backdrop-blur rounded-full px-3 py-1">
                    {inst.tipoGestion}
                  </span>
                )}
                {inst?.codModular && (
                  <span className="bg-white/15 backdrop-blur rounded-full px-3 py-1">
                    Cód. {inst.codModular}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-3 animate-pulse w-full max-w-sm">
              <div className="h-6 bg-white/20 rounded-lg mx-auto w-3/4" />
              <div className="h-4 bg-white/15 rounded-lg mx-auto w-1/2" />
            </div>
          )}
        </div>
      </div>

      {/* â”€â”€ Buscador (sobresaliendo del hero) â”€â”€ */}
      <div className="max-w-2xl w-full mx-auto px-4 -mt-7 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Consulta de Notas
          </p>
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ingrese el DNI del alumno"
              maxLength={12}
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-base
                         focus:outline-none focus:border-indigo-500 transition-colors
                         disabled:bg-gray-50 placeholder:text-gray-400"
              disabled={buscando}
            />
            <button
              onClick={buscarNotas}
              disabled={buscando}
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                         disabled:bg-indigo-300 text-white px-7 py-3 rounded-xl
                         text-sm font-semibold transition-colors shadow-sm shadow-indigo-200
                         whitespace-nowrap"
            >
              {buscando ? 'Buscandoâ€¦' : 'Buscar'}
            </button>
          </div>
        </div>
      </div>

      {/* â”€â”€ Contenido de resultados â”€â”€ */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 space-y-4">

        {errorBusqueda && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm flex gap-2 items-start">
            <span className="text-lg leading-none">⚠️</span>
            <span>{errorBusqueda}</span>
          </div>
        )}

        {resultado && (
          <>
            {/* Card alumno */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
              {resultado.alumno.fotoUrl ? (
                <img
                  src={`${BASE_URL}${resultado.alumno.fotoUrl}`}
                  alt={resultado.alumno.nombres}
                  className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-gray-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 font-bold text-lg">
                  {(resultado.alumno.nombres[0] ?? '') + (resultado.alumno.apellidos[0] ?? '')}
                </div>
              )}
              <div>
                <p className="font-bold text-gray-800 text-base">
                  {resultado.alumno.apellidos}, {resultado.alumno.nombres}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">DNI: {resultado.alumno.numeroDocumento}</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                  Alumno encontrado
                </span>
              </div>
            </div>

            {resultado.calificaciones.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-10 text-center text-gray-400 text-sm">
                Este alumno aún no tiene calificaciones registradas.
              </div>
            ) : (
              Array.from(calificacionesPorPeriodo().entries()).map(([periodo, califs]) => (
                <div key={periodo} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700 text-sm">{periodo}</h3>
                    <span className="text-xs text-gray-400">{califs.length} evaluación{califs.length !== 1 ? 'es' : ''}</span>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
                        <th className="text-left px-5 py-2.5 font-medium">Evaluación</th>
                        <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">Tipo</th>
                        <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">Fecha</th>
                        <th className="text-center px-4 py-2.5 font-medium">Nota</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {califs.map((c) => (
                        <tr key={c.idCalificacion} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-5 py-3.5 text-gray-700 font-medium">
                            {c.idEvaluacion?.temaEspecifico ?? '—'}
                            {c.observaciones && (
                              <p className="text-xs text-gray-400 font-normal mt-0.5">{c.observaciones}</p>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-gray-500 hidden sm:table-cell">
                            {c.idEvaluacion?.idTipoEvaluacion?.nombre ?? '—'}
                          </td>
                          <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap hidden sm:table-cell">
                            {formatFecha(c.idEvaluacion?.fechaEvaluacion ?? c.fechaCalificacion)}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badgeColor(c.notaObtenida)}`}>
                              {c.notaObtenida}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            )}
          </>
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 py-5">
        Portal de Consulta de Notas
        {sedeInfo?.ugel ? ` · UGEL ${sedeInfo.ugel}` : ''}
      </footer>

    </div>
  );
}
