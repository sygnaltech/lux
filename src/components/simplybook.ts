/**
 * SimplyBook Widget Component
 *
 * A reusable component for integrating SimplyBook.me booking widget.
 * Features:
 * - Lazy loads external SimplyBook script
 * - Configurable widget settings
 * - Automatic button click binding
 * - Type-safe configuration
 */

export interface SimplybookThemeSettings {
  timeline_modern_display?: string;
  timeline_hide_unavailable?: string;
  hide_past_days?: string;
  timeline_show_end_time?: string;
  sb_base_color?: string;
  display_item_mode?: string;
  booking_nav_bg_color?: string;
  body_bg_color?: string;
  sb_review_image?: string;
  dark_font_color?: string;
  light_font_color?: string;
  btn_color_1?: string;
  sb_company_label_color?: string;
  hide_img_mode?: string;
  show_sidebar?: string;
  sb_busy?: string;
  sb_available?: string;
}

export interface SimplybookPredefined {
  category?: string;    // Integer ID as string
  service?: string;     // Integer ID as string
  provider?: string;    // Integer ID as string
}

export interface SimplybookAppConfig {
  clear_session?: number;
  allow_switch_to_ada?: number;
  predefined?: SimplybookPredefined | any[];  // Object or array (for backwards compatibility)
}

export interface SimplybookConfig {
  url: string;                              // Required: Your SimplyBook URL
  widget_type?: string;
  theme?: string;
  theme_settings?: SimplybookThemeSettings;
  timeline?: string;
  datepicker?: string;
  is_rtl?: boolean;
  app_config?: SimplybookAppConfig;
  button_title?: string;
  button_background_color?: string;
  button_text_color?: string;
  button_position?: string;
  button_position_offset?: string;
  container_id?: string;

  // Dynamic parameter support
  category?: string;                        // Optional: Default category ID
  service?: string;                         // Optional: Default service ID
  provider?: string;                        // Optional: Default provider ID
  getParameters?: () => SimplybookPredefined; // Optional: Callback to get dynamic parameters
}

// Extend Window interface for SimplybookWidget
declare global {
  interface Window {
    SimplybookWidget: any;
  }
}

export class Simplybook {
  private baseConfig: SimplybookConfig;
  private currentWidget: any = null;
  private lastParameters: SimplybookPredefined = {};
  private static scriptLoaded: boolean = false;
  private static scriptLoading: boolean = false;
  private static loadCallbacks: Array<() => void> = [];

  private static readonly SCRIPT_URL = "//widget.simplybook.me/v2/widget/widget.js";

  private static readonly DEFAULT_CONFIG: Partial<SimplybookConfig> = {
    widget_type: "button",
    theme: "air",
    timeline: "modern",
    datepicker: "top_calendar",
    is_rtl: false,
    button_title: "Book now",
    button_background_color: "#d75481",
    button_text_color: "#ffffff",
    button_position: "right",
    button_position_offset: "55%",
    container_id: "sbw_widget",
    theme_settings: {
      timeline_modern_display: "as_slots",
      timeline_hide_unavailable: "1",
      hide_past_days: "0",
      timeline_show_end_time: "0",
      sb_base_color: "#d75481",
      display_item_mode: "list",
      booking_nav_bg_color: "#58b9db",
      body_bg_color: "#f2f2f2",
      dark_font_color: "#333333",
      light_font_color: "#ffffff",
      btn_color_1: "#d75481",
      sb_company_label_color: "#ffffff",
      hide_img_mode: "1",
      show_sidebar: "1",
      sb_busy: "#b3b3b3",
      sb_available: "#ffdee8"
    },
    app_config: {
      clear_session: 1,
      allow_switch_to_ada: 0,
      predefined: {}
    }
  };

  constructor(userConfig: SimplybookConfig) {
    if (!userConfig.url) {
      throw new Error('SimplyBook: url is required in configuration');
    }

    // Merge user config with defaults (store as base config)
    this.baseConfig = {
      ...Simplybook.DEFAULT_CONFIG,
      ...userConfig,
      theme_settings: {
        ...Simplybook.DEFAULT_CONFIG.theme_settings,
        ...userConfig.theme_settings
      },
      app_config: {
        ...Simplybook.DEFAULT_CONFIG.app_config,
        ...userConfig.app_config
      }
    } as SimplybookConfig;

    this.init();
  }

  private async init(): Promise<void> {
    try {
      await this.loadScript();
      // Don't create widget here - wait until first click
      this.bindClickEvents();
    } catch (error) {
      console.error('SimplyBook initialization failed:', error);
    }
  }

  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // If script is already loaded, resolve immediately
      if (Simplybook.scriptLoaded) {
        resolve();
        return;
      }

      // If script is currently loading, add to callback queue
      if (Simplybook.scriptLoading) {
        Simplybook.loadCallbacks.push(() => resolve());
        return;
      }

      // Start loading the script
      Simplybook.scriptLoading = true;

      const script = document.createElement('script');
      script.async = true;
      script.src = Simplybook.SCRIPT_URL;

      script.onload = () => {
        Simplybook.scriptLoaded = true;
        Simplybook.scriptLoading = false;

        // Resolve this promise
        resolve();

        // Execute all queued callbacks
        Simplybook.loadCallbacks.forEach(callback => callback());
        Simplybook.loadCallbacks = [];
      };

      script.onerror = () => {
        Simplybook.scriptLoading = false;
        reject(new Error('Failed to load SimplyBook script'));
      };

      document.head.appendChild(script);
    });
  }

  private createWidget(parameters?: SimplybookPredefined): void {
    if (!window.SimplybookWidget) {
      console.error('SimplybookWidget is not available');
      return;
    }

    try {
      // Build widget config with parameters
      const widgetConfig = { ...this.baseConfig };

      // Merge predefined parameters
      if (parameters && (parameters.category || parameters.service || parameters.provider)) {
        const predefined: SimplybookPredefined = {};
        if (parameters.category) predefined.category = parameters.category;
        if (parameters.service) predefined.service = parameters.service;
        if (parameters.provider) predefined.provider = parameters.provider;

        widgetConfig.app_config = {
          ...widgetConfig.app_config,
          predefined
        };

        // Store last parameters for comparison
        this.lastParameters = predefined;
      }

      // Create new widget instance
      this.currentWidget = new window.SimplybookWidget(widgetConfig);
    } catch (error) {
      console.error('Failed to create SimplyBook widget:', error);
    }
  }

  /**
   * Extract booking parameters from element data attributes and config callback
   */
  private extractParameters(element: Element): SimplybookPredefined {
    const params: SimplybookPredefined = {};

    // Priority 1: Button data attributes
    const category = element.getAttribute('data-category');
    const service = element.getAttribute('data-service');
    const provider = element.getAttribute('data-provider');

    if (category) params.category = category;
    if (service) params.service = service;
    if (provider) params.provider = provider;

    // Priority 2: Callback function (if no button attributes)
    if (!params.category && !params.service && !params.provider && this.baseConfig.getParameters) {
      const callbackParams = this.baseConfig.getParameters();
      if (callbackParams.category) params.category = callbackParams.category;
      if (callbackParams.service) params.service = callbackParams.service;
      if (callbackParams.provider) params.provider = callbackParams.provider;
    }

    // Priority 3: Component defaults (if still no params)
    if (!params.category && this.baseConfig.category) params.category = this.baseConfig.category;
    if (!params.service && this.baseConfig.service) params.service = this.baseConfig.service;
    if (!params.provider && this.baseConfig.provider) params.provider = this.baseConfig.provider;

    return params;
  }

  private bindClickEvents(): void {
    // Find all elements with action-click="book" attribute
    const bookButtons = document.querySelectorAll('[action-click="book"]');

    if (bookButtons.length === 0) {
      console.warn('No elements found with action-click="book" attribute');
      return;
    }

    bookButtons.forEach(element => {
      element.addEventListener('click', (e) => {
        e.preventDefault();

        // Extract current parameters
        const params = this.extractParameters(element);

        // Recreate widget with current parameters
        this.createWidget(params);

        // Show popup
        this.showBookingPopup();
      });
    });

    console.log(`SimplyBook: Bound ${bookButtons.length} booking button(s)`);
  }

  /**
   * Programmatically show the booking popup
   */
  public showBookingPopup(): void {
    if (this.currentWidget && typeof this.currentWidget.showPopupFrame === 'function') {
      this.currentWidget.showPopupFrame('book');
    } else {
      console.error('Widget not initialized or showPopupFrame method not available');
    }
  }

  /**
   * Get the widget instance for advanced usage
   */
  public getWidget(): any {
    return this.currentWidget;
  }

  /**
   * Rebind click events (useful if DOM changes after initialization)
   */
  public rebindEvents(): void {
    this.bindClickEvents();
  }
}
