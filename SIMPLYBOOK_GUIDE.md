# SimplyBook Widget Component Guide

## Overview

The SimplyBook component provides a reusable, type-safe way to integrate SimplyBook.me booking widgets into your application. It handles script loading, widget initialization, and automatic button binding.

## DOM Structure Required

### Basic HTML Structure

```html
<!-- Simple: Just add the attribute to any clickable element -->
<button action-click="book">Book an Appointment</button>

<!-- Works with any element -->
<a href="#" action-click="book">Schedule Now</a>

<!-- Multiple triggers on the same page -->
<div action-click="book" class="booking-card">
  <h3>Click anywhere to book</h3>
</div>

<!-- Even works with Webflow buttons -->
<a class="button w-button" action-click="book">Book Now</a>
```

## Required Attributes

| Attribute | Element | Required | Description |
|-----------|---------|----------|-------------|
| `action-click="book"` | Any clickable element | ✅ Yes | Makes the element trigger the booking popup when clicked. |

That's it! Just one simple attribute.

## Usage in TypeScript/JavaScript

### Import the Component

```typescript
import { Simplybook } from '../components/simplybook';
```

### Initialize in Your Page

```typescript
// In your exec() method:

// Option 1: Minimal initialization (uses defaults)
const booking = new Simplybook({
  url: "https://luxradiology.simplybook.me"
});

// Option 2: With custom theme colors
const booking = new Simplybook({
  url: "https://luxradiology.simplybook.me",
  button_title: "Book Your Scan",
  button_background_color: "#d75481",
  button_text_color: "#ffffff",
  theme_settings: {
    sb_base_color: "#d75481",
    btn_color_1: "#d75481",
    booking_nav_bg_color: "#58b9db"
  }
});

// Option 3: Full customization
const booking = new Simplybook({
  url: "https://yourcompany.simplybook.me",
  widget_type: "button",
  theme: "air",
  timeline: "modern",
  datepicker: "top_calendar",
  button_title: "Schedule Appointment",
  button_background_color: "#d75481",
  button_text_color: "#ffffff",
  button_position: "right",
  button_position_offset: "55%",
  theme_settings: {
    timeline_modern_display: "as_slots",
    timeline_hide_unavailable: "1",
    sb_base_color: "#d75481",
    display_item_mode: "list",
    booking_nav_bg_color: "#58b9db",
    body_bg_color: "#f2f2f2",
    dark_font_color: "#333333",
    light_font_color: "#ffffff",
    btn_color_1: "#d75481",
    hide_img_mode: "1",
    show_sidebar: "1",
    sb_busy: "#b3b3b3",
    sb_available: "#ffdee8"
  },
  app_config: {
    clear_session: 1,
    allow_switch_to_ada: 0,
    predefined: []
  }
});
```

### Configuration Options

#### Required

- **`url`** (string) - Your SimplyBook.me URL (e.g., `"https://yourcompany.simplybook.me"`)

#### Optional Widget Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `widget_type` | string | `"button"` | Widget display type |
| `theme` | string | `"air"` | Theme name |
| `timeline` | string | `"modern"` | Timeline style |
| `datepicker` | string | `"top_calendar"` | Datepicker position |
| `is_rtl` | boolean | `false` | Right-to-left layout |
| `button_title` | string | `"Book now"` | Button text |
| `button_background_color` | string | `"#d75481"` | Button background |
| `button_text_color` | string | `"#ffffff"` | Button text color |
| `button_position` | string | `"right"` | Button position |
| `button_position_offset` | string | `"55%"` | Button vertical offset |
| `container_id` | string | `"sbw_widget"` | Widget container ID |

#### Theme Settings

```typescript
theme_settings: {
  timeline_modern_display: "as_slots",    // or "as_grid"
  timeline_hide_unavailable: "1",         // Hide unavailable slots
  hide_past_days: "0",                    // Show/hide past days
  timeline_show_end_time: "0",            // Show end time
  sb_base_color: "#d75481",               // Base theme color
  display_item_mode: "list",              // or "block"
  booking_nav_bg_color: "#58b9db",        // Navigation background
  body_bg_color: "#f2f2f2",               // Body background
  dark_font_color: "#333333",             // Dark text color
  light_font_color: "#ffffff",            // Light text color
  btn_color_1: "#d75481",                 // Primary button color
  sb_company_label_color: "#ffffff",      // Company label color
  hide_img_mode: "1",                     // Hide images
  show_sidebar: "1",                      // Show sidebar
  sb_busy: "#b3b3b3",                     // Busy slot color
  sb_available: "#ffdee8"                 // Available slot color
}
```

### Public Methods

```typescript
// Programmatically show the booking popup
booking.showBookingPopup();

// Get the underlying widget instance for advanced usage
const widget = booking.getWidget();

// Rebind click events (useful if DOM updates after initialization)
booking.rebindEvents();
```

## Example: Integration in book2.ts

```typescript
import { IRouteHandler } from "@sygnal/sse";
import { Simplybook } from '../components/simplybook';

export class Book2Page implements IRouteHandler {

  constructor() {
  }

  setup() {
  }

  exec() {
    // Your existing code...
    this.setupWhenRadios();
    this.setupAccordion();

    // Initialize SimplyBook widget
    this.setupBookingWidget();
  }

  private setupBookingWidget() {
    new Simplybook({
      url: "https://luxradiology.simplybook.me",
      button_title: "Book Your Scan",
      theme_settings: {
        sb_base_color: "#d75481",
        btn_color_1: "#d75481",
        booking_nav_bg_color: "#58b9db"
      }
    });
  }

  // ... rest of your existing methods
}
```

## Multiple Booking Widgets

You can have multiple booking buttons on the same page - they'll all trigger the same widget:

```html
<!-- Header button -->
<button action-click="book" class="header-book-btn">Book Now</button>

<!-- Hero section button -->
<a action-click="book" class="hero-cta">Schedule Your Scan</a>

<!-- Footer button -->
<div action-click="book" class="footer-book">
  <span>Ready to book?</span>
</div>
```

All will trigger the same booking popup when clicked!

## Advanced: Programmatic Triggering

```typescript
private setupBookingWidget() {
  const booking = new Simplybook({
    url: "https://luxradiology.simplybook.me"
  });

  // Later, trigger programmatically from another event
  document.getElementById('custom-trigger')?.addEventListener('click', () => {
    booking.showBookingPopup();
  });
}
```

## Advanced: Dynamic DOM Updates

If you're adding booking buttons dynamically after page load:

```typescript
const booking = new Simplybook({
  url: "https://luxradiology.simplybook.me"
});

// After adding new buttons to DOM
booking.rebindEvents();
```

## How It Works

1. **Script Loading**: The component automatically loads the SimplyBook.me external script
2. **Singleton Pattern**: Script only loads once, even with multiple instances
3. **Auto-binding**: Automatically finds and binds all `[action-click="book"]` elements
4. **Type Safety**: Full TypeScript support with autocomplete
5. **Async Ready**: Handles script loading asynchronously

## Browser Compatibility

Works in all modern browsers. The component uses:
- Async script loading
- Promise-based initialization
- Standard DOM APIs

## Notes

- **No jQuery dependency** - Pure vanilla JavaScript
- **Lazy loading** - Script only loads when component is initialized
- **Smart caching** - Script loads once and is reused
- **Error handling** - Graceful degradation if script fails to load
- **Multiple instances** - Safe to create multiple Simplybook instances
- **Type-safe** - Full TypeScript interfaces for configuration

## Troubleshooting

### Buttons not working?

Make sure you've added the attribute correctly:
```html
<!-- ✅ Correct -->
<button action-click="book">Book Now</button>

<!-- ❌ Wrong -->
<button data-action="book">Book Now</button>
<button onclick="book">Book Now</button>
```

### Widget not showing?

Check the browser console for errors. Make sure:
1. Your SimplyBook URL is correct
2. The external script loaded successfully
3. Elements with `action-click="book"` exist on the page

### Need to customize after initialization?

Use the public methods:
```typescript
const booking = new Simplybook({ url: "..." });

// Get widget instance for advanced customization
const widget = booking.getWidget();
```
