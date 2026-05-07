import React from 'react';
import { 
  FileText, 
  Layers, 
  ShieldCheck, 
  CheckCircle, 
  Cpu, 
  Workflow 
} from 'lucide-react';

export const BestPracticesView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" /> 
          Informe de Arquitectura: ON3ADMIN, Frameworks y Buenas Prácticas
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          A continuación se detallan los pilares conceptuales y las decisiones de diseño aplicadas para lograr un panel administrativo escalable, robusto y fácil de mantener.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Layers className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">1. Estructura de Carpetas Escalable</h4>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Para evitar que el código colapse a medida que crecen las vistas, se implementa una separación de responsabilidades basada en dominios funcionales:
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 font-medium">
            <li><span className="font-mono text-indigo-600">/src/types</span>: Definiciones de datos TypeScript globales e inmutables.</li>
            <li><span className="font-mono text-indigo-600">/src/context</span>: Estado global granular (AuthContext separado de UserContext) para evitar re-renders masivos innecesarios.</li>
            <li><span className="font-mono text-indigo-600">/src/utils</span>: Utilidades puras aisladas (como codificación/decodificación JWT).</li>
            <li><span className="font-mono text-indigo-600">/src/components</span>: Elementos visuales reutilizables, desacoplados del estado del negocio.</li>
            <li><span className="font-mono text-indigo-600">/src/views</span>: Pantallas de alto nivel que orquestan los componentes de UI.</li>
          </ul>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">2. Matriz de Control de Acceso (RBAC)</h4>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            La seguridad no se confía únicamente a ocultar botones en la interfaz de usuario. Las reglas de negocio quedan integradas en el core de los custom hooks del ON3ADMIN:
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px] font-mono text-slate-700">
            <div>• <span className="font-bold text-purple-700">ROOT</span>: Bypass total. Control global absoluto.</div>
            <div>• <span className="font-bold text-blue-700">ADMIN</span>: CRUD de usuarios (bloqueado alterar cuentas ROOT).</div>
            <div>• <span className="font-bold text-amber-700">MANAGER</span>: Crea/edita roles USER/MANAGER. No borra nada.</div>
            <div>• <span className="font-bold text-slate-700">USER</span>: Permiso de Solo Lectura. Bloqueo 403 automático.</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Cpu className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">3. Frameworks Sugeridos & ON3ADMIN</h4>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            En ecosistemas modernos como Next.js (App Router), la recomendación oficial para paneles administrativos es combinar <span className="font-semibold text-slate-700">React Context</span> para interacciones eficientes del lado del cliente, junto con <span className="font-semibold text-slate-700">Middleware de Servidor</span> para interceptar peticiones HTTP de tokens JWT.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Al separar <span className="font-mono text-emerald-700 font-bold">AuthProvider</span> de <span className="font-mono text-emerald-700 font-bold">UserProvider</span>, logramos que un cambio en la lista de usuarios no obligue a recalcular la expiración del token de sesión ni parpadee la identidad del operador logueado.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Workflow className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">4. Diseño Limpio y Experiencia Profesional</h4>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            El diseño profesional丢弃 saturaciones visuales y prioriza el contraste legibilidad-datos:
          </p>
          <ul className="text-xs text-slate-600 space-y-1 list-none">
            <li className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
              <span>Paleta de colores sobria utilizando tonalidades Slate, Indigo y Zinc.</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
              <span>Feedback inmediato mediante Toasts reactivos e informativos.</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
              <span>Botones interactivos claros que previenen el error del usuario.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};