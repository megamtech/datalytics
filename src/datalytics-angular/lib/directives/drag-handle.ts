import { Directive, ElementRef, InjectionToken } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `KtdGridDragHandle`. It serves as
 * alternative token to the actual `KtdGridDragHandle` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
// export const DATALYTICS_GRID_DRAG_HANDLE = new InjectionToken<DatalyticsGridDragHandle>('DatalyticsGridDragHandle');

/** Handle that can be used to drag a KtdGridItem instance. */
@Directive({
    selector: '[datalyticsGridDragHandle]',
    host: {
        class: 'datalytics-grid-drag-handle'
    },
    // providers: [{provide: DATALYTICS_GRID_DRAG_HANDLE, useExisting: DatalyticsGridDragHandle}],
})
// tslint:disable-next-line:directive-class-suffix
export class DatalyticsGridDragHandle {
    constructor(
        public element: ElementRef<HTMLElement>) {
    }
}