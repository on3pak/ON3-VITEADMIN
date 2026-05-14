import { Service, ServiceTask, TaskStatus } from '../types';

export const INITIAL_SERVICE_TYPES: string[] = [
  'BARRIDO MIXTO',
  'BARRIDO MANUAL',
  'BARRIDO MECÁNICO',
  'BALDEO',
  'RECOGIDA',
  'VACIADO',
];

const DAY_LABELS = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo',
];

const TASK_TEMPLATES: string[] = [
  'Barrido manual de aceras y calzada',
  'Vaciado de papeleras',
  'Limpieza de imbornales y sumideros',
  'Desbroce de malas hierbas',
  'Barrido mecánico con sopladora',
  'Reposición de bolsas en papeleras',
  'Limpieza de contenedores soterrados',
  'Recogida de residuos voluminosos',
  'Limpieza de marquesinas y paradas',
  'Baldeo de calles con agua a presión',
  'Limpieza de parques y jardines',
  'Retirada de cartelería ilegal',
  'Limpieza de fuentes ornamentales',
  'Desinfección de contenedores',
  'Barrido manual de zonas peatonales',
  'Limpieza de imbornales con camión cuba',
  'Recogida de hojas y restos de poda',
  'Limpieza de solares y terrenos baldíos',
  'Mantenimiento de jardineras y parterres',
  'Limpieza de mobiliario urbano',
];

const DAY_ZONES: string[] = [
  'Zona Norte - Casco Antiguo',
  'Zona Sur - Polígono Industrial',
  'Zona Este - Parque Lineal',
  'Zona Oeste - Barrio Residencial',
  'Zona Centro - Eje Comercial',
  'Zona Periferia - Área Deportiva',
  'Zona Verde - Parques Periurbanos',
];

function generateTasks(serviceId: string, baseStatus: TaskStatus = 'COMPLETED'): ServiceTask[] {
  const tasks: ServiceTask[] = [];
  let taskId = 0;

  for (let day = 0; day < 7; day++) {
    for (let t = 0; t < 20; t++) {
      const isRecentDay = day < 3;
      const status: TaskStatus = isRecentDay ? 'COMPLETED' : (t % 4 === 0 ? 'COMPLETED' : 'PENDING');

      tasks.push({
        id: `${serviceId}-task-${taskId++}`,
        dayIndex: day,
        taskIndex: t,
        description: `${TASK_TEMPLATES[t]} - ${DAY_ZONES[day]}`,
        status,
      });
    }
  }
  return tasks;
}

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'svc-1',
    workCenterId: 'wc-1',
    name: 'BMIX1',
    type: 'BARRIDO MIXTO',
    tasks: generateTasks('svc-1'),
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-06-15T08:00:00Z',
  },
  {
    id: 'svc-2',
    workCenterId: 'wc-5',
    name: 'BMA2',
    type: 'BARRIDO MANUAL',
    tasks: generateTasks('svc-2'),
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-06-10T08:00:00Z',
  },
  {
    id: 'svc-3',
    workCenterId: 'wc-3',
    name: 'BMEC3',
    type: 'BARRIDO MECÁNICO',
    tasks: generateTasks('svc-3'),
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-06-01T08:00:00Z',
  },
  {
    id: 'svc-4',
    workCenterId: 'wc-2',
    name: 'BALD1',
    type: 'BALDEO',
    tasks: generateTasks('svc-4'),
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-05-20T08:00:00Z',
  },
  {
    id: 'svc-5',
    workCenterId: 'wc-7',
    name: 'RVOL1',
    type: 'RECOGIDA',
    tasks: generateTasks('svc-5'),
    createdAt: '2024-04-01T08:00:00Z',
    updatedAt: '2024-06-05T08:00:00Z',
  },
  {
    id: 'svc-6',
    workCenterId: 'wc-6',
    name: 'VAC1',
    type: 'VACIADO',
    tasks: generateTasks('svc-6'),
    createdAt: '2024-05-01T08:00:00Z',
    updatedAt: '2024-06-12T08:00:00Z',
  },
];
