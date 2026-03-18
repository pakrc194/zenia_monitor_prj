// ── Mock data ──────────────────────────────────────────────────

export const DEVICES = [
  { id: "D-001", name: "비전검사기 #1", location: "라인 A - 스테이션 1", status: "ok",  lastSeen: "2025-03-18 14:32" },
  { id: "D-002", name: "비전검사기 #2", location: "라인 A - 스테이션 3", status: "ng",  lastSeen: "2025-03-18 14:31" },
  { id: "D-003", name: "외관검사기 #1", location: "라인 B - 스테이션 2", status: "ok",  lastSeen: "2025-03-18 14:32" },
  { id: "D-004", name: "치수측정기 #1", location: "라인 B - 스테이션 4", status: "warn",lastSeen: "2025-03-18 14:28" },
  { id: "D-005", name: "외관검사기 #2", location: "라인 C - 스테이션 1", status: "ok",  lastSeen: "2025-03-18 14:32" },
  { id: "D-006", name: "치수측정기 #2", location: "라인 C - 스테이션 3", status: "idle", lastSeen: "2025-03-18 13:10" },
];

export const INSPECTIONS_BY_DEVICE = {
  "전체": { ok: 8412, ng: 347 },
  "D-001": { ok: 1824, ng: 43 },
  "D-002": { ok: 1530, ng: 112 },
  "D-003": { ok: 1788, ng: 56 },
  "D-004": { ok: 1612, ng: 88 },
  "D-005": { ok: 1658, ng: 48 },
  "D-006": { ok: 0, ng: 0 },
};

// hourly data per date offset (0 = today, -1 = yesterday, ...)
function genHourly(seed) {
  return Array.from({ length: 24 }, (_, h) => {
    const base = h >= 8 && h <= 20 ? 300 + Math.floor(Math.sin((h - 8) * 0.4) * 120 + seed * 10) : 20;
    const ok = Math.max(0, base + Math.floor(Math.random() * 40 - 20));
    const ng = Math.max(0, Math.floor(ok * (0.02 + Math.random() * 0.03)));
    return { hour: h, ok, ng };
  });
}
export const HOURLY_DATA = {
  0:  genHourly(3),
  "-1": genHourly(5),
  "-2": genHourly(2),
  "-3": genHourly(4),
};

export const ALARMS = [
  { id: "A-1042", time: "2025-03-18 14:31:05", device: "비전검사기 #2", severity: "critical", message: "연속 NG 발생 - 임계값 초과 (5회 연속)" },
  { id: "A-1041", time: "2025-03-18 14:28:49", device: "치수측정기 #1", severity: "warning", message: "측정 편차 경고 - ±0.12mm 초과" },
  { id: "A-1040", time: "2025-03-18 13:55:12", device: "비전검사기 #2", severity: "critical", message: "NG율 10% 초과 (현재 12.4%)" },
  { id: "A-1039", time: "2025-03-18 12:44:30", device: "치수측정기 #2", severity: "info",     message: "장비 유지보수 완료 - 대기 상태로 전환" },
  { id: "A-1038", time: "2025-03-18 11:20:08", device: "외관검사기 #1", severity: "warning", message: "조명 밝기 이상 감지 - 보정 권장" },
  { id: "A-1037", time: "2025-03-18 10:05:55", device: "비전검사기 #1", severity: "info",     message: "모델 교체 완료 - MODEL_B 활성화" },
  { id: "A-1036", time: "2025-03-18 09:33:17", device: "비전검사기 #2", severity: "warning", message: "카메라 초점 드리프트 감지" },
  { id: "A-1035", time: "2025-03-18 08:58:44", device: "치수측정기 #1", severity: "info",     message: "영점 교정 완료" },
  { id: "A-1034", time: "2025-03-17 22:11:03", device: "외관검사기 #2", severity: "critical", message: "통신 오류 - 재연결 시도 중" },
  { id: "A-1033", time: "2025-03-17 18:40:27", device: "비전검사기 #1", severity: "warning", message: "처리 지연 경고 (>200ms)" },
];

export const SUMMARY = {
  devices: DEVICES.length,
  ng: DEVICES.filter(d => d.status === "ng").length,
  alarms: ALARMS.filter(a => a.severity === "critical").length,
  totalInspections: 8759,
};
