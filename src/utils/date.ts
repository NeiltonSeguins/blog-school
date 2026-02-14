export function formatDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString; // Return original if invalid
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function parseDate(dateString: string): string {
  // Expects DD/MM/YYYY
  if (!dateString) return new Date().toISOString();
  
  const [day, month, year] = dateString.split('/');
  
  if (!day || !month || !year) return new Date().toISOString();

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}
