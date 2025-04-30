import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

/**
 * Font size options for the scalable font directive
 */
export type FontSizeOption = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Letter spacing options for the scalable font directive
 */
export type LetterSpacingOption = 'sm' | 'md' | 'base';

/**
 * A directive that applies responsive font sizing and letter spacing to elements.
 * Uses CSS clamp() for fluid typography that scales with viewport width.
 *
 * @example
 * ```html
 * <h1 appScalableFont='lg' letterSpacing='md'>Responsive Heading</h1>
 * ```
 */
@Directive({
  selector: '[appScalableFont]',
  standalone: true,
})
export class ScalableFontDirective implements OnChanges {
  /**
   * The size variant to apply to the font
   * @default 'md'
   */
  @Input() appScalableFont: FontSizeOption = 'md';

  /**
   * The letter spacing variant to apply
   * @default 'base'
   */
  @Input() letterSpacing: LetterSpacingOption | string = 'base';

  /**
   * Predefined font sizes using CSS clamp() for responsive scaling
   */
  private readonly fontSizes: Record<FontSizeOption, string> = {
    sm: 'clamp(0.8rem, 3vw, 2rem)',
    md: 'clamp(1rem, 5vw, 3rem)',
    lg: 'clamp(1.25rem, 7.25vw, 9.5rem)',
    xl: 'clamp(1.5rem, 8vw, 12rem)',
  };

  /**
   * Predefined letter spacing values
   */
  private readonly defaultLetterSpacing: Record<LetterSpacingOption, string> = {
    base: '0',
    sm: '-0.025rem',
    md: '-0.05rem',
  };

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  /**
   * Updates the element's styles when inputs change
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appScalableFont'] || changes['letterSpacing']) {
      this.updateStyles();
    }
  }

  /**
   * Applies the current font size and letter spacing to the element
   */
  private updateStyles(): void {
    const element = this.elementRef.nativeElement;

    try {
      // Apply font size
      element.style.fontSize = this.fontSizes[this.appScalableFont];

      // Apply letter spacing
      element.style.letterSpacing = this.getLetterSpacingValue();
    } catch (error) {
      console.error('Error applying scalable font styles:', error);
    }
  }

  /**
   * Gets the appropriate letter spacing value based on the input
   * @returns The letter spacing value to apply
   */
  private getLetterSpacingValue(): string {
    if (
      typeof this.letterSpacing === 'string' &&
      this.letterSpacing in this.defaultLetterSpacing
    ) {
      return this.defaultLetterSpacing[
        this.letterSpacing as LetterSpacingOption
      ];
    }
    return this.letterSpacing;
  }
}
