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
        status: 'pending',
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

function staffReq(i: number): { oficial: string | null; peones: number } {
  const n = (i % 3);
  if (n === 1) return { oficial: null, peones: 1 };
  const oficial = (i % 2 === 0) ? 'ec_000003' : 'ec_000004';
  if (n === 2) return { oficial, peones: 1 };
  return { oficial, peones: 2 };
}

// 10 BMIX (Barrido Mixto) in Nave
const bmixShift = (i: number) => i < 7 ? 's_1' : i < 9 ? 's_2' : 's_3';
for (let i = 0; i < 10; i++) {
  const id = `sv_${svcIdx++}`;
  services.push({
    id,
    work_center_id: 'wc_000001',
    shift_id: bmixShift(i),
    name: `BMIX${i + 1}`,
    category: 'BARRIDO MIXTO',
    staff_requirement: staffReq(i),
    tasks: generateTasks(id),
    week_start: '2026-06-01',
    created_at: '2025-01-01T08:00:00Z',
    updated_at: '2025-06-01T08:00:00Z',
  });
}

// 5 BMEC (Barrido Mecánico) in Nave
const bmecShift = (i: number) => i < 3 ? 's_1' : i === 3 ? 's_2' : 's_3';
for (let i = 0; i < 5; i++) {
  const id = `sv_${svcIdx++}`;
  services.push({
    id,
    work_center_id: 'wc_000001',
    shift_id: bmecShift(i),
    name: `BMEC${i + 1}`,
    category: 'BARRIDO MECÁNICO',
    staff_requirement: staffReq(i + 10),
    tasks: generateTasks(id),
    week_start: '2026-06-01',
    created_at: '2025-01-01T08:00:00Z',
    updated_at: '2025-06-01T08:00:00Z',
  });
}

// 5 RVOL (Recogida) in Nave
const rvolShift = (i: number) => i < 3 ? 's_1' : i === 3 ? 's_2' : 's_3';
for (let i = 0; i < 5; i++) {
  const id = `sv_${svcIdx++}`;
  services.push({
    id,
    work_center_id: 'wc_000001',
    shift_id: rvolShift(i),
    name: `RVOL${i + 1}`,
    category: 'RECOGIDA',
    staff_requirement: staffReq(i + 15),
    tasks: generateTasks(id),
    week_start: '2026-06-01',
    created_at: '2025-01-01T08:00:00Z',
    updated_at: '2025-06-01T08:00:00Z',
  });
}

// 1 service in Puerta Madrid (wc_2)
const pmId = `sv_${svcIdx++}`;
services.push({
  id: pmId,
  work_center_id: 'wc_000002',
  shift_id: 's_1',
  name: 'BALD1',
  category: 'BALDEO',
  staff_requirement: { oficial: 'ec_000003', peones: 1 },
  tasks: generateTasks(pmId),
  week_start: '2026-06-01',
  created_at: '2025-01-01T08:00:00Z',
  updated_at: '2025-06-01T08:00:00Z',
});

export const INITIAL_SERVICES: Service[] = services;
