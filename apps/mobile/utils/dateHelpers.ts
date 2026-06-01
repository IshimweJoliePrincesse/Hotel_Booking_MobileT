export function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString();
}

export function todayDateInput() {
  return new Date().toISOString().slice(0, 10);
}

export function tomorrowDateInput() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}
