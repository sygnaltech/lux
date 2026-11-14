# Accordion Component Guide

## DOM Structure Required

### Basic HTML Structure

```html
<!-- Accordion Container -->
<div data-accordion>

  <!-- Accordion Item 1 -->
  <div data-accordion-item class="active">
    <!-- Header (clickable trigger) -->
    <div data-accordion-header>
      <h3>Question 1: What services do you offer?</h3>
      <!-- Optional icon that rotates on active -->
      <span data-accordion-icon>▼</span>
    </div>

    <!-- Body (content that expands/collapses) -->
    <div data-accordion-body>
      <p>We offer comprehensive maternity care including...</p>
    </div>
  </div>

  <!-- Accordion Item 2 -->
  <div data-accordion-item>
    <div data-accordion-header>
      <h3>Question 2: What are your hours?</h3>
      <span data-accordion-icon>▼</span>
    </div>
    <div data-accordion-body>
      <p>We are open Monday through Friday...</p>
    </div>
  </div>

  <!-- More items... -->
</div>
```

## Required Attributes

| Attribute | Element | Required | Description |
|-----------|---------|----------|-------------|
| `data-accordion` | Container | ✅ Yes | Main accordion wrapper. Can have multiple on same page. |
| `data-accordion-item` | Item wrapper | ✅ Yes | Wraps each accordion item (header + body). |
| `data-accordion-header` | Header | ✅ Yes | Clickable trigger element. |
| `data-accordion-body` | Body | ✅ Yes | Content that expands/collapses. |
| `data-accordion-icon` | Icon | ❌ Optional | Element that gets 'active' class when open (for rotation). |
| `class="active"` | Item | ❌ Optional | Add to `data-accordion-item` to make it open by default. |

## Usage in TypeScript/JavaScript

### Import the Component

```typescript
import { Accordion } from '../components/accordion';
```

### Initialize in Your Page

```typescript
// In your exec() method:

// Option 1: Simple initialization with defaults
const accordion = new Accordion('[data-accordion]');

// Option 2: Custom settings
const accordion = new Accordion('[data-accordion]', {
  speed: 400,              // Animation speed (default: 300ms)
  oneOpen: true,           // Only one item open at a time (default: true)
  offsetAnchor: true,      // Auto-scroll to active item (default: true)
  offsetFromTop: 120,      // Scroll offset in pixels (default: 180)
  scrollTopDelay: 300      // Delay before scroll (default: 400ms)
});

// Option 3: Multiple accordions on same page
const faqAccordion = new Accordion('#faq-accordion', { oneOpen: true });
const servicesAccordion = new Accordion('#services-accordion', { oneOpen: false });
```

### Public Methods

```typescript
// Programmatically open item by index (0-based)
accordion.open(0);

// Programmatically close item by index
accordion.close(2);

// Destroy and clean up event listeners
accordion.destroy();
```

## CSS Styling

The component manages the slide animations via JavaScript, but you'll want to add your own styling:

```css
/* Basic accordion styling */
[data-accordion-item] {
  border-bottom: 1px solid #e0e0e0;
}

[data-accordion-header] {
  padding: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

[data-accordion-header]:hover {
  background-color: #f5f5f5;
}

[data-accordion-body] {
  padding: 0 1rem;
  display: none; /* Hidden by default, component handles display */
}

/* Active state */
[data-accordion-item].active [data-accordion-header] {
  background-color: #f0f0f0;
}

/* Rotate icon when active */
[data-accordion-icon] {
  transition: transform 0.3s ease;
}

[data-accordion-icon].active {
  transform: rotate(180deg);
}
```

## Example: Integration in book2.ts

```typescript
import { IRouteHandler } from "@sygnal/sse";
import { Accordion } from '../components/accordion';

export class Book2Page implements IRouteHandler {

  constructor() {
  }

  setup() {
  }

  exec() {
    // Your existing code...
    this.setupWhenRadios();

    // Initialize accordion
    this.setupAccordion();
  }

  private setupAccordion() {
    // Initialize with custom settings
    const accordion = new Accordion('[data-accordion]', {
      speed: 300,
      oneOpen: true,
      offsetAnchor: true,
      offsetFromTop: 180
    });
  }

  // ... rest of your existing methods
}
```

## Multiple Accordions

You can have multiple independent accordions on the same page:

```html
<!-- FAQ Accordion -->
<div data-accordion id="faq-accordion">
  <div data-accordion-item>...</div>
  <div data-accordion-item>...</div>
</div>

<!-- Services Accordion -->
<div data-accordion id="services-accordion">
  <div data-accordion-item>...</div>
  <div data-accordion-item>...</div>
</div>
```

```typescript
// Initialize each separately
new Accordion('#faq-accordion', { oneOpen: true });
new Accordion('#services-accordion', { oneOpen: false }); // Allow multiple open
```

## Notes

- **No jQuery dependency** - Pure vanilla JavaScript
- **TypeScript type-safe** - Full type checking and IntelliSense
- **Smooth animations** - CSS transitions for height, padding, and margins
- **Accessible** - Add ARIA attributes in your HTML for full accessibility
- **Lightweight** - No external dependencies
- **Reusable** - Use across any page in your application
