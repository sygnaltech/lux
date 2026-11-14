/*
 * SITE
 * Main entry point
 * 
 * https://engine.sygnal.com/
 * 
 * ENGINE MODE
 * ?engine.mode=dev
 * ?engine.mode=prod
 * 
 */

import { MaternityScanCalcPage } from "./page/maternityScanCalc";
import { HomePage } from "./page/home";
import { RouteDispatcher } from "@sygnal/sse";
import { TestWfuIfPage } from "./page/test-wfu-if";
import { Site } from "./site";
import { ServicesPage } from "./page/services";
import { PoacPage } from "./page/poac";
import { SuccessPage } from "./page/success";
import { Book2Page } from "./page/book2";

export const routeDispatcher = (): RouteDispatcher => {
    
    var routeDispatcher = new RouteDispatcher(Site);
    routeDispatcher.routes = {

        // Site paes
        '/': HomePage,
        '/scan': MaternityScanCalcPage,
        '/poac': PoacPage,
        '/book': Book2Page,
        '/book-2': Book2Page,
        '/book/success': SuccessPage,
        '/services/*': ServicesPage,

        // TEST Pages
        '/test/wfu-if': TestWfuIfPage,

    };
//    routeDispatcher.execRoute(); 

    return routeDispatcher;
}

