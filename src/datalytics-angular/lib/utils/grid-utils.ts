
/**
 * IMPORTANT:
 * This utils are taken from the project: https://github.com/STRML/react-grid-layout.
 * The code should be as less modified as possible for easy maintenance.
 */

// Disable lint since we don't want to modify this code
// tslint:disable
export type LayoutItem = {
    w: number;
    h: number;
    x: number;
    y: number;
    id: string;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    moved?: boolean;
    static?: boolean;
    isDraggable?: boolean | null | undefined;
    isResizable?: boolean | null | undefined;
};
export type Layout = Array<LayoutItem>;
export type Position = {
    left: number;
    top: number;
    width: number;
    height: number;
};
export type ReactDraggableCallbackData = {
    node: HTMLElement;
    x?: number;
    y?: number;
    deltaX: number;
    deltaY: number;
    lastX?: number;
    lastY?: number;
};

export type PartialPosition = { left: number; top: number };
export type DroppingPosition = { x: number; y: number; e: Event };
export type Size = { width: number; height: number };
export type GridDragEvent = {
    e: Event;
    node: HTMLElement;
    newPosition: PartialPosition;
};
export type GridResizeEvent = { e: Event; node: HTMLElement; size: Size };
export type DragOverEvent = MouseEvent & {
    nativeEvent: {
        layerX: number;
        layerY: number;
        target: {
            className: String;
        };
    };
};

//type REl = ReactElement<any>;
//export type ReactChildren = ReactChildrenArray<REl>;

// All callbacks are of the signature (layout, oldItem, newItem, placeholder, e).
export type EventCallback = (
    arg0: Layout,
    oldItem: LayoutItem | null | undefined,
    newItem: LayoutItem | null | undefined,
    placeholder: LayoutItem | null | undefined,
    arg4: Event,
    arg5: HTMLElement | null | undefined,
) => void;
export type CompactType = ('horizontal' | 'vertical') | null | undefined;

const DEBUG = false;

/**
 * Return the bottom coordinate of the layout.
 *
 * @param  {Array} layout Layout array.
 * @return {Number}       Bottom coordinate.
 */
export function bottom(layout: Layout): number {
    let max = 0,
        bottomY;
    for (let i = 0, len = layout.length; i < len; i++) {
        bottomY = layout[i].y + layout[i].h;
        if (bottomY > max) {
            max = bottomY;
        }
    }
    return max;
}

export function cloneLayout(layout: Layout): Layout {
    const newLayout = Array(layout.length);
    for (let i = 0, len = layout.length; i < len; i++) {
        newLayout[i] = cloneLayoutItem(layout[i]);
    }
    return newLayout;
}

// Fast path to cloning, since this is monomorphic
/** NOTE: This code has been modified from the original source */
export function cloneLayoutItem(layoutItem: LayoutItem): LayoutItem {
    const clonedLayoutItem: LayoutItem = {
        w: layoutItem.w,
        h: layoutItem.h,
        x: layoutItem.x,
        y: layoutItem.y,
        id: layoutItem.id,
        moved: !!layoutItem.moved,
        static: !!layoutItem.static,
    };

    if (layoutItem.minW !== undefined) { clonedLayoutItem.minW = layoutItem.minW;}
    if (layoutItem.maxW !== undefined) { clonedLayoutItem.maxW = layoutItem.maxW;}
    if (layoutItem.minH !== undefined) { clonedLayoutItem.minH = layoutItem.minH;}
    if (layoutItem.maxH !== undefined) { clonedLayoutItem.maxH = layoutItem.maxH;}
    // These can be null
    if (layoutItem.isDraggable !== undefined) { clonedLayoutItem.isDraggable = layoutItem.isDraggable;}
    if (layoutItem.isResizable !== undefined) { clonedLayoutItem.isResizable = layoutItem.isResizable;}

    return clonedLayoutItem;
}

/**
 * Given two layoutitems, check if they collide.
 */
export function collides(l1: LayoutItem, l2: LayoutItem): boolean {
    if (l1.id === l2.id) {
        return false;
    } // same element
    if (l1.x + l1.w <= l2.x) {
        return false;
    } // l1 is left of l2
    if (l1.x >= l2.x + l2.w) {
        return false;
    } // l1 is right of l2
    if (l1.y + l1.h <= l2.y) {
        return false;
    } // l1 is above l2
    if (l1.y >= l2.y + l2.h) {
        return false;
    } // l1 is below l2
    return true; // boxes overlap
}

/**
 * Given a layout, compact it. This involves going down each y coordinate and removing gaps
 * between items.
 *
 * @param  {Array} layout Layout.
 * @param  {Boolean} verticalCompact Whether or not to compact the layout
 *   vertically.
 * @return {Array}       Compacted Layout.
 */
export function compact(
    layout: Layout,
    compactType: CompactType,
    cols: number,
): Layout {
    // Statics go in the compareWith array right away so items flow around them.
    const compareWith = getStatics(layout);
    // We go through the items by row and column.
    const sorted = sortLayoutItems(layout, compactType);
    // Holding for new items.
    const out = Array(layout.length);

    for (let i = 0, len = sorted.length; i < len; i++) {
        let l = cloneLayoutItem(sorted[i]);

        // Don't move static elements
        if (!l.static) {
            l = compactItem(compareWith, l, compactType, cols, sorted);

            // Add to comparison array. We only collide with items before this one.
            // Statics are already in this array.
            compareWith.push(l);
        }

        // Add to output array to make sure they still come out in the right order.
        out[layout.indexOf(sorted[i])] = l;

        // Clear moved flag, if it exists.
        l.moved = false;
    }

    return out;
}

const heightWidth = {x: 'w', y: 'h'};

/**
 * Before moving item down, it will check if the movement will cause collisions and move those items down before.
 */
function resolveCompactionCollision(
    layout: Layout,
    item: LayoutItem,
    moveToCoord: number,
    axis: 'x' | 'y',
) {
    const sizeProp = heightWidth[axis];
    item[axis] += 1;
    const itemIndex = layout
        .map(layoutItem => {
            return layoutItem.id;
        })
        .indexOf(item.id);

    // Go through each item we collide with.
    for (let i = itemIndex + 1; i < layout.length; i++) {
        const otherItem = layout[i];
        // Ignore static items
        if (otherItem.static) {
            continue;
        }

        // Optimization: we can break early if we know we're past this el
        // We can do this b/c it's a sorted layout
        if (otherItem.y > item.y + item.h) {
            break;
        }

        if (collides(item, otherItem)) {
            resolveCompactionCollision(
                layout,
                otherItem,
                moveToCoord + item[sizeProp],
                axis,
            );
        }
    }

    item[axis] = moveToCoord;
}

/**
 * Compact an item in the layout.
 */
export function compactItem(
    compareWith: Layout,
    l: LayoutItem,
    compactType: CompactType,
    cols: number,
    fullLayout: Layout,
): LayoutItem {
    const compactV = compactType === 'vertical';
    const compactH = compactType === 'horizontal';
    if (compactV) {
        // Bottom 'y' possible is the bottom of the layout.
        // This allows you to do nice stuff like specify {y: Infinity}
        // This is here because the layout must be sorted in order to get the correct bottom `y`.
        l.y = Math.min(bottom(compareWith), l.y);
        // Move the element up as far as it can go without colliding.
        while (l.y > 0 && !getFirstCollision(compareWith, l)) {
            l.y--;
        }
    } else if (compactH) {
        l.y = Math.min(bottom(compareWith), l.y);
        // Move the element left as far as it can go without colliding.
        while (l.x > 0 && !getFirstCollision(compareWith, l)) {
            l.x--;
        }
    }

    // Move it down, and keep moving it down if it's colliding.
    let collides;
    while ((collides = getFirstCollision(compareWith, l))) {
        if (compactH) {
            resolveCompactionCollision(
                fullLayout,
                l,
                collides.x + collides.w,
                'x',
            );
        } else {
            resolveCompactionCollision(
                fullLayout,
                l,
                collides.y + collides.h,
                'y',
            );
        }
        // Since we can't grow without bounds horizontally, if we've overflown, let's move it down and try again.
        if (compactH && l.x + l.w > cols) {
            l.x = cols - l.w;
            l.y++;
        }
    }
    return l;
}

/**
 * Given a layout, make sure all elements fit within its bounds.
 *
 * @param  {Array} layout Layout array.
 * @param  {Number} bounds Number of columns.
 */
export function correctBounds(layout: Layout, bounds: { cols: number }): Layout {
    const collidesWith = getStatics(layout);
    for (let i = 0, len = layout.length; i < len; i++) {
        const l = layout[i];
        // Overflows right
        if (l.x + l.w > bounds.cols) {
            l.x = bounds.cols - l.w;
        }
        // Overflows left
        if (l.x < 0) {
            l.x = 0;
            l.w = bounds.cols;
        }
        if (!l.static) {
            collidesWith.push(l);
        } else {
            // If this is static and collides with other statics, we must move it down.
            // We have to do something nicer than just letting them overlap.
            while (getFirstCollision(collidesWith, l)) {
                l.y++;
            }
        }
    }
    return layout;
}

/**
 * Get a layout item by ID. Used so we can override later on if necessary.
 *
 * @param  {Array}  layout Layout array.
 * @param  {String} id     ID
 * @return {LayoutItem}    Item at ID.
 */
export function getLayoutItem(
    layout: Layout,
    id: string,
): LayoutItem | null | undefined {
    for (let i = 0, len = layout.length; i < len; i++) {
        if (layout[i].id === id) {
            return layout[i];
        }
    }
    return null;
}

/**
 * Returns the first item this layout collides with.
 * It doesn't appear to matter which order we approach this from, although
 * perhaps that is the wrong thing to do.
 *
 * @param  {Object} layoutItem Layout item.
 * @return {Object|undefined}  A colliding layout item, or undefined.
 */
export function getFirstCollision(
    layout: Layout,
    layoutItem: LayoutItem,
): LayoutItem | null | undefined {
    for (let i = 0, len = layout.length; i < len; i++) {
        if (collides(layout[i], layoutItem)) {
            return layout[i];
        }
    }
    return null;
}

export function getAllCollisions(
    layout: Layout,
    layoutItem: LayoutItem,
): Array<LayoutItem> {
    return layout.filter(l => collides(l, layoutItem));
}

/**
 * Get all static elements.
 * @param  {Array} layout Array of layout objects.
 * @return {Array}        Array of static layout items..
 */
export function getStatics(layout: Layout): Array<LayoutItem> {
    return layout.filter(l => l.static);
}

/**
 * Move an element. Responsible for doing cascading movements of other elements.
 *
 * @param  {Array}      layout            Full layout to modify.
 * @param  {LayoutItem} l                 element to move.
 * @param  {Number}     [x]               X position in grid units.
 * @param  {Number}     [y]               Y position in grid units.
 */
export function moveElement(
    layout: Layout,
    l: LayoutItem,
    x: number | null | undefined,
    y: number | null | undefined,
    isUserAction: boolean | null | undefined,
    preventCollision: boolean | null | undefined,
    compactType: CompactType,
    cols: number,
): Layout {
    // If this is static and not explicitly enabled as draggable,
    // no move is possible, so we can short-circuit this immediately.
    if (l.static && l.isDraggable !== true) {
        return layout;
    }

    // Short-circuit if nothing to do.
    if (l.y === y && l.x === x) {
        return layout;
    }

    log(
        `Moving element ${l.id} to [${String(x)},${String(y)}] from [${l.x},${
            l.y
        }]`,
    );
    const oldX = l.x;
    const oldY = l.y;

    // This is quite a bit faster than extending the object
    if (typeof x === 'number') {
        l.x = x;
    }
    if (typeof y === 'number') {
        l.y = y;
    }
    l.moved = true;

    // If this collides with anything, move it.
    // When doing this comparison, we have to sort the items we compare with
    // to ensure, in the case of multiple collisions, that we're getting the
    // nearest collision.
    let sorted = sortLayoutItems(layout, compactType);
    const movingUp =
        compactType === 'vertical' && typeof y === 'number'
            ? oldY >= y
            : compactType === 'horizontal' && typeof x === 'number'
            ? oldX >= x
            : false;
    if (movingUp) {
        sorted = sorted.reverse();
    }
    const collisions = getAllCollisions(sorted, l);

    // There was a collision; abort
    if (preventCollision && collisions.length) {
        log(`Collision prevented on ${l.id}, reverting.`);
        l.x = oldX;
        l.y = oldY;
        l.moved = false;
        return layout;
    }

    // Move each item that collides away from this element.
    for (let i = 0, len = collisions.length; i < len; i++) {
        const collision = collisions[i];
        log(
            `Resolving collision between ${l.id} at [${l.x},${l.y}] and ${
                collision.id
            } at [${collision.x},${collision.y}]`,
        );

        // Short circuit so we can't infinite loop
        if (collision.moved) {
            continue;
        }

        // Don't move static items - we have to move *this* element away
        if (collision.static) {
            layout = moveElementAwayFromCollision(
                layout,
                collision,
                l,
                isUserAction,
                compactType,
                cols,
            );
        } else {
            layout = moveElementAwayFromCollision(
                layout,
                l,
                collision,
                isUserAction,
                compactType,
                cols,
            );
        }
    }

    return layout;
}

/**
 * This is where the magic needs to happen - given a collision, move an element away from the collision.
 * We attempt to move it up if there's room, otherwise it goes below.
 *
 * @param  {Array} layout            Full layout to modify.
 * @param  {LayoutItem} collidesWith Layout item we're colliding with.
 * @param  {LayoutItem} itemToMove   Layout item we're moving.
 */
export function moveElementAwayFromCollision(
    layout: Layout,
    collidesWith: LayoutItem,
    itemToMove: LayoutItem,
    isUserAction: boolean | null | undefined,
    compactType: CompactType,
    cols: number,
): Layout {
    const compactH = compactType === 'horizontal';
    // Compact vertically if not set to horizontal
    const compactV = compactType !== 'horizontal';
    const preventCollision = collidesWith.static; // we're already colliding (not for static items)

    // If there is enough space above the collision to put this element, move it there.
    // We only do this on the main collision as this can get funky in cascades and cause
    // unwanted swapping behavior.
    if (isUserAction) {
        // Reset isUserAction flag because we're not in the main collision anymore.
        isUserAction = false;

        // Make a mock item so we don't modify the item here, only modify in moveElement.
        const fakeItem: LayoutItem = {
            x: compactH
                ? Math.max(collidesWith.x - itemToMove.w, 0)
                : itemToMove.x,
            y: compactV
                ? Math.max(collidesWith.y - itemToMove.h, 0)
                : itemToMove.y,
            w: itemToMove.w,
            h: itemToMove.h,
            id: '-1',
        };

        // No collision? If so, we can go up there; otherwise, we'll end up moving down as normal
        if (!getFirstCollision(layout, fakeItem)) {
            log(
                `Doing reverse collision on ${itemToMove.id} up to [${
                    fakeItem.x
                },${fakeItem.y}].`,
            );
            return moveElement(
                layout,
                itemToMove,
                compactH ? fakeItem.x : undefined,
                compactV ? fakeItem.y : undefined,
                isUserAction,
                preventCollision,
                compactType,
                cols,
            );
        }
    }

    return moveElement(
        layout,
        itemToMove,
        compactH ? itemToMove.x + 1 : undefined,
        compactV ? itemToMove.y + 1 : undefined,
        isUserAction,
        preventCollision,
        compactType,
        cols,
    );
}

/**
 * Helper to convert a number to a percentage string.
 *
 * @param  {Number} num Any number
 * @return {String}     That number as a percentage.
 */
export function perc(num: number): string {
    return num * 100 + '%';
}

export function setTransform({top, left, width, height}: Position): Object {
    // Replace unitless items with px
    const translate = `translate(${left}px,${top}px)`;
    return {
        transform: translate,
        WebkitTransform: translate,
        MozTransform: translate,
        msTransform: translate,
        OTransform: translate,
        width: `${width}px`,
        height: `${height}px`,
        position: 'absolute',
    };
}

export function setTopLeft({top, left, width, height}: Position): Object {
    return {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        position: 'absolute',
    };
}

/**
 * Get layout items sorted from top left to right and down.
 *
 * @return {Array} Array of layout objects.
 * @return {Array}        Layout, sorted static items first.
 */
export function sortLayoutItems(
    layout: Layout,
    compactType: CompactType,
): Layout {
    if (compactType === 'horizontal') {
        return sortLayoutItemsByColRow(layout);
    } else {
        return sortLayoutItemsByRowCol(layout);
    }
}

export function sortLayoutItemsByRowCol(layout: Layout): Layout {
    return ([] as any[]).concat(layout).sort(function (a, b) {
        if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
            return 1;
        } else if (a.y === b.y && a.x === b.x) {
            // Without this, we can get different sort results in IE vs. Chrome/FF
            return 0;
        }
        return -1;
    });
}

export function sortLayoutItemsByColRow(layout: Layout): Layout {
    return ([] as any[]).concat(layout).sort(function (a, b) {
        if (a.x > b.x || (a.x === b.x && a.y > b.y)) {
            return 1;
        }
        return -1;
    });
}

/**
 * Validate a layout. Throws errors.
 *
 * @param  {Array}  layout        Array of layout items.
 * @param  {String} [contextName] Context name for errors.
 * @throw  {Error}                Validation error.
 */
export function validateLayout(
    layout: Layout,
    contextName: string = 'Layout',
): void {
    const subProps = ['x', 'y', 'w', 'h'];
    if (!Array.isArray(layout)) {
        throw new Error(contextName + ' must be an array!');
    }
    for (let i = 0, len = layout.length; i < len; i++) {
        const item = layout[i];
        for (let j = 0; j < subProps.length; j++) {
            if (typeof item[subProps[j]] !== 'number') {
                throw new Error(
                    'ReactGridLayout: ' +
                    contextName +
                    '[' +
                    i +
                    '].' +
                    subProps[j] +
                    ' must be a number!',
                );
            }
        }
        if (item.id && typeof item.id !== 'string') {
            throw new Error(
                'ReactGridLayout: ' +
                contextName +
                '[' +
                i +
                '].i must be a string!',
            );
        }
        if (item.static !== undefined && typeof item.static !== 'boolean') {
            throw new Error(
                'ReactGridLayout: ' +
                contextName +
                '[' +
                i +
                '].static must be a boolean!',
            );
        }
    }
}

// Flow can't really figure this out, so we just use Object
export function autoBindHandlers(el: Object, fns: Array<string>): void {
    fns.forEach(key => (el[key] = el[key].bind(el)));
}

function log(...args) {
    if (!DEBUG) {
        return;
    }
    // eslint-disable-next-line no-console
    console.log(...args);
}

export const noop = () => {};
// ------------------
export interface Dictionary<T> {
    [key: string]: T;
}
import { NgZone } from '@angular/core';
import { animationFrameScheduler, fromEvent, interval, NEVER, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
// ----------------------------
// import { compact, CompactType, LayoutItem, moveElement } from './react-grid-layout.utils';
import { DatalyticsDraggingData, DatalyticsGridCfg, DatalyticsGridItemRect, DatalyticsGridLayout, DatalyticsGridLayoutItem } from '../models/grid';
import { datalyticsPointerClientX, datalyticsPointerClientY } from '../utils/pointer.utils';
import { datalyticsNormalizePassiveListenerOptions } from './passive-listeners';
// import { Dictionary } from '../../types';

/** Tracks items by id. This function is mean to be used in conjunction with the ngFor that renders the 'ktd-grid-items' */
export function TrackById(index: number, item: {id: string}) {
    return item.id;
}

/**
 * Call react-grid-layout utils 'compact()' function and return the compacted layout.
 * @param layout to be compacted.
 * @param compactType, type of compaction.
 * @param cols, number of columns of the grid.
 */
export function GridCompact(layout: DatalyticsGridLayout, compactType: any, cols: number): DatalyticsGridLayout {
    return compact(layout, compactType, cols)
        // Prune react-grid-layout compact extra properties.
        .map(item => ({id: item.id, x: item.x, y: item.y, w: item.w, h: item.h}));
}

function screenXPosToGridValue(screenXPos: number, cols: number, width: number): number {
    return Math.round((screenXPos * cols) / width);
}

function screenYPosToGridValue(screenYPos: number, rowHeight: number, height: number): number {
    return Math.round(screenYPos / rowHeight);
}

/** Returns a Dictionary where the key is the id and the value is the change applied to that item. If no changes Dictionary is empty. */
export function GetGridLayoutDiff(gridLayoutA: DatalyticsGridLayoutItem[], gridLayoutB: DatalyticsGridLayoutItem[]): Dictionary<{ change: 'move' | 'resize' | 'moveresize' }> {
    const diff: Dictionary<{ change: 'move' | 'resize' | 'moveresize' }> = {};

    gridLayoutA.forEach(itemA => {
        const itemB = gridLayoutB.find(_itemB => _itemB.id === itemA.id);
        if (itemB != null) {
            const posChanged = itemA.x !== itemB.x || itemA.y !== itemB.y;
            const sizeChanged = itemA.w !== itemB.w || itemA.h !== itemB.h;
            const change: 'move' | 'resize' | 'moveresize' | null = posChanged && sizeChanged ? 'moveresize' : posChanged ? 'move' : sizeChanged ? 'resize' : null;
            if (change) {
                diff[itemB.id] = {change};
            }
        }
    });
    return diff;
}

/**
 * Given the grid config & layout data and the current drag position & information, returns the corresponding layout and drag item position
 * @param gridItemId id of the grid item that is been dragged
 * @param config current grid configuration
 * @param compactionType type of compaction that will be performed
 * @param draggingData contains all the information about the drag
 */
export function GridItemDragging(gridItemId: string, config: DatalyticsGridCfg, compactionType: CompactType, draggingData: DatalyticsDraggingData): {
     layout: DatalyticsGridLayoutItem[]; draggedItemPos: DatalyticsGridItemRect } {
    const {pointerDownEvent, pointerDragEvent, gridElemClientRect, dragElemClientRect, scrollDifference} = draggingData;

    const draggingElemPrevItem = config.layout.find(item => item.id === gridItemId)!;

    const clientStartX = datalyticsPointerClientX(pointerDownEvent);
    const clientStartY = datalyticsPointerClientY(pointerDownEvent);
    const clientX = datalyticsPointerClientX(pointerDragEvent);
    const clientY = datalyticsPointerClientY(pointerDragEvent);

    const offsetX = clientStartX - dragElemClientRect.left;
    const offsetY = clientStartY - dragElemClientRect.top;

    // Grid element positions taking into account the possible scroll total difference from the beginning.
    const gridElementLeftPosition = gridElemClientRect.left + scrollDifference.left;
    const gridElementTopPosition = gridElemClientRect.top + scrollDifference.top;

    // Calculate position relative to the grid element.
    const gridRelXPos = clientX - gridElementLeftPosition - offsetX;
    const gridRelYPos = clientY - gridElementTopPosition - offsetY;

    // Get layout item position
    const layoutItem: DatalyticsGridLayoutItem = {
        ...draggingElemPrevItem,
        x: screenXPosToGridValue(gridRelXPos, config.cols, gridElemClientRect.width),
        y: screenYPosToGridValue(gridRelYPos, config.rowHeight, gridElemClientRect.height)
    };

    // Correct the values if they overflow, since 'moveElement' function doesn't do it
    layoutItem.x = Math.max(0, layoutItem.x);
    layoutItem.y = Math.max(0, layoutItem.y);
    if (layoutItem.x + layoutItem.w > config.cols) {
        layoutItem.x = Math.max(0, config.cols - layoutItem.w);
    }

    // Parse to LayoutItem array data in order to use 'react.grid-layout' utils
    const layoutItems: LayoutItem[] = config.layout;
    const draggedLayoutItem: LayoutItem = layoutItems.find(item => item.id === gridItemId)!;

    let newLayoutItems: LayoutItem[] = moveElement(
        layoutItems,
        draggedLayoutItem,
        layoutItem.x,
        layoutItem.y,
        true,
        false,
        compactionType,
        config.cols
    );

    newLayoutItems = compact(newLayoutItems, compactionType, config.cols);

    return {
        layout: newLayoutItems,
        draggedItemPos: {
            top: gridRelYPos,
            left: gridRelXPos,
            width: dragElemClientRect.width,
            height: dragElemClientRect.height,
        }
    };
}

/**
 * Given the grid config & layout data and the current drag position & information, returns the corresponding layout and drag item position
 * @param gridItemId id of the grid item that is been dragged
 * @param config current grid configuration
 * @param compactionType type of compaction that will be performed
 * @param draggingData contains all the information about the drag
 */
export function GridItemResizing(gridItemId: string, config: DatalyticsGridCfg,
     compactionType: CompactType, draggingData: DatalyticsDraggingData):
      { layout: DatalyticsGridLayoutItem[]; draggedItemPos: DatalyticsGridItemRect } {
    const {pointerDownEvent, pointerDragEvent, gridElemClientRect, dragElemClientRect, scrollDifference} = draggingData;

    const clientStartX = datalyticsPointerClientX(pointerDownEvent);
    const clientStartY = datalyticsPointerClientY(pointerDownEvent);
    const clientX = datalyticsPointerClientX(pointerDragEvent);
    const clientY = datalyticsPointerClientY(pointerDragEvent);

    // Get the difference between the mouseDown and the position 'right' of the resize element.
    const resizeElemOffsetX = dragElemClientRect.width - (clientStartX - dragElemClientRect.left);
    const resizeElemOffsetY = dragElemClientRect.height - (clientStartY - dragElemClientRect.top);

    const draggingElemPrevItem = config.layout.find(item => item.id === gridItemId)!;
    const width = clientX + resizeElemOffsetX - (dragElemClientRect.left + scrollDifference.left);
    const height = clientY + resizeElemOffsetY - (dragElemClientRect.top + scrollDifference.top);


    // Get layout item grid position
    const layoutItem: DatalyticsGridLayoutItem = {
        ...draggingElemPrevItem,
        w: screenXPosToGridValue(width, config.cols, gridElemClientRect.width),
        h: screenYPosToGridValue(height, config.rowHeight, gridElemClientRect.height)
    };

    layoutItem.w = Math.max(1, layoutItem.w);
    layoutItem.h = Math.max(1, layoutItem.h);
    if (layoutItem.x + layoutItem.w > config.cols) {
        layoutItem.w = Math.max(1, config.cols - layoutItem.x);
    }

    const newLayoutItems: LayoutItem[] = config.layout.map((item) => {
        return item.id === gridItemId ? layoutItem : item;
    });

    return {
        layout: compact(newLayoutItems, compactionType, config.cols),
        draggedItemPos: {
            top: dragElemClientRect.top - gridElemClientRect.top,
            left: dragElemClientRect.left - gridElemClientRect.left,
            width,
            height,
        }
    };
}

// -------------------

// tslint:disable

/**
 * Client rect utilities.
 * This file is taken from Angular Material repository. This is the reason why the tslint is disabled on this case.
 * Don't enable it until some custom change is done on this file.
 */


/** Gets a mutable version of an element's bounding `ClientRect`. */
export function getMutableClientRect(element: Element): ClientRect {
    const clientRect = element.getBoundingClientRect();
  
    // We need to clone the `clientRect` here, because all the values on it are readonly
    // and we need to be able to update them. Also we can't use a spread here, because
    // the values on a `ClientRect` aren't own properties. See:
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#Notes
    return {
      top: clientRect.top,
      right: clientRect.right,
      bottom: clientRect.bottom,
      left: clientRect.left,
      width: clientRect.width,
      height: clientRect.height
    };
  }
  
  /**
   * Checks whether some coordinates are within a `ClientRect`.
   * @param clientRect ClientRect that is being checked.
   * @param x Coordinates along the X axis.
   * @param y Coordinates along the Y axis.
   */
  export function isInsideClientRect(clientRect: ClientRect, x: number, y: number) {
    const {top, bottom, left, right} = clientRect;
    return y >= top && y <= bottom && x >= left && x <= right;
  }
  
  /**
   * Updates the top/left positions of a `ClientRect`, as well as their bottom/right counterparts.
   * @param clientRect `ClientRect` that should be updated.
   * @param top Amount to add to the `top` position.
   * @param left Amount to add to the `left` position.
   */
  export function adjustClientRect(clientRect: ClientRect, top: number, left: number) {
    clientRect.top += top;
    clientRect.bottom = clientRect.top + clientRect.height;
  
    clientRect.left += left;
    clientRect.right = clientRect.left + clientRect.width;
  }
  
  /**
   * Checks whether the pointer coordinates are close to a ClientRect.
   * @param rect ClientRect to check against.
   * @param threshold Threshold around the ClientRect.
   * @param pointerX Coordinates along the X axis.
   * @param pointerY Coordinates along the Y axis.
   */
  export function isPointerNearClientRect(rect: ClientRect,
                                          threshold: number,
                                          pointerX: number,
                                          pointerY: number): boolean {
    const {top, right, bottom, left, width, height} = rect;
    const xThreshold = width * threshold;
    const yThreshold = height * threshold;
  
    return pointerY > top - yThreshold && pointerY < bottom + yThreshold &&
           pointerX > left - xThreshold && pointerX < right + xThreshold;
  }
  /**
 * Emits on EVERY scroll event and returns the accumulated scroll offset relative to the initial scroll position.
 * @param scrollableParent, node in which scroll events would be listened.
 */
export function getScrollTotalRelativeDifference$(scrollableParent: HTMLElement | Document): Observable<{ top: number, left: number }> {
    let scrollInitialPosition;

    // Calculate initial scroll position
    if (scrollableParent === document) {
        scrollInitialPosition = getViewportScrollPosition();
    } else {
        scrollInitialPosition = {
            top: (scrollableParent as HTMLElement).scrollTop,
            left: (scrollableParent as HTMLElement).scrollLeft
        };
    }

    return fromEvent(scrollableParent, 'scroll', datalyticsNormalizePassiveListenerOptions({capture: true}) as AddEventListenerOptions).pipe(
        map(() => {
            let newTop: number;
            let newLeft: number;

            if (scrollableParent === document) {
                const viewportScrollPosition = getViewportScrollPosition();
                newTop = viewportScrollPosition.top;
                newLeft = viewportScrollPosition.left;
            } else {
                newTop = (scrollableParent as HTMLElement).scrollTop;
                newLeft = (scrollableParent as HTMLElement).scrollLeft;
            }

            const topDifference = scrollInitialPosition.top - newTop;
            const leftDifference = scrollInitialPosition.left - newLeft;

            return {top: topDifference, left: leftDifference};
        })
    );

}
/** Gets the (top, left) scroll position of the viewport. */
function getViewportScrollPosition(): { top: number, left: number } {

    // The top-left-corner of the viewport is determined by the scroll position of the document
    // body, normally just (scrollLeft, scrollTop). However, Chrome and Firefox disagree about
    // whether `document.body` or `document.documentElement` is the scrolled element, so reading
    // `scrollTop` and `scrollLeft` is inconsistent. However, using the bounding rect of
    // `document.documentElement` works consistently, where the `top` and `left` values will
    // equal negative the scroll position.
    const windowRef = document.defaultView || window;
    const documentElement = document.documentElement!;
    const documentRect = documentElement.getBoundingClientRect();

    const top = -documentRect.top || document.body.scrollTop || windowRef.scrollY ||
        documentElement.scrollTop || 0;

    const left = -documentRect.left || document.body.scrollLeft || windowRef.scrollX ||
        documentElement.scrollLeft || 0;

    return {top, left};
}
/**
 * Given a source$ observable with pointer location, scroll the scrollNode if the pointer is near to it.
 * This observable doesn't emit, it just performs a 'scroll' side effect.
 * @param scrollableParent, parent node in which the scroll would be performed.
 * @param options, configuration options.
 */
 export function scrollIfNearElementClientRect$(scrollableParent: HTMLElement | Document, options?: scrollIfNearElementOptions): (source$: Observable<{ pointerX: number, pointerY: number }>) => Observable<any> {

    let scrollNode: Window | HTMLElement;
    let scrollableParentClientRect: ClientRect;
    let scrollableParentScrollWidth: number;

    if (scrollableParent === document) {
        scrollNode = document.defaultView as Window;
        const {width, height} = getViewportSize();
        scrollableParentClientRect = {width, height, top: 0, right: width, bottom: height, left: 0};
        scrollableParentScrollWidth = getDocumentScrollWidth();
    } else {
        scrollNode = scrollableParent as HTMLElement;
        scrollableParentClientRect = getMutableClientRect(scrollableParent as HTMLElement);
        scrollableParentScrollWidth = (scrollableParent as HTMLElement).scrollWidth;
    }

    /**
     * IMPORTANT: By design, only let scroll horizontal if the scrollable parent has explicitly an scroll horizontal.
     * This layout solution is not designed in mind to have any scroll horizontal, but exceptionally we allow it in this
     * specific use case.
     */
    options = options || {};
    if (options.disableHorizontal == null && scrollableParentScrollWidth <= scrollableParentClientRect.width) {
        options.disableHorizontal = true;
    }

    return (source$) => source$.pipe(
        map(({pointerX, pointerY}) => {
            let verticalScrollDirection = getVerticalScrollDirection(scrollableParentClientRect, pointerY);
            let horizontalScrollDirection = getHorizontalScrollDirection(scrollableParentClientRect, pointerX);

            // Check if scroll directions are disabled.
            if (options?.disableVertical) {
                verticalScrollDirection = AutoScrollVerticalDirection.NONE;
            }
            if (options?.disableHorizontal) {
                horizontalScrollDirection = AutoScrollHorizontalDirection.NONE;
            }

            return {verticalScrollDirection, horizontalScrollDirection};
        }),
        distinctUntilChanged((prev, actual) => {
            return prev.verticalScrollDirection === actual.verticalScrollDirection
                && prev.horizontalScrollDirection === actual.horizontalScrollDirection;
        }),
        switchMap(({verticalScrollDirection, horizontalScrollDirection}) => {
            if (verticalScrollDirection || horizontalScrollDirection) {
                return scrollToDirectionInterval$(scrollNode, verticalScrollDirection, horizontalScrollDirection, options?.scrollStep);
            } else {
                return NEVER;
            }
        })
    );
}

/**
 * Gets whether the horizontal auto-scroll direction of a node.
 * @param clientRect Dimensions of the node.
 * @param pointerX Position of the user's pointer along the x axis.
 */
 function getHorizontalScrollDirection(clientRect: ClientRect, pointerX: number) {
    const {left, right, width} = clientRect;
    const xThreshold = width * SCROLL_PROXIMITY_THRESHOLD;

    if (pointerX >= left - xThreshold && pointerX <= left + xThreshold) {
        return AutoScrollHorizontalDirection.LEFT;
    } else if (pointerX >= right - xThreshold && pointerX <= right + xThreshold) {
        return AutoScrollHorizontalDirection.RIGHT;
    }

    return AutoScrollHorizontalDirection.NONE;
}
/** Returns the document scroll width */
function getDocumentScrollWidth() {
    return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
}
/** Returns the viewport's width and height. */
function getViewportSize(): { width: number, height: number } {
    const _window = document.defaultView || window;
    return {
        width: _window.innerWidth,
        height: _window.innerHeight
    };

}
/**
 * Proximity, as a ratio to width/height at which to start auto-scrolling.
 * The value comes from trying it out manually until it feels right.
 */
 const SCROLL_PROXIMITY_THRESHOLD = 0.05;
/**
 * Gets whether the vertical auto-scroll direction of a node.
 * @param clientRect Dimensions of the node.
 * @param pointerY Position of the user's pointer along the y axis.
 */
 function getVerticalScrollDirection(clientRect: ClientRect, pointerY: number) {
    const {top, bottom, height} = clientRect;
    const yThreshold = height * SCROLL_PROXIMITY_THRESHOLD;

    if (pointerY >= top - yThreshold && pointerY <= top + yThreshold) {
        return AutoScrollVerticalDirection.UP;
    } else if (pointerY >= bottom - yThreshold && pointerY <= bottom + yThreshold) {
        return AutoScrollVerticalDirection.DOWN;
    }

    return AutoScrollVerticalDirection.NONE;
}
export interface scrollIfNearElementOptions {
    scrollStep?: number;
    disableVertical?: boolean;
    disableHorizontal?: boolean;
}
/**
 * Returns an observable that schedules a loop and apply scroll on the scrollNode into the specified direction/s.
 * This observable doesn't emit, it just performs the 'scroll' side effect.
 * @param scrollNode, node where the scroll would be applied.
 * @param verticalScrollDirection, vertical direction of the scroll.
 * @param horizontalScrollDirection, horizontal direction of the scroll.
 * @param scrollStep, scroll step in CSS pixels that would be applied in every loop.
 */
 function scrollToDirectionInterval$(scrollNode: HTMLElement | Window, verticalScrollDirection: AutoScrollVerticalDirection, horizontalScrollDirection: AutoScrollHorizontalDirection, scrollStep: number = 2) {
    return interval(0, animationFrameScheduler)
        .pipe(
            tap(() => {
                if (verticalScrollDirection === AutoScrollVerticalDirection.UP) {
                    incrementVerticalScroll(scrollNode, -scrollStep);
                } else if (verticalScrollDirection === AutoScrollVerticalDirection.DOWN) {
                    incrementVerticalScroll(scrollNode, scrollStep);
                }

                if (horizontalScrollDirection === AutoScrollHorizontalDirection.LEFT) {
                    incrementHorizontalScroll(scrollNode, -scrollStep);
                } else if (horizontalScrollDirection === AutoScrollHorizontalDirection.RIGHT) {
                    incrementHorizontalScroll(scrollNode, scrollStep);
                }
            }),
            noEmit()
        );
}
/** Vertical direction in which we can auto-scroll. */
const enum AutoScrollVerticalDirection {NONE, UP, DOWN}

/** Horizontal direction in which we can auto-scroll. */
const enum AutoScrollHorizontalDirection {NONE, LEFT, RIGHT}

export interface scrollPosition {
    top: number;
    left: number;
}

/**
 * Increments the vertical scroll position of a node.
 * @param node Node whose scroll position should change.
 * @param amount Amount of pixels that the `node` should be scrolled.
 */
 function incrementVerticalScroll(node: HTMLElement | Window, amount: number) {
    if (node === window) {
        (node as Window).scrollBy(0, amount);
    } else {
        // Ideally we could use `Element.scrollBy` here as well, but IE and Edge don't support it.
        (node as HTMLElement).scrollTop += amount;
    }
}
/**
 * Increments the horizontal scroll position of a node.
 * @param node Node whose scroll position should change.
 * @param amount Amount of pixels that the `node` should be scrolled.
 */
 function incrementHorizontalScroll(node: HTMLElement | Window, amount: number) {
    if (node === window) {
        (node as Window).scrollBy(amount, 0);
    } else {
        // Ideally we could use `Element.scrollBy` here as well, but IE and Edge don't support it.
        (node as HTMLElement).scrollLeft += amount;
    }
}
/** Rxjs operator that makes source observable to no emit any data */
export function noEmit() {
    return (source$: Observable<any>): Observable<any> => {
        return source$.pipe(filter(() => false));
    };
}

/** Runs source observable outside the zone */
export function outsideZone<T>(zone: NgZone) {
    return (source: Observable<T>) => {
        return new Observable<T>(observer => {
            return zone.runOutsideAngular<Subscription>(() => source.subscribe(observer));
        });
    };
}