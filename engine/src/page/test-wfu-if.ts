
/*
 * Page | TEST | wfu-if
 */

import { IRouteHandler } from "@sygnal/sse";
import { SA5Logic } from "../sa5/logic";

// import gsap from 'gsap'; 
 

export class TestWfuIfPage implements IRouteHandler {

//  modelDropdown: WebflowDropdown; 

  constructor() {
  }

  setup() {
        
  }

  exec() {

    console.log("Test Wfu If."); 

    (new SA5Logic()).init(); 

    // const elements: NodeListOf<Element> = document.querySelectorAll(`.${item.className}`);
    // console.log("Making elements visible", elements);
    // gsap.to(elements, { display: 'block' });

  }

}
