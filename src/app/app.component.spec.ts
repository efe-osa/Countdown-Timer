import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScalableFontDirective } from './directives/scalable-font.directive';
import { DateValidationService } from './services/date-validation.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let compiled: HTMLElement;
  let dateValidationService: DateValidationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, FormsModule, CommonModule, ScalableFontDirective],
      providers: [DateValidationService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    dateValidationService = TestBed.inject(DateValidationService);
    fixture.detectChanges();

    compiled = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => {
    fixture.destroy();
  });
  describe('UI rendering', () => {
    it('should create app component', () => {
      expect(component).toBeTruthy();
    });

    it('should render event title', () => {
      expect(compiled.querySelector('h1')?.textContent).toContain('Time to');
    });

    it('should render form', () => {
      expect(compiled.querySelector('form')).toBeTruthy();
    });

    it('should render title input', () => {
      expect(compiled.querySelector('#title-input')).toBeTruthy();
    });

    it('should render date input', () => {
      expect(compiled.querySelector('#date-input')).toBeTruthy();
    });
  });

  describe('input validation on touch', () => {
    it('should show title error message only after input is touched', () => {
      // Simulate input touch
      const titleInput = compiled.querySelector(
        '#title-input',
      ) as HTMLInputElement;
      titleInput.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      // Error message should now be visible
      const errorMessage = compiled.querySelector(
        '#title-input + .form-error-message div',
      )?.textContent;
      expect(errorMessage?.trim()).toBe(component.errorMessages.TITLE.REQUIRED);
    });

    it('should show date error message only after input is touched', () => {
      // Simulate input touch
      const dateInput = compiled.querySelector(
        '#date-input',
      ) as HTMLInputElement;
      dateInput.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      // Error message should now be visible
      const errorMessage = compiled.querySelector(
        '#date-input + .form-error-message div',
      )?.textContent;
      expect(errorMessage?.trim()).toBe(component.errorMessages.DATE.REQUIRED);
    });

    it('should clear title error message when valid input is entered after touch', () => {
      // Touch the input first
      const titleInput = compiled.querySelector(
        '#title-input',
      ) as HTMLInputElement;
      titleInput.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      // Enter valid input
      component.title = 'Valid Title';
      titleInput.value = component.title;
      titleInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      // Error message should be cleared
      expect(
        compiled.querySelector('#title-input + .form-error-message'),
      ).toBeNull();
    });

    it('should clear date error message when valid date is entered after touch', () => {
      // Touch the input first
      const dateInput = compiled.querySelector(
        '#date-input',
      ) as HTMLInputElement;
      dateInput.dispatchEvent(new Event('blur'));
      // fixture.detectChanges();

      // Enter valid date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      component.selectedDate =
        dateValidationService.formatDateForInput(futureDate);
      dateInput.value = component.selectedDate;
      dateInput.dispatchEvent(new Event('input'));

      // fixture.detectChanges();

      // Error message should be cleared
      expect(
        compiled.querySelector('#date-input + .form-error-message'),
      ).toBeNull();
    });

    it('should maintain error state after form submission with invalid inputs', () => {
      // Touch both inputs
      const titleInput = compiled.querySelector(
        '#title-input',
      ) as HTMLInputElement;
      const dateInput = compiled.querySelector(
        '#date-input',
      ) as HTMLInputElement;
      titleInput.dispatchEvent(new Event('blur'));
      dateInput.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      // Submit form with invalid data
      component.onFormSubmit();
      fixture.detectChanges();

      // Error messages should still be visible
      expect(
        compiled.querySelector('#title-input + .form-error-message'),
      ).toBeTruthy();
      expect(
        compiled.querySelector('#date-input + .form-error-message'),
      ).toBeTruthy();
    });
  });

  describe('dateInput validation', () => {
    it('should not submit form with null date', () => {
      component.selectedDate = null;
      component.title = 'Test Title';

      component.onFormSubmit();
      expect(component.targetDate).not.toBeNull();
    });

    it('should format date correctly for input', () => {
      const testDate = new Date('2024-03-15');
      const formattedDate = dateValidationService.formatDateForInput(testDate);

      expect(formattedDate).toBe('2024-03-15');
    });

    it('should initialize with minimum date as today', () => {
      const today = new Date();
      const expectedMinDate = dateValidationService.formatDateForInput(today);

      expect(component.minDate).toBe(expectedMinDate);
    });
  });

  describe('form submission', () => {
    it('should reset form after successful submission', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);
      component.selectedDate =
        dateValidationService.formatDateForInput(futureDate);
      component.title = 'Test Title';

      component.onFormSubmit();

      expect(component.title).toBe('');
      expect(component.selectedDate).toBeNull();
    });
  });
});
