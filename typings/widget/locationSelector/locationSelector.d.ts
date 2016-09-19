interface AMapConstructor {
    Map(dom: Node): void;
    Geolocation(opts: any): void;
    Pixel(x: number, y: number): void;

    event: any;
}

declare let AMap: AMapConstructor;

// --- 主要 ---

interface WidgetLocationSelectorOptions {
    key: string;
}

/*
declare class WidgetLocationSelector {

    public dom: JQuery;
    public static verison: string;

    public city: string;

    public show(): void;
    public hide(): void;

    constructor(opts: WidgetLocationSelectorOptions);

    public onSelect: (name: string, address: string, lat: string, lng: string) => void;

}
// */



