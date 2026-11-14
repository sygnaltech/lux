/**
 * Accordion Component
 *
 * A reusable accordion component that supports:
 * - Single or multiple open items
 * - Smooth animations
 * - Auto-scroll to active items
 * - Customizable settings via attributes or constructor
 */

export interface AccordionSettings {
  speed?: number;              // Animation speed in ms (default: 300)
  oneOpen?: boolean;           // Only one item open at a time (default: true)
  offsetAnchor?: boolean;      // Scroll to active item (default: true)
  offsetFromTop?: number;      // Scroll offset in pixels (default: 180)
  scrollTopDelay?: number;     // Delay before scroll in ms (default: 400)
}

export class Accordion {
  private container: HTMLElement;
  private settings: Required<AccordionSettings>;
  private items: NodeListOf<Element>;

  // Default settings
  private static readonly DEFAULT_SETTINGS: Required<AccordionSettings> = {
    speed: 300,
    oneOpen: true,
    offsetAnchor: true,
    offsetFromTop: 180,
    scrollTopDelay: 400
  };

  constructor(container: HTMLElement | string, userSettings?: AccordionSettings) {
    // Get container element
    if (typeof container === 'string') {
      const el = document.querySelector(container);
      if (!el) {
        throw new Error(`Accordion container not found: ${container}`);
      }
      this.container = el as HTMLElement;
    } else {
      this.container = container;
    }

    // Merge settings
    this.settings = { ...Accordion.DEFAULT_SETTINGS, ...userSettings };

    // Get all accordion items
    this.items = this.container.querySelectorAll('[data-accordion-item]');

    if (this.items.length === 0) {
      console.warn('No accordion items found in container:', this.container);
      return;
    }

    this.init();
  }

  private init(): void {
    // Ensure only one item is active if oneOpen is true
    if (this.settings.oneOpen) {
      const activeItems = this.container.querySelectorAll('[data-accordion-item].active');
      activeItems.forEach((item, index) => {
        if (index > 0) {
          item.classList.remove('active');
          const icon = item.querySelector('[data-accordion-icon]');
          if (icon) icon.classList.remove('active');
        }
      });
    }

    // Show active accordion bodies
    this.items.forEach(item => {
      const body = item.querySelector('[data-accordion-body]') as HTMLElement;
      if (!body) return;

      if (item.classList.contains('active')) {
        body.style.display = 'block';
      } else {
        body.style.display = 'none';
      }
    });

    // Attach click handlers to all headers
    this.items.forEach(item => {
      const header = item.querySelector('[data-accordion-header]') as HTMLElement;
      if (!header) return;

      header.addEventListener('click', () => {
        this.toggle(item);

        // Auto-scroll to active item
        if (this.settings.offsetAnchor) {
          setTimeout(() => {
            const rect = header.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPosition = rect.top + scrollTop - this.settings.offsetFromTop;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }, this.settings.scrollTopDelay);
        }
      });
    });
  }

  private toggle(item: Element): void {
    const body = item.querySelector('[data-accordion-body]') as HTMLElement;
    const icon = item.querySelector('[data-accordion-icon]');

    if (!body) return;

    const isActive = item.classList.contains('active');

    // Close all other items if oneOpen is true
    if (this.settings.oneOpen && !isActive) {
      this.items.forEach(otherItem => {
        if (otherItem !== item) {
          const otherBody = otherItem.querySelector('[data-accordion-body]') as HTMLElement;
          const otherIcon = otherItem.querySelector('[data-accordion-icon]');

          otherItem.classList.remove('active');
          if (otherIcon) otherIcon.classList.remove('active');

          if (otherBody) {
            this.slideUp(otherBody, this.settings.speed);
          }
        }
      });
    }

    // Toggle current item
    item.classList.toggle('active');
    if (icon) icon.classList.toggle('active');

    if (isActive) {
      this.slideUp(body, this.settings.speed);
    } else {
      this.slideDown(body, this.settings.speed);
    }
  }

  private slideDown(element: HTMLElement, duration: number): void {
    element.style.removeProperty('display');
    let display = window.getComputedStyle(element).display;
    if (display === 'none') display = 'block';
    element.style.display = display;

    const height = element.scrollHeight;
    element.style.overflow = 'hidden';
    element.style.height = '0';
    element.style.paddingTop = '0';
    element.style.paddingBottom = '0';
    element.style.marginTop = '0';
    element.style.marginBottom = '0';
    element.offsetHeight; // Force reflow

    element.style.transitionProperty = 'height, margin, padding';
    element.style.transitionDuration = `${duration}ms`;
    element.style.height = `${height}px`;
    element.style.removeProperty('padding-top');
    element.style.removeProperty('padding-bottom');
    element.style.removeProperty('margin-top');
    element.style.removeProperty('margin-bottom');

    setTimeout(() => {
      element.style.removeProperty('height');
      element.style.removeProperty('overflow');
      element.style.removeProperty('transition-property');
      element.style.removeProperty('transition-duration');
    }, duration);
  }

  private slideUp(element: HTMLElement, duration: number): void {
    element.style.transitionProperty = 'height, margin, padding';
    element.style.transitionDuration = `${duration}ms`;
    element.style.height = `${element.scrollHeight}px`;
    element.offsetHeight; // Force reflow

    element.style.overflow = 'hidden';
    element.style.height = '0';
    element.style.paddingTop = '0';
    element.style.paddingBottom = '0';
    element.style.marginTop = '0';
    element.style.marginBottom = '0';

    setTimeout(() => {
      element.style.display = 'none';
      element.style.removeProperty('height');
      element.style.removeProperty('padding-top');
      element.style.removeProperty('padding-bottom');
      element.style.removeProperty('margin-top');
      element.style.removeProperty('margin-bottom');
      element.style.removeProperty('overflow');
      element.style.removeProperty('transition-property');
      element.style.removeProperty('transition-duration');
    }, duration);
  }

  /**
   * Programmatically open a specific accordion item by index
   */
  public open(index: number): void {
    const item = this.items[index];
    if (item && !item.classList.contains('active')) {
      this.toggle(item);
    }
  }

  /**
   * Programmatically close a specific accordion item by index
   */
  public close(index: number): void {
    const item = this.items[index];
    if (item && item.classList.contains('active')) {
      this.toggle(item);
    }
  }

  /**
   * Destroy the accordion and remove all event listeners
   */
  public destroy(): void {
    this.items.forEach(item => {
      const header = item.querySelector('[data-accordion-header]') as HTMLElement;
      if (header) {
        header.replaceWith(header.cloneNode(true));
      }
    });
  }
}
