/*
 * Sygnal
 * Route Dispatcher
 * 
 */

import { IRouteHandler } from "./IRouteHandler";
import { Site } from "./site";

type RouteHandler = () => void;
type RouteHandlerClass = { new (): IRouteHandler };

export interface Routes {
    [path: string]: RouteHandlerClass;
}

// Example routes
const routes: Routes = {
    // '/': ,
    // '/about': () => {
    //     console.log('This is the about page.');
    // },
    // '/contact/*': () => {
    //     console.log('This is the contact page.');
    // },
};
// const routes: Routes = {
//     '/': () => {
//         console.log('This is the homepage.');
//     },
//     '/about': () => {
//         console.log('This is the about page.');
//     },
//     '/contact/*': () => {
//         console.log('This is the contact page.');
//     },
// };

export class RouteDispatcher {

    routes: Routes;

    constructor() {
//        this.routes = {};
    }

    matchRoute(path: string): RouteHandlerClass | null {
        for (const route in this.routes) {
            if (route.endsWith('*')) {
                // If the route ends with *, treat it as a wildcard
                const baseRoute = route.slice(0, -1); // Remove the * from the end
                if (path.startsWith(baseRoute)) {
                    return this.routes[route];
                }
            } else if (route === path) {
                // Exact match
                return this.routes[route];
            }
        }
        return null; // No matching route found
    }
    
    setupRoute() {

        // Pre-init site-level
        (new Site().setup());

        // Pre-init route-level
        const path = window.location.pathname;
        const HandlerClass = this.matchRoute(path);
        if (HandlerClass) {
            const handlerInstance = new HandlerClass();
            handlerInstance.setup(); 
        } else {
//            console.log('No specific function for this path.');
        }
    }

    execRoute() {

        // Init site-level
        (new Site().exec());

        // Init route-level
        const path = window.location.pathname;
        const HandlerClass = this.matchRoute(path);
        if (HandlerClass) {
            const handlerInstance = new HandlerClass();
            handlerInstance.exec(); 
        } else {
//            console.log('No specific function for this path.');
        }
    }
    
}