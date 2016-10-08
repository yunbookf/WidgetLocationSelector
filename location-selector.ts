/**
 * WidgetLocationSelector
 * Website: http://www.maiyun.net
 * Website: https://hanguoshuai.com
 */
let wlsPath: string = $("script").last().attr("src");
let wlsPathIndexOf = wlsPath.indexOf("/");
if (wlsPathIndexOf !== -1)
    wlsPath = wlsPath.substring(0, wlsPath.indexOf("/") + 1);
else
    wlsPath = "";

class WidgetLocationSelector {

    public dom: JQuery;
    public static verison: string = "0.1";

    private _geolocation; // --- 为了 show 后再执行定位 ---
    private _key: string; // --- 地图 key  ---
    private _path: string;

    public city: string = "";

    public show(): void {
        this.dom.css({"display": "block"});
        this._geolocation.getCurrentPosition();
        // --- 判断 hash 变更 ---
        window.location.hash = "#map-wls";
        $(window).on("hashchange.wls", (function(): void {
            if (window.location.hash === "#search-wls") {
                this.dom.find(".map-wls").css({"display": "none"});
            } else if (window.location.hash === "#map-wls") {
                this.dom.find(".map-wls").removeAttr("style");
                this.dom.find(".input-wls").trigger("blur");
            } else {
                this.hide();
            }
        }).bind(this));
    }

    public hide(): void {
        $(window).off("hashchange.wls");
        this.dom.removeAttr("style").find(".input-wls").trigger("blur");
    }

    // --- 析构 ---
    private _inputTimer: number = 0;
    constructor(opts: WidgetLocationSelectorOptions) {
        let dom: JQuery = $(`<div class="widgetLocationSelector">
            <div class="mapPage-wls">
                <div class="title-wls">
                    <input class="input-wls" placeholder="请输入小区/大厦/学校等进行搜索">
                </div>
                <div class="map-wls"><div class="marker-wls"></div></div>
                <div class="list-wls"></div>
            </div>
        </div>`);
        $("body").append(dom);
        this._key = opts.key;
        this._path = wlsPath;
        // --- 创建地图对象 ---
        let map = new AMap.Map(dom.find(".map-wls")[0]);
        // --- 点击文本框则隐藏地图 ---
        dom.find(".input-wls").on("touchend focus", function(): void {
            if (window.location.hash === "#map-wls") {
                window.location.hash = "#search-wls";
                dom.find(".list-wls").scrollTop(0);
            }
        }).on("input", (function(): void {
            // --- 文本框输入内容进行搜索 ---
            clearTimeout(this._inputTimer);
            this._inputTimer = setTimeout((function(): void {
                $.ajax({type: "GET", url: `//restapi.amap.com/v3/assistant/inputtips?s=rsv3&key=${this._key}&platform=JS&keywords=${encodeURIComponent(dom.find(".input-wls").val())}&city=${encodeURIComponent(this.city)}&callback=?`, dataType: "jsonp", success: (function (j: any): void {
                    this.dom.find(".list-wls").html("").scrollTop(0);
                    for (let item of j.tips) {
                        this.dom.find(".list-wls").append(`<div class="item-wls" location="${item.location}"><div class="title-wls">${item.name}</div><div class="text-wls">${item.address}</div></div>`);
                    }
                    // --- 绑定点击选择事件 ---
                    this._bindTap();
                }).bind(this)});
            }).bind(this), 300);
        }).bind(this));
        // --- 平移地图结束触发再次搜索 ---
        AMap.event.addListener(map, "moveend", (function(): void {
            let location = map.getCenter();
            this.getNear(location.getLat(), location.getLng());
        }).bind(this));
        map.plugin("AMap.Geolocation", (function(): void {
            this._geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 15000,
                buttonOffset: new AMap.Pixel(10, 20),
                zoomToAccuracy: true,
                buttonPosition: "RB"
            });
            map.addControl(this._geolocation);
            AMap.event.addListener(this._geolocation, "complete", (function(data): void {
                // --- 定位完成后查询附近的位置点 ---
                // --- 会自动触发 move end ---
                // this.getNear(data.position.getLat(), data.position.getLng());
            }).bind(this));
        }).bind(this));
        this.dom = dom;
    }

    // --- 搜索附近的东西 ---
    private _nearTimer: number = 0;
    private getNear(lat: number, lng: number): void {
        clearTimeout(this._nearTimer);
        this._nearTimer = setTimeout((function(): void {
            if (!this.dom.find(".list-wls").hasClass("loading-wls")) {
                this.dom.find(".list-wls").addClass("loading-wls").html(`<div class="loading-wls">加载中...</div>`).scrollTop(0);
            }
            $.ajax({type: "GET", url: `//restapi.amap.com/v3/place/around?location=${lng},${lat}&s=rsv3&key=${this._key}&radius=1000&offset=20&types=%E5%B0%8F%E5%8C%BA,%E5%86%99%E5%AD%97%E6%A5%BC,%E5%AD%A6%E6%A0%A1&page=1&callback=?`, dataType: "jsonp", success: (function (j: any): void {
                this.dom.find(".list-wls").removeClass("loading-wls").html("");
                for (let item of j.pois) {
                    this.dom.find(".list-wls").append(`<div class="item-wls" location="${item.location}"><div class="title-wls">${item.name}</div><div class="text-wls">${item.address}</div></div>`);
                }
                // --- 绑定点击选择事件 ---
                this._bindTap();
            }).bind(this)});
        }).bind(this), 300);
        // --- 延迟三百毫秒是怕有人频繁拖动搜索 ---
    }

    // --- 事件 ---
    public onSelect: (name: string, address: string, lat: string, lng: string) => void = function(): void {};

    // --- 内部方法 ---
    // --- 绑定点击事件 ---
    private _bindTap(): void {
        ModuleTouch.tap(this.dom.find(".list-wls > .item-wls"), (function(e: JQueryEventObject): boolean {
            let node: JQuery = $(e.currentTarget);
            let location: string[] = node.attr("location").split(",");
            this.onSelect(node.children(".title-wls").text(), node.children(".text-wls").text(), location[1], location[0]);
            window.history.go(window.location.hash === "#map-wls" ? -1 : -2);
            e.preventDefault();
            return false;
        }).bind(this));
    }

}

