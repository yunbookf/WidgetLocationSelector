/**
 * WidgetMobileLocationSelector
 * Website: http://www.maiyun.net
 * Website: http://hanguoshuai.com
 */
let scriptBaseSrc: string = $("script").last().attr("src");
let scriptBaseSrcIndexOf = scriptBaseSrc.indexOf("/");
if (scriptBaseSrcIndexOf !== -1)
    scriptBaseSrc = scriptBaseSrc.substring(0, scriptBaseSrc.indexOf("/") + 1);
else
    scriptBaseSrc = "";

class WidgetMobileLocationSelector {

    public dom: JQuery;
    public static verison: string = "0.1";

    private _geolocation; // --- 为了 show 后再定位 ---
    private _key: string; // --- 地图 key  ---
    private _path: string;

    public city: string = "";

    public show(): void {
        this.dom.css({"display": "block"});
        this._geolocation.getCurrentPosition();
        // --- 判断 hash 变更 ---
        window.location.hash = "#map_WMLS";
        $(window).on("hashchange.wmls", (function(): void {
            if (window.location.hash === "#search_WMLS") {
                this.dom.find(".map_WMLS").css({"display": "none"});
            } else if (window.location.hash === "#map_WMLS") {
                this.dom.find(".map_WMLS").removeAttr("style");
                this.dom.find(".input_WMLS").trigger("blur");
            } else {
                this.hide();
            }
        }).bind(this));
    }

    public hide(): void {
        $(window).off("hashchange.wmls");
        this.dom.removeAttr("style").find(".input_WMLS").trigger("blur");
    }

    // --- 析构 ---
    private _inputTimer: number = 0;
    constructor(opts: WidgetMobileLocationSelectorOptions) {
        let dom: JQuery = $(`<div class="widgetMobileLocationSelector">
            <div class="mapPage_WMLS">
                <div class="title_WMLS">
                    <input class="input_WMLS" placeholder="请输入小区/大厦/学校等进行搜索">
                </div>
                <div class="map_WMLS"><div class="marker_WMLS"></div></div>
                <div class="list_WMLS"></div>
            </div>
        </div>`);
        $("body").append(dom);
        this._key = opts.key;
        this._path = scriptBaseSrc;
        // --- 创建地图对象 ---
        let map = new AMap.Map(dom.find(".map_WMLS")[0]);
        // --- 点击文本框则隐藏地图 ---
        dom.find(".input_WMLS").on("touchend focus", function(): void {
            if (window.location.hash === "#map_WMLS") {
                window.location.hash = "#search_WMLS";
                dom.find(".list_WMLS").scrollTop(0);
            }
        }).on("input", (function(): void {
            // --- 文本框输入内容进行搜索 ---
            clearTimeout(this._inputTimer);
            this._inputTimer = setTimeout((function(): void {
                $.ajax({type: "GET", url: `http://restapi.amap.com/v3/assistant/inputtips?s=rsv3&key=${this._key}&platform=JS&keywords=${encodeURIComponent(dom.find(".input_WMLS").val())}&city=${encodeURIComponent(this.city)}&callback=?`, dataType: "jsonp", success: (function (j: any): void {
                    this.dom.find(".list_WMLS").html("").scrollTop(0);
                    for (let item of j.tips) {
                        this.dom.find(".list_WMLS").append(`<div class="item_WMLS" location="${item.location}"><div class="title_WMLS">${item.name}</div><div class="text_WMLS">${item.address}</div></div>`);
                    }
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
        // --- 选择 ---
        dom.find(".list_WMLS").on("click", ".item_WMLS", (function(e: JQueryEventObject): void {
            let node: JQuery = $(e.currentTarget);
            let location: string[] = node.attr("location").split(",");
            this.onSelect(node.children(".title_WMLS").text(), node.children(".text_WMLS").text(), location[1], location[0]);
            window.location.hash = "";
        }).bind(this));
        this.dom = dom;
    }

    // --- 搜索附近的东西 ---
    private _nearTimer: number = 0;
    private getNear(lat: number, lng: number): void {
        clearTimeout(this._nearTimer);
        this._nearTimer = setTimeout((function(): void {
            $.ajax({type: "GET", url: `http://restapi.amap.com/v3/place/around?location=${lng},${lat}&s=rsv3&key=${this._key}&radius=1000&offset=20&types=%E5%B0%8F%E5%8C%BA,%E5%86%99%E5%AD%97%E6%A5%BC,%E5%AD%A6%E6%A0%A1&page=1&callback=?`, dataType: "jsonp", success: (function (j: any): void {
                this.dom.find(".list_WMLS").html("").scrollTop(0);
                for (let item of j.pois) {
                    this.dom.find(".list_WMLS").append(`<div class="item_WMLS" location="${item.location}"><div class="title_WMLS">${item.name}</div><div class="text_WMLS">${item.address}</div></div>`);
                }
            }).bind(this)});
        }).bind(this), 300);
    }

    // --- 事件 ---
    public onSelect: (name: string, address: string, lat: string, lng: string) => void = function(): void {};

}

