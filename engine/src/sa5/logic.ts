/*
 * SA5 Sygnal
 * Logic
 * 
 */

import { Debug } from "@sygnal/sse";





export class SA5Logic {

    constructor() {
    }

    init() {

        var elements: NodeListOf<HTMLElement>;
        
        elements= document.querySelectorAll<HTMLElement>('[wfu-logic-if]');
        elements.forEach(element => {
            (new SA5LogicIf(element)).init(); 
        });

        elements = document.querySelectorAll<HTMLElement>('[wfu-logic-switch]');
        elements.forEach(element => {
            (new SA5LogicSwitch(element)).init(); 
        });

    }
    
}

export class SA5LogicIf {

    _elem: HTMLElement;
    _data: any = {}; 
    debug: Debug;

    constructor(elem: HTMLElement) {
        this._elem = elem; 
        this.debug = new Debug("SA5 Logic"); 
    }

    init() {

        console.log("SA5 logic IF ")
        // Construct data from custom attributes
        const dataAttributes = this._elem.attributes;
        for (let i = 0; i < dataAttributes.length; i++) {
            const attr = dataAttributes[i];
            const attrName = attr.name.toLowerCase();
            if (attrName.startsWith('wfu-logic-param-')) {
                const key = attrName.slice('wfu-logic-param-'.length);
                this._data[key] = attr.value !== '' ? attr.value : null;
            }
        }

console.log()      

        const descendants: NodeListOf<HTMLElement> = this._elem.querySelectorAll<HTMLElement>('[wfu-logic-if-display]');

        descendants.forEach(descendant => {
          const condition: string = descendant.getAttribute('wfu-logic-if-display') as string;
          const shouldDisplay = this.evaluateCondition(condition, this._data);

          if (shouldDisplay) {
            descendant.style.display = '';
          } else {
            descendant.style.display = 'none';
          }
        });

        // Processing complete, make the element visible
        this._elem.removeAttribute("wfu-preload");

    }
    
    evaluateCondition(condition: string, context: any): boolean {
        try {
          return new Function('with(this) { return ' + condition + '; }').call(context);
        } catch (e) {
          console.error('Error evaluating condition:', condition, e);
          return false;
        }
    }

}



export class SA5LogicSwitch {

    _elem: HTMLElement;
    debug: Debug; 
    _val: string;

    constructor(elem: HTMLElement) {
        this._elem = elem; 
        this.debug = new Debug("SA5 Logic"); 
        this._val = elem.getAttribute('wfu-logic-switch') as string; 
    }

    init() {

        console.log("SA5 logic SWITCH ")
        // Construct data from custom attributes


console.log()      

        const descendants: NodeListOf<HTMLElement> = this._elem.querySelectorAll<HTMLElement>('[wfu-logic-switch-case]');

        descendants.forEach(descendant => {
          const condition: string = descendant.getAttribute('wfu-logic-switch-case') as string;
          const shouldDisplay = this.evaluateCondition(condition, this._val);

          if (shouldDisplay) {
            descendant.style.display = '';
          } else {
            descendant.style.display = 'none';
          }
        });

        // Processing complete, make the element visible
        this._elem.removeAttribute("wfu-preload");

    }
    
    evaluateCondition(condition: string, context: any): boolean {
        try {
          return condition == context; // new Function('with(this) { return ' + condition + '; }').call(context);
        } catch (e) {
          console.error('Error evaluating condition:', condition, e);
          return false;
        }
    }

}