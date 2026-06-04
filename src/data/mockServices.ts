import { Service, ServiceTask } from '../types';

export const INITIAL_SERVICE_CATEGORIES: string[] = [
  'BARRIDO MIXTO',
  'BARRIDO MANUAL',
  'BARRIDO MECÁNICO',
  'BALDEO',
  'RECOGIDA',
  'VACIADO',
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

function generateTasks(serviceId: string): ServiceTask[] {
  const tasks: ServiceTask[] = [];
  let taskId = 0;
  const now = new Date().toISOString();

  for (let day = 0; day < 7; day++) {
    for (let t = 0; t < 20; t++) {
      tasks.push({
        id: `${serviceId}-task-${taskId++}`,
        service_id: serviceId,
        day_index: day,
        task_index: t,
        description: `${TASK_TEMPLATES[t]} - ${DAY_ZONES[day]}`,
        status: 'PENDING',
        zone: DAY_ZONES[day],
        assigned_to: null,
        created_at: now,
        updated_at: now,
      });
    }
  }
  return tasks;
}

const services: Service[] = [];
let svcIdx = 1;

// 10 BMIX (Barrido Mixto) in Nave
for (let i = 0; i < 10; i++) {
  const id = `svc_${svcIdx++}`;
  services.push({
    id,
    work_center_id: 'wc_1',
    name: `BMIX${i + 1}`,
    category: 'BARRIDO MIXTO',
    tasks: generateTasks(id),
    week_start: '2026-06-01',
    created_at: '2025-01-01T08:00:00Z',
    updated_at: '2025-06-01T08:00:00Z',
  });
}

// 5 BMEC (Barrido Mecánico) in Nave
for (let i = 0; i < 5; i++) {
  const id = `svc_${svcIdx++}`;
  services.push({
    id,
    work_center_id: 'wc_1',
    name: `BMEC${i + 1}`,
    category: 'BARRIDO MECÁNICO',
    tasks: generateTasks(id),
    week_start: '2026-06-01',
    created_at: '2025-01-01T08:00:00Z',
    updated_at: '2025-06-01T08:00:00Z',
  });
}

// 5 RVOL (Recogida) in Nave
for (let i = 0; i < 5; i++) {
  const id = `svc_${svcIdx++}`;
  services.push({
    id,
    work_center_id: 'wc_1',
    name: `RVOL${i + 1}`,
    category: 'RECOGIDA',
    tasks: generateTasks(id),
    week_start: '2026-06-01',
    created_at: '2025-01-01T08:00:00Z',
    updated_at: '2025-06-01T08:00:00Z',
  });
}

// 1 service in Puerta Madrid (wc_2)
const pmId = `svc_${svcIdx++}`;
services.push({
  id: pmId,
  work_center_id: 'wc_2',
  name: 'BALD1',
  category: 'BALDEO',
  tasks: generateTasks(pmId),
  week_start: '2026-06-01',
  created_at: '2025-01-01T08:00:00Z',
  updated_at: '2025-06-01T08:00:00Z',
});

export const INITIAL_SERVICES: Service[] = services;
