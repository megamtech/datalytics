import { Directive, ElementRef, InjectionToken, } from '@angular/core';


/**
 * Injection token that can be used to reference instances of `KtdGridResizeHandle`. It serves as
 * alternative token to the actual `KtdGridResizeHandle` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
// export const DATALYTICS_GRID_RESIZE_HANDLE = new InjectionToken<DatalyticsGridResizeHandle>('DatalyticsGridResizeHandle');

/** Handle that can be used to drag a KtdGridItem instance. */
@Directive({
    selector: '[datalyticsGridResizeHandle]',
    host: {
        class: 'datalytics-grid-resize-handle'
    },
    // providers: [{provide: DATALYTICS_GRID_RESIZE_HANDLE, useExisting: DatalyticsGridResizeHandle}],
})
export class DatalyticsGridResizeHandle {

    constructor(
        public element: ElementRef<HTMLElement>) {
    }
}
