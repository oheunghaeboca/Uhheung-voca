export function formatScore(value) {
  if (value === null || value === undefined) return '-';
  const n = Number(value);
  if (Number.isNaN(n)) return '-';
  return `${n.toFixed(1)}점`;
}
