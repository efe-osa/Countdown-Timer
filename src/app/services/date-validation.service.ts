import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateValidationService {
  /**
   * Validates if a date is valid and not before the minimum date
   * @param selectedDate The date to validate
   * @param minDate The minimum allowed date
   * @returns boolean indicating if the date is valid
   */
  isValidDate(selectedDate: string | null, minDate: string): boolean {
    if (!selectedDate) return false;

    const date = new Date(selectedDate);
    const min = new Date(minDate);

    // Set hours to 0 to compare only dates
    date.setHours(0, 0, 0, 0);
    min.setHours(0, 0, 0, 0);
    console.log('date', date, 'min', min);
    return date >= min;
  }

  /**
   * Creates a target date from a string date
   * @param dateString The date string to convert
   * @returns Date object or null if invalid
   */
  createTargetDate(dateString: string | null): Date | null {
    if (!dateString) return null;

    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  /**
   * Formats a date for HTML date input
   * @param date The date to format
   * @returns Formatted date string (YYYY-MM-DD)
   */
  formatDateForInput(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
