
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

    selects.forEach(select => {
      const sourceValue = select.getAttribute('source');
      if (!sourceValue) return;

      // Find the corresponding collection list with matching source
      const collectionList = document.querySelector(`.w-dyn-list[source="${sourceValue}"]`);
      if (!collectionList) {
        console.warn(`No collection list found for source: ${sourceValue}`);
        return;
      }

      // Get all data elements from the collection list
      const dataElements = collectionList.querySelectorAll('[name][value]');

      // Create options from data elements
      dataElements.forEach(dataElement => {
        const name = dataElement.getAttribute('name');
        const value = dataElement.getAttribute('value');

        if (name && value) {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = name;
          (select as HTMLSelectElement).appendChild(option);
        }
      });

      // Automatically select the first option
      if ((select as HTMLSelectElement).options.length > 0) {
        (select as HTMLSelectElement).selectedIndex = 0;
      }

    });

  }

}
