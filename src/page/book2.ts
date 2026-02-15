
/*
 * Page | Book 2
 */

import { IRouteHandler } from "@sygnal/sse";
import { Accordion } from "../components/accordion";
import { Simplybook } from "../components/simplybook";


export class Book2Page implements IRouteHandler {

  constructor() {
  }

  setup() {

  }

  exec() {

    // Find all select elements with a 'source' attribute
    const selects = document.querySelectorAll('select[source]');

    // Store collection list references for filtering
    const selectData = new Map<HTMLSelectElement, Element>();

    // Initial population of all selects
    selects.forEach(select => {
      const sourceValue = select.getAttribute('source');
      if (!sourceValue) return;

      // Find the corresponding collection list with matching source
      const collectionList = document.querySelector(`.w-dyn-list[source="${sourceValue}"]`);
      if (!collectionList) {
        console.warn(`No collection list found for source: ${sourceValue}`);
        return;
      }

      // Store collection list reference for later filtering
      selectData.set(select as HTMLSelectElement, collectionList);

      // Initial population (only for selects without filter attribute)
      if (!select.hasAttribute('filter')) {
        this.populateSelect(select as HTMLSelectElement, collectionList);
      }
    });

    // Set up filter relationships
    selects.forEach(select => {
      const filterAttr = select.getAttribute('filter');
      if (!filterAttr) return;

      // Find the filter control select by name
      const filterControl = document.querySelector(`select[name="${filterAttr}"]`) as HTMLSelectElement;
      if (!filterControl) {
        console.warn(`Filter control not found: ${filterAttr}`);
        return;
      }

      const collectionList = selectData.get(select as HTMLSelectElement);
      if (!collectionList) return;

      // Add change event listener to filter control
      filterControl.addEventListener('change', () => {
        this.updateFilteredSelect(select as HTMLSelectElement, collectionList, filterControl.value);
      });

      // Initial filter application
      this.updateFilteredSelect(select as HTMLSelectElement, collectionList, filterControl.value);
    });

    // Set up "when" radio buttons
    this.setupWhenRadios();

    // Initialize accordion
    this.setupAccordion();

    // Initialize booking widget
    this.setupBookingWidget();

  }

  private setupAccordion() {
    // Check if accordion exists on the page
    const accordionContainer = document.querySelector('[data-accordion]');
    if (!accordionContainer) {
      return; // No accordion on this page
    }

    // Initialize with custom settings
    new Accordion('[data-accordion]', {
      speed: 300,
      oneOpen: true,
      offsetAnchor: true,
      offsetFromTop: 180,
      scrollTopDelay: 400
    });
  }

  private setupBookingWidget() {
    // Initialize SimplyBook widget
    new Simplybook({
      url: "https://luxradiology.simplybook.me",
      button_title: "Book now",
      button_background_color: "#d75481",
      button_text_color: "#ffffff",
      button_position: "right",
      button_position_offset: "55%",
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
      }
    });
  }

  private setupWhenRadios() {
    // Find all radio buttons with name="when"
    const whenRadios = document.querySelectorAll<HTMLInputElement>('input[type="radio"][name="when"]');

    // Set weekday as default checked
    whenRadios.forEach(radio => {
      if (radio.value === 'weekday') {
        radio.checked = true;
      }
    });

    // Add change event listeners
    whenRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          this.updateWhenSections(radio.value);
        }
      });
    });

    // Initial show/hide based on default selection
    this.updateWhenSections('weekday');
  }

  private updateWhenSections(whenValue: string | null) {
    // Find all sections with show-when attribute
    const sections = document.querySelectorAll('[show-when]');

    sections.forEach(section => {
      const showWhen = section.getAttribute('show-when');

      if (showWhen === whenValue) {
        (section as HTMLElement).style.display = '';
      } else {
        (section as HTMLElement).style.display = 'none';
      }
    });
  }

  private populateSelect(select: HTMLSelectElement, collectionList: Element, filterValue?: string) {
    // Get all data elements from the collection list
    let dataElements = Array.from(collectionList.querySelectorAll('[name][value]'));

    // Apply category filter if provided
    if (filterValue) {
      dataElements = dataElements.filter(el => el.getAttribute('category') === filterValue);
    }

    // Create options from data elements
    dataElements.forEach(dataElement => {
      const name = dataElement.getAttribute('name');
      const value = dataElement.getAttribute('value');

      if (name && value) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = name;
        option.setAttribute('data-dynamic', 'true'); // Mark as dynamically added
        select.appendChild(option);
      }
    });

    // Automatically select the first option
    if (select.options.length > 0) {
      select.selectedIndex = 0;
    }
  }

  private updateFilteredSelect(select: HTMLSelectElement, collectionList: Element, filterValue: string) {
    // Remove previously added dynamic options
    Array.from(select.options).forEach(option => {
      if (option.hasAttribute('data-dynamic')) {
        select.removeChild(option);
      }
    });

    // Repopulate with filtered data
    this.populateSelect(select, collectionList, filterValue);
  }

}
