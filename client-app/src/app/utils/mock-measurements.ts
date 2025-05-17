/** ──────────────────────────────────────────────────────────────────────────
 * Helpers to seed localStorage with fake data for:
 *   • bloodPressure   (e.g. “120/80”)
 *   • bloodSugar      (e.g. “5.6” mmol/L)
 *   • weight          (e.g. “72.3” kg)
 * over the last N days.
 *──────────────────────────────────────────────────────────────────────────*/

/** pick a random Date between start and end */
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/** format a Date to ISO (so our load logic works unchanged) */
function fmt(d: Date) {
  return d.toISOString();
}

/** generate a fake “systolic/diastolic” string */
function genBloodPressure(): string {
  const sys = 90 + Math.floor(Math.random() * 50);   // 90–140
  const dia = 60 + Math.floor(Math.random() * 30);   // 60–90
  return `${sys}/${dia}`;
}

/** generate a fake blood sugar 3.5–9.0 with one decimal */
function genBloodSugar(): string {
  return (3.5 + Math.random() * 5.5).toFixed(1);
}

/** generate a fake weight 50.0–100.0 kg */
function genWeight(): string {
  return (50 + Math.random() * 50).toFixed(1);
}

/**
 * Seed `localStorage[key]` with `count` entries,
 * using `valueFn()` to make the `.value` and random date in last `days` days.
 */
function seedMeasurements(
  key: 'bloodPressure' | 'bloodSugar' | 'weight',
  count: number,
  valueFn: () => string,
  days = 60
) {
  const now = Date.now();
  const past = now - days * 24 * 60 * 60 * 1000;
  const arr: Array<{ value: string; date: string; status: string; statusText: string }> = [];

  for (let i = 0; i < count; i++) {
    const d = new Date(past + Math.random() * (now - past));
    arr.push({
      value: valueFn(),
      date: fmt(d),
      status: 'primary',
      statusText: 'Recorded'
    });
  }

  // if you already have data and just want to append:
  // const existing = JSON.parse(localStorage.getItem(key) || '[]');
  // localStorage.setItem(key, JSON.stringify(existing.concat(arr)));

  // or overwrite completely:
  localStorage.setItem(key, JSON.stringify(arr));
}

/** seed *all three* parameter keys with `n` points each */
export function seedAllMeasurements(n = 100) {
  seedMeasurements('bloodPressure', n, genBloodPressure);
  seedMeasurements('bloodSugar',   n, genBloodSugar);
  seedMeasurements('weight',       n, genWeight);
  console.log(`Seeded ${n} entries for BP, Sugar & Weight.`);
}