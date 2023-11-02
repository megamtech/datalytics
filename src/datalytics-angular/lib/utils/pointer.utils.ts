import { fromEvent, iif, merge, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { datalyticsNormalizePassiveListenerOptions } from './passive-listeners';

/** Options that can be used to bind a passive event listener. */
const passiveEventListenerOptions = datalyticsNormalizePassiveListenerOptions({passive: true});

/** Options that can be used to bind an active event listener. */
const activeEventListenerOptions = datalyticsNormalizePassiveListenerOptions({passive: false});

let isMobile: boolean | null = null;

export function datalyticsIsMobileOrTablet(): boolean {

    if (isMobile != null) {
        return isMobile;
    }

    // Generic match pattern to identify mobile or tablet devices
    const isMobileDevice = /Android|webOS|BlackBerry|Windows Phone|iPad|iPhone|iPod/i.test(navigator.userAgent);

    // tslint:disable-next-line:max-line-length
    // Since IOS 13 is not safe to just check for the generic solution. See: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
    // tslint:disable-next-line:max-line-length
    const isIOSMobileDevice = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    isMobile = isMobileDevice || isIOSMobileDevice;

    return isMobile;
}

export function datalyticsIsMouseEvent(event: any): event is MouseEvent {
    return (event as MouseEvent).clientX != null;
}

export function datalyticsIsTouchEvent(event: any): event is TouchEvent {
    return (event as TouchEvent).touches != null && (event as TouchEvent).touches.length != null;
}

export function datalyticsPointerClientX(event: MouseEvent | TouchEvent): number {
    return datalyticsIsMouseEvent(event) ? event.clientX : event.touches[0].clientX;
}

export function datalyticsPointerClientY(event: MouseEvent | TouchEvent): number {
    return datalyticsIsMouseEvent(event) ? event.clientY : event.touches[0].clientY;
}

export function datalyticsPointerClient(event: MouseEvent | TouchEvent): {clientX: number, clientY: number} {
    return  {
        clientX: datalyticsIsMouseEvent(event) ? event.clientX : event.touches[0].clientX,
        clientY: datalyticsIsMouseEvent(event) ? event.clientY : event.touches[0].clientY
    };
}

/**
 * Emits when a mousedown or touchstart emits. Avoids conflicts between both events.
 * @param element, html element where to  listen the events.
 * @param touchNumber number of the touch to track the event, default to the first one.
 */
export function datalyticsMouseOrTouchDown(element, touchNumber = 1): Observable<MouseEvent | TouchEvent> {
    return iif(
        () => datalyticsIsMobileOrTablet(),
        fromEvent<TouchEvent>(element, 'touchstart', passiveEventListenerOptions as AddEventListenerOptions).pipe(
            filter((touchEvent) => touchEvent.touches.length === touchNumber)
        ),
        fromEvent<MouseEvent>(element, 'mousedown', activeEventListenerOptions as AddEventListenerOptions).pipe(
            filter((mouseEvent: MouseEvent) => {
                /**
                 * 0 : Left mouse button
                 * 1 : Wheel button or middle button (if present)
                 * 2 : Right mouse button
                 */
                return mouseEvent.button === 0; // Mouse down to be only fired if is left click
            })
        )
    );
}

/**
 * Emits when a 'mousemove' or a 'touchmove' event gets fired.
 * @param element, html element where to  listen the events.
 * @param touchNumber number of the touch to track the event, default to the first one.
 */
export function datalyticsMouseOrTouchMove(element, touchNumber = 1): Observable<MouseEvent | TouchEvent> {
    return iif(
        () => datalyticsIsMobileOrTablet(),
        fromEvent<TouchEvent>(element, 'touchmove', activeEventListenerOptions as AddEventListenerOptions).pipe(
            filter((touchEvent) => touchEvent.touches.length === touchNumber),
        ),
        fromEvent<MouseEvent>(element, 'mousemove', activeEventListenerOptions as AddEventListenerOptions)
    );
}

export function datalyticsTouchEnd(element, touchNumber = 1): Observable<TouchEvent> {
    return merge(
        fromEvent<TouchEvent>(element, 'touchend').pipe(
            filter((touchEvent) => touchEvent.touches.length === touchNumber - 1)
        ),
        fromEvent<TouchEvent>(element, 'touchcancel').pipe(
            filter((touchEvent) => touchEvent.touches.length === touchNumber - 1)
        )
    );
}

/**
 * Emits when a there is a 'mouseup' or the touch ends.
 * @param element, html element where to  listen the events.
 * @param touchNumber number of the touch to track the event, default to the first one.
 */
export function datalyticsMouseOrTouchEnd(element, touchNumber = 1): Observable<MouseEvent | TouchEvent> {
    return iif(
        () => datalyticsIsMobileOrTablet(),
        datalyticsTouchEnd(element, touchNumber),
        fromEvent<MouseEvent>(element, 'mouseup'),
    );
}
