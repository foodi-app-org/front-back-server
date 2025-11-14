import { DateTime } from 'luxon'

/**
 * Convert any input date to a target timezone using Luxon.
 *
 * @param {Date | string | number} date - Input date.
 * @param {string} zone - Target timezone in Luxon format (e.g., 'UTC-5', 'UTC+1').
 * @returns {Date} JavaScript Date converted to the specified timezone.
 *
 * @example
 * convertTimezone(new Date(), 'UTC-5');
 *
 * @example
 * convertTimezone('2025-11-14T12:00:00Z', 'UTC+1');
 */
export const convertTimezone = (
  date: Date | string | number,
  zone: string = 'UTC-5'
): Date => {
  try {
    const dt = DateTime.fromJSDate(
      date instanceof Date ? date : new Date(date),
      { zone: 'utc' } // Always interpret input as UTC for clarity
    );

    if (!dt.isValid) throw new Error('Invalid date input');

    const converted = dt.setZone(zone);

    return converted.toJSDate();
  } catch (err) {
    console.error('convertTimezone error:', err);
    return new Date(0); // fallback papu
  }
};
