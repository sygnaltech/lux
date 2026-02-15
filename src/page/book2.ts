
/*
 * Page | Book 2
 */

import { IRouteHandler } from "@sygnal/sse";


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
