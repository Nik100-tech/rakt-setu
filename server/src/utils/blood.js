const compatibility = {
  "O-": ["O-"],
  "O+": ["O+", "O-"],
  "A-": ["A-", "O-"],
  "A+": ["A+", "A-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "AB-": ["AB-", "A-", "B-", "O-"],
  "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"]
};

const toDb = { "A+": "A_POS", "A-": "A_NEG", "B+": "B_POS", "B-": "B_NEG", "AB+": "AB_POS", "AB-": "AB_NEG", "O+": "O_POS", "O-": "O_NEG" };
const fromDb = Object.fromEntries(Object.entries(toDb).map(([k,v]) => [v,k]));

export function bloodLabel(dbValue) {
  return fromDb[dbValue] ?? dbValue;
}

export function donorCanGive(donorGroup, requestedGroup) {
  const donor = bloodLabel(donorGroup);
  return (compatibility[requestedGroup] ?? []).includes(donor);
}

export function bloodDb(label) {
  return toDb[label];
}

export function normalizeLocation(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function locationScore(a, b) {
  const x = normalizeLocation(a);
  const y = normalizeLocation(b);
  if (x === y) return 3;
  if (x.includes(y) || y.includes(x)) return 2;
  const xa = new Set(x.split(/[\s,]+/));
  const ya = new Set(y.split(/[\s,]+/));
  return [...xa].some(t => t.length > 3 && ya.has(t)) ? 1 : 0;
}
