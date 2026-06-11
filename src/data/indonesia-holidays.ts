export type Holiday = {
  date: string; // YYYY-MM-DD
  name: string; // English name
  nameBahasa: string; // Indonesian name
};

export const indonesiaHolidays2025: Holiday[] = [
  { date: "2025-01-01", name: "New Year's Day 2025", nameBahasa: "Tahun Baru 2025 Masehi" },
  { date: "2025-01-27", name: "Isra Mi'raj of Prophet Muhammad SAW", nameBahasa: "Isra Mikraj Nabi Muhammad SAW" },
  { date: "2025-01-29", name: "Chinese New Year 2576", nameBahasa: "Tahun Baru Imlek 2576 Kongzili" },
  { date: "2025-03-29", name: "Day of Silence (Nyepi)", nameBahasa: "Hari Suci Nyepi (Tahun Baru Saka 1947)" },
  { date: "2025-03-31", name: "Eid al-Fitr Day 1", nameBahasa: "Hari Raya Idulfitri 1446 Hijriah" },
  { date: "2025-04-01", name: "Eid al-Fitr Day 2", nameBahasa: "Hari Raya Idulfitri 1446 Hijriah" },
  { date: "2025-04-18", name: "Good Friday", nameBahasa: "Wafat Yesus Kristus" },
  { date: "2025-04-20", name: "Easter Sunday", nameBahasa: "Kebangkitan Yesus Kristus (Paskah)" },
  { date: "2025-05-01", name: "International Labour Day", nameBahasa: "Hari Buruh Internasional" },
  { date: "2025-05-12", name: "Vesak Day 2569 BE", nameBahasa: "Hari Raya Waisak 2569 BE" },
  { date: "2025-05-29", name: "Ascension Day", nameBahasa: "Kenaikan Yesus Kristus" },
  { date: "2025-06-01", name: "Pancasila Day", nameBahasa: "Hari Lahir Pancasila" },
  { date: "2025-06-06", name: "Eid al-Adha", nameBahasa: "Hari Raya Idul Adha 1446 Hijriah" },
  { date: "2025-06-27", name: "Islamic New Year", nameBahasa: "Tahun Baru Islam 1447 Hijriah" },
  { date: "2025-08-17", name: "Independence Day", nameBahasa: "Hari Proklamasi Kemerdekaan RI" },
  { date: "2025-09-05", name: "Prophet Muhammad's Birthday", nameBahasa: "Maulid Nabi Muhammad SAW" },
  { date: "2025-12-25", name: "Christmas Day", nameBahasa: "Hari Raya Natal" },
];

export const indonesiaHolidays2026: Holiday[] = [
  { date: "2026-01-01", name: "New Year's Day 2026", nameBahasa: "Tahun Baru 2026 Masehi" },
  { date: "2026-01-16", name: "Isra Mi'raj", nameBahasa: "Isra Mikraj Nabi Muhammad SAW" },
  { date: "2026-02-17", name: "Chinese New Year 2577", nameBahasa: "Tahun Baru Imlek 2577 Kongzili" },
  { date: "2026-03-19", name: "Day of Silence (Nyepi)", nameBahasa: "Hari Suci Nyepi (Tahun Baru Saka 1948)" },
  { date: "2026-03-21", name: "Eid al-Fitr Day 1", nameBahasa: "Hari Raya Idulfitri 1447 Hijriah" },
  { date: "2026-03-22", name: "Eid al-Fitr Day 2", nameBahasa: "Hari Raya Idulfitri 1447 Hijriah" },
  { date: "2026-04-03", name: "Good Friday", nameBahasa: "Wafat Yesus Kristus" },
  { date: "2026-04-05", name: "Easter Sunday", nameBahasa: "Kebangkitan Yesus Kristus (Paskah)" },
  { date: "2026-05-01", name: "International Labour Day", nameBahasa: "Hari Buruh Internasional" },
  { date: "2026-05-14", name: "Ascension Day", nameBahasa: "Kenaikan Yesus Kristus" },
  { date: "2026-05-27", name: "Eid al-Adha", nameBahasa: "Hari Raya Idul Adha 1447 Hijriah" },
  { date: "2026-05-31", name: "Vesak Day 2570 BE", nameBahasa: "Hari Raya Waisak 2570 BE" },
  { date: "2026-06-01", name: "Pancasila Day", nameBahasa: "Hari Lahir Pancasila" },
  { date: "2026-06-16", name: "Islamic New Year", nameBahasa: "Tahun Baru Islam 1448 Hijriah" },
  { date: "2026-08-17", name: "Independence Day", nameBahasa: "Hari Proklamasi Kemerdekaan RI" },
  { date: "2026-08-25", name: "Prophet Muhammad's Birthday", nameBahasa: "Maulid Nabi Muhammad SAW" },
  { date: "2026-12-25", name: "Christmas Day", nameBahasa: "Hari Raya Natal" },
];

export const allHolidays: Holiday[] = [
  ...indonesiaHolidays2025,
  ...indonesiaHolidays2026,
];

const holidayMap = new Map<string, Holiday>(
  allHolidays.map((h) => [h.date, h])
);

/**
 * Check if a YYYY-MM-DD date string is an Indonesian national holiday.
 * Returns the Holiday object if found, undefined otherwise.
 */
export function isHoliday(date: string): Holiday | undefined {
  return holidayMap.get(date);
}

/**
 * Returns all Indonesian national holidays between two dates (inclusive).
 * Both start and end should be YYYY-MM-DD strings.
 */
export function getHolidaysInRange(start: string, end: string): Holiday[] {
  return allHolidays.filter((h) => h.date >= start && h.date <= end);
}
