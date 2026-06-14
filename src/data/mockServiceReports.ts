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
    type: 'daily',
    city_id: 'ci_000001',
    status: 'draft',
    assignments: [
      { id: 'sa_mock_001', work_center_id: 'wc_000001', shift_id: 's_1', employee_id: '000001', service_id: 'sv_000001', vehicle_id: 'vh_000001' },
      { id: 'sa_mock_002', work_center_id: 'wc_000001', shift_id: 's_1', employee_id: '000002', service_id: 'sv_000002' },
      { id: 'sa_mock_003', work_center_id: 'wc_000001', shift_id: 's_1', employee_id: '000003', service_id: 'sv_000003', vehicle_id: 'vh_000010' },
      { id: 'sa_mock_004', work_center_id: 'wc_000001', shift_id: 's_1', employee_id: '000004', service_id: 'sv_000004' },
      { id: 'sa_mock_005', work_center_id: 'wc_000001', shift_id: 's_1', employee_id: '000005', service_id: 'sv_000005' },
      { id: 'sa_mock_006', work_center_id: 'wc_000001', shift_id: 's_1', employee_id: '000006', service_id: 'sv_000006' },
      { id: 'sa_mock_007', work_center_id: 'wc_000001', shift_id: 's_1', employee_id: '000007', service_id: 'sv_000007' },
      { id: 'sa_mock_008', work_center_id: 'wc_000001', shift_id: 's_1', employee_id: '000008', service_id: 'sv_000011' },
      { id: 'sa_mock_009', work_center_id: 'wc_000001', shift_id: 's_1', employee_id: '000009', service_id: 'sv_000012' },
      { id: 'sa_mock_010', work_center_id: 'wc_000001', shift_id: 's_1', employee_id: '000010', service_id: 'sv_000013' },
      { id: 'sa_mock_011', work_center_id: 'wc_000001', shift_id: 's_1', employee_id: '000011', service_id: 'sv_000016' },
      { id: 'sa_mock_012', work_center_id: 'wc_000001', shift_id: 's_1', employee_id: '000016', service_id: 'sv_000017' },
    ],
    attendance: [
      { employee_id: '000001', status: 'present' },
      { employee_id: '000002', status: 'present' },
      { employee_id: '000003', status: 'present' },
      { employee_id: '000004', status: 'present' },
      { employee_id: '000005', status: 'present' },
      { employee_id: '000006', status: 'present' },
      { employee_id: '000007', status: 'present' },
      { employee_id: '000008', status: 'present' },
      { employee_id: '000009', status: 'present' },
      { employee_id: '000010', status: 'present' },
      { employee_id: '000011', status: 'present' },
      { employee_id: '000016', status: 'present' },
    ],
    created_at: now,
    updated_at: now,
  },
];
