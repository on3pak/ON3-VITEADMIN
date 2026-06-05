import { ServiceReport } from '../types';

function getTodayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const today = getTodayStr();
const now = new Date().toISOString();

export const INITIAL_SERVICE_REPORTS: ServiceReport[] = [
  {
    id: 'sr_mock_diario_01',
    date: today,
    type: 'DIARIO',
    city_id: 'city_1',
    status: 'DRAFT',
    assignments: [
      { id: 'sa_mock_001', work_center_id: 'wc_1', shift_id: 's_1', employee_id: '000001', service_id: 'svc_1', vehicle_id: 'veh_v001' },
      { id: 'sa_mock_002', work_center_id: 'wc_1', shift_id: 's_1', employee_id: '000002', service_id: 'svc_2' },
      { id: 'sa_mock_003', work_center_id: 'wc_1', shift_id: 's_1', employee_id: '000003', service_id: 'svc_3', vehicle_id: 'veh_v010' },
      { id: 'sa_mock_004', work_center_id: 'wc_1', shift_id: 's_1', employee_id: '000004', service_id: 'svc_4' },
      { id: 'sa_mock_005', work_center_id: 'wc_1', shift_id: 's_1', employee_id: '000005', service_id: 'svc_5' },
      { id: 'sa_mock_006', work_center_id: 'wc_1', shift_id: 's_1', employee_id: '000006', service_id: 'svc_6' },
      { id: 'sa_mock_007', work_center_id: 'wc_1', shift_id: 's_1', employee_id: '000007', service_id: 'svc_7' },
      { id: 'sa_mock_008', work_center_id: 'wc_1', shift_id: 's_1', employee_id: '000008', service_id: 'svc_11' },
      { id: 'sa_mock_009', work_center_id: 'wc_1', shift_id: 's_1', employee_id: '000009', service_id: 'svc_12' },
      { id: 'sa_mock_010', work_center_id: 'wc_1', shift_id: 's_1', employee_id: '000010', service_id: 'svc_13' },
      { id: 'sa_mock_011', work_center_id: 'wc_1', shift_id: 's_1', employee_id: '000011', service_id: 'svc_16' },
      { id: 'sa_mock_012', work_center_id: 'wc_1', shift_id: 's_1', employee_id: '000016', service_id: 'svc_17' },
    ],
    attendance: [
      { employee_id: '000001', status: 'PRESENT' },
      { employee_id: '000002', status: 'PRESENT' },
      { employee_id: '000003', status: 'PRESENT' },
      { employee_id: '000004', status: 'PRESENT' },
      { employee_id: '000005', status: 'PRESENT' },
      { employee_id: '000006', status: 'PRESENT' },
      { employee_id: '000007', status: 'PRESENT' },
      { employee_id: '000008', status: 'PRESENT' },
      { employee_id: '000009', status: 'PRESENT' },
      { employee_id: '000010', status: 'PRESENT' },
      { employee_id: '000011', status: 'PRESENT' },
      { employee_id: '000016', status: 'PRESENT' },
    ],
    created_at: now,
    updated_at: now,
  },
];
