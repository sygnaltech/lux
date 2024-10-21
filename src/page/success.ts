
/*
 * Page | Success 
 */

import { IRouteHandler } from "@sygnal/sse";
import Cookies from "js-cookie";


export class SuccessPage implements IRouteHandler {

  constructor() {
  }

  setup() {
        
  }

  exec() {

    

    // if (Cookies.get('poac')) {
    //   document.querySelectorAll('[conditional="poac"]').forEach(element => {
    //     (element as HTMLElement).style.setProperty('display', 'block', 'important');
    //   });
    // } 

    // Check for the existence of the 'poac' value in localStorage and update elements accordingly
    if (localStorage.getItem('poac')) {
      document.querySelectorAll('[conditional="poac"]').forEach(element => {
        (element as HTMLElement).style.setProperty('display', 'block', 'important');
      });
    }

    // Create a session cookie named 'poac' with value 'true' using js-cookie
// Cookies.set('poac', 'true');

  }

}

