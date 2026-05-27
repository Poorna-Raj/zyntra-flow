/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map a number from one range to another.
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Linear interpolation between two values.
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Format a demand score as a percentage string.
 */
export function formatDemandScore(score: number): string {
  return `${Math.round(score)}%`;
}

/**
 * Get a demand label based on score threshold.
 */
export function getDemandLabel(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= 75) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
}

/**
 * Get a demand color based on score threshold.
 */
export function getDemandColor(score: number): string {
  if (score >= 75) return 'var(--blue-primary)';
  if (score >= 50) return 'var(--blue-sky)';
  return 'var(--gray-400)';
}

/**
 * Debounce a function call.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a province name to a URL-safe slug.
 */
export function toSlug(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}