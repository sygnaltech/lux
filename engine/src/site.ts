
/*
 * Site
 */

import { IRouteHandler, Page } from "@sygnal/sse";
import posthog from 'posthog-js'
import { initDateFields } from './components/date-field';
// import { loadEngineCSS } from "./engine/core";

// import gsap from 'gsap'; 
 

export class Site implements IRouteHandler {

  constructor() {
  }

  setup() {

    Page.loadEngineCSS("site.css"); 
   
    posthog.init('phc_XNXwsF5o7snDKAZVngbWLupKigbqv16MBNOC8UoWKE', { api_host: 'https://us.i.posthog.com', person_profiles: 'identified_only' })

  }

  exec() {

    this.monitorPosthogClickEvents();
    initDateFields();
    this.initFillFields();

  }

  initFillFields() {

    document.querySelectorAll<HTMLElement>('[source]').forEach((source) => {
      source.addEventListener('change', () => {
        const key = source.getAttribute('source');
        const el = source as HTMLSelectElement;
        const value = el.selectedOptions?.[0]?.text ?? el.value;
        document.querySelectorAll<HTMLInputElement>(`[data-fill-field="${key}"]`).forEach((target) => {
          target.value = value;
        });
      });
    });

  }

  monitorPosthogClickEvents() {

      // Find all elements with the 'ph-event' custom attribute
      const elements = document.querySelectorAll('[ph-event]');

      // Iterate through the elements and install a click event handler
      elements.forEach((element) => {
          const eventName = element.getAttribute('ph-event'); // Get the event name from the attribute
          if (eventName) {
              element.addEventListener('click', () => {
                  // Fire a PostHog event when the element is clicked
                  posthog.capture(eventName, {});
                  console.log(`PostHog event '${eventName}' fired!`);
              });
          }
      });

  }


}

