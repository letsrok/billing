
export function declOfNum(n) {
  const days = Math.abs(n) % 100; const n1 = n % 10;
  if (days > 10 && days < 20) { return `${n} дней`; }
  if (n1 > 1 && n1 < 5) { return `${n} дня`; }
  if (n1 === 1) { return `${n} день`; }
  return `${n} дней`;
}
