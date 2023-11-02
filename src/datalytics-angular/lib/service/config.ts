import { Injectable, Provider } from '@angular/core';

export const Configuration = {
    BASE_URL: 'http://localhost',
    api: {
        list: 'datalyticsapi/list',
        add: 'datalyticsapi/list',
        edit: 'datalyticsapi/list',
        view: 'datalyticsapi/list',
        delete: 'datalyticsapi/list',
    }
};

// export class LibConfiguration {
//     config?: Provider;
// }

// @Injectable({ providedIn: 'root' })
// export abstract class LibConfigurationProvider {
//     abstract get config(): Configuration;
// }

// @Injectable({ providedIn: 'root' })
// export class DefaultLibConfiguration implements LibConfigurationProvider {
//     get config(): Configuration {

//         return {
//             BASE_URL: 'localhost',
//             api:
//             {
//                 list: '',
//                 edit: '',
//                 add: '',
//                 view: 'view',
//                 delete: 'view'

//             }
//         };
//     }
// }



// // export const LIB_CONFIG = new InjectionToken<Configuration>('LIB_CONFIG');

// // @Injectable({ providedIn: 'root' })
// // export abstract class LibConfiguration {
// //     abstract get config(): Configuration;
// // }

// // @Injectable({ providedIn: 'root' })
// // export class DefaultLibConfiguration extends LibConfiguration {
// //     get config(): Configuration {
// //         // return default config
// //         return { name: `Fallback` };
// //     }


// // }

// // export class DLibConfiguration {
// //     config?: Provider;
// // }
