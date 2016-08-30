interface AMapConstructor {
    Map(dom: Node): void;
    Geolocation(opts: any): void;
    Pixel(x: number, y: number): void;

    event: any;
}

declare let AMap: AMapConstructor;

// --- 主要 ---

interface WidgetMobileLocationSelectorOptions {
    key: string;
}

interface WidgetMobileLocationSelectorInstance {
    dom: JQuery;
}

interface WidgetMobileLocationSelectorConstructor {
    new(opts?: WidgetMobileLocationSelectorOptions): WidgetMobileLocationSelectorInstance;

    version: string;
}

// declare let WidgetMobileLocationSelector: WidgetMobileLocationSelectorConstructor;

