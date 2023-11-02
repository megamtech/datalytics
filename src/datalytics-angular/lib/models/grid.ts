import { InjectionToken } from '@angular/core';
// import { CompactType } from './utils/react-grid-layout.utils';

export interface DatalyticsGridLayoutItem {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
}


// export type DatalyticsGridCompactType = CompactType;

export interface DatalyticsGridCfg {
    cols: number;
    rowHeight: number; // row height in pixels
    layout: DatalyticsGridLayoutItem[];
}

export type DatalyticsGridLayout = DatalyticsGridLayoutItem[];

// TODO: Remove this interface. If can't remove, move and rename this interface in the core module or similar.
export interface DatalyticsGridItemRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface DatalyticsGridItemRenderData<T = number | string> {
    id: string;
    top: T;
    left: T;
    width: T;
    height: T;
}
// export const GRID_ITEM_GET_RENDER_DATA_TOKEN: InjectionToken<KtdGridItemRenderDataTokenType> = 
// new InjectionToken('GRID_ITEM_GET_RENDER_DATA_TOKEN');
/**
 // tslint:disable-next-line:max-line-length
 // tslint:disable-next-line:max-line-length
 * We inject a token because of the 'circular dependency issue warning'. In case we don't had this issue with the circular dependency, we could just
 * import DatalyticsGridComponent on DatalyticsGridItem and execute the needed function to get the rendering data.
 */
export type DatalyticsGridItemRenderDataTokenType = (id: string) => DatalyticsGridItemRenderData<string>;
// tslint:disable-next-line:max-line-length
export const GRID_ITEM_GET_RENDER_DATA_TOKEN: InjectionToken<DatalyticsGridItemRenderDataTokenType> = new InjectionToken('GRID_ITEM_GET_RENDER_DATA_TOKEN');

export interface DatalyticsDraggingData {
    pointerDownEvent: MouseEvent | TouchEvent;
    pointerDragEvent: MouseEvent | TouchEvent;
    gridElemClientRect: ClientRect;
    dragElemClientRect: ClientRect;
    scrollDifference: { top: number, left: number };
}
