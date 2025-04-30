import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { interval, Subscription, takeUntil, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScalableFontDirective } from './directives/scalable-font.directive';
import { DateValidationService } from './services/date-validation.service';
import {
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  COUNTDOWN_INTERVAL,
  ERROR_MESSAGES,
  DEFAULT_COUNTDOWN_DURATION,
  DEFAULT_COUNTDOWN_TITLE,
} from './app.constants';

interface CountdownData {
  title: string;
  targetDate: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, ScalableFontDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private countdownSubscription: Subscription | null = null;

  // Expose error messages to template
  readonly errorMessages = ERROR_MESSAGES;
  readonly minLength = TITLE_MIN_LENGTH;
  readonly maxLength = TITLE_MAX_LENGTH;

  countdownTitle = '';
  minDate = '';
  maxDate = '';
  targetDate: Date | null = null;
  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;

  // Form model
  title = '';
  selectedDate: string | null = null;

  constructor(private dateValidationService: DateValidationService) {}

  ngOnInit(): void {
    this.initializeMinDate();
    this.initializeMaxDate();
    this.initializeCountdown();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopCountdown();
  }

  private initializeMinDate(): void {
    const today = new Date();
    this.minDate = this.dateValidationService.formatDateForInput(today);
  }

  private initializeMaxDate(): void {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() + 10);
    this.maxDate = this.dateValidationService.formatDateForInput(maxDate);
  }

  private initializeCountdown(): void {
    const savedData = this.loadCountdownData();
    if (savedData) {
      this.countdownTitle = savedData.title;
      this.targetDate = new Date(savedData.targetDate);
      this.targetDate.setHours(0, 0, 0, 0);
      this.startCountdown();
    } else {
      this.targetDate = new Date(Date.now() + DEFAULT_COUNTDOWN_DURATION);
      this.countdownTitle = DEFAULT_COUNTDOWN_TITLE;
      this.startCountdown();
    }
  }

  private saveCountdownData(): void {
    if (!this.targetDate) return;

    const data: CountdownData = {
      title: this.countdownTitle,
      targetDate: this.targetDate.toISOString(),
    };

    try {
      localStorage.setItem('countdownData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save countdown data:', error);
    }
  }

  private loadCountdownData(): CountdownData | null {
    try {
      const savedData = localStorage.getItem('countdownData');
      if (!savedData) return null;

      const data = JSON.parse(savedData) as CountdownData;
      if (!this.isValidCountdownData(data)) return null;

      return data;
    } catch (error) {
      console.error('Error loading countdown data:', error);
      return null;
    }
  }

  private isValidCountdownData(data: CountdownData): boolean {
    return (
      typeof data.title === 'string' &&
      data.title.length >= this.minLength &&
      data.title.length <= this.maxLength &&
      !/[!@#$%^&*()_+\-=[\]{};\\":|,.<>/?]+/.test(data.title) &&
      typeof data.targetDate === 'string' &&
      !isNaN(new Date(data.targetDate).getTime())
    );
  }

  onFormSubmit(): void {
    if (!this.isValidForm()) return;

    const newDate = this.createTargetDate();
    if (!newDate || newDate < new Date()) return;

    this.stopCountdown();
    this.countdownTitle = this.title.trim();
    this.targetDate = newDate;
    this.saveCountdownData();
    this.startCountdown();
    this.resetForm();
  }

  private isValidForm(): boolean {
    if (!this.title || !this.selectedDate) return false;
    return this.dateValidationService.isValidDate(
      this.selectedDate,
      this.minDate,
    );
  }

  private createTargetDate(): Date | null {
    return this.dateValidationService.createTargetDate(this.selectedDate);
  }

  private resetForm(): void {
    this.title = '';
    this.selectedDate = null;
  }

  startCountdown(): void {
    this.stopCountdown();
    this.updateCountdown();

    this.countdownSubscription = interval(COUNTDOWN_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateCountdown();
      });
  }

  stopCountdown(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
      this.countdownSubscription = null;
    }
  }

  private calculateTimeRemaining(): number {
    if (!this.targetDate) return 0;
    return this.targetDate.getTime() - Date.now();
  }

  updateCountdown(): void {
    const difference = this.calculateTimeRemaining();

    if (difference <= 0) {
      this.stopCountdown();
      this.resetCountdownValues();
      return;
    }

    this.updateCountdownValues(difference);
  }

  private resetCountdownValues(): void {
    this.days = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
  }

  private updateCountdownValues(difference: number): void {
    this.days = Math.floor(difference / (1000 * 60 * 60 * 24));
    this.hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    this.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((difference % (1000 * 60)) / 1000);
  }

  onDateInput(dateInput: any): void {
    dateInput.control.markAsTouched();
    if (this.selectedDate) {
      dateInput.control.setErrors(
        this.isDateValid(this.selectedDate) ? null : { min: true },
      );
    }
  }

  isDateValid(date: string | null): boolean {
    if (!date) return false;
    return this.dateValidationService.isValidDate(date, this.minDate);
  }
}
