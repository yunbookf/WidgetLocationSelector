var wlsPath = $("script").last().attr("src");
var wlsPathIndexOf = wlsPath.indexOf("/");
if (wlsPathIndexOf !== -1)
    wlsPath = wlsPath.substring(0, wlsPath.indexOf("/") + 1);
else
    wlsPath = "";
var WidgetLocationSelector = (function () {
    function WidgetLocationSelector(opts) {
        this.city = "";
        this._inputTimer = 0;
        this._nearTimer = 0;
        this.onSelect = function () { };
        var dom = $("<div class=\"widgetLocationSelector\">\n            <div class=\"mapPage-wls\">\n                <div class=\"title-wls\">\n                    <input class=\"input-wls\" placeholder=\"\u8BF7\u8F93\u5165\u5C0F\u533A/\u5927\u53A6/\u5B66\u6821\u7B49\u8FDB\u884C\u641C\u7D22\">\n                </div>\n                <div class=\"map-wls\"><div class=\"marker-wls\"></div></div>\n                <div class=\"list-wls\"></div>\n            </div>\n        </div>");
        $("body").append(dom);
        this._key = opts.key;
        this._path = wlsPath;
        var map = new AMap.Map(dom.find(".map-wls")[0]);
        dom.find(".input-wls").on("touchend focus", function () {
            if (window.location.hash === "#map-wls") {
                window.location.hash = "#search-wls";
                dom.find(".list-wls").scrollTop(0);
            }
        }).on("input", (function () {
            clearTimeout(this._inputTimer);
            this._inputTimer = setTimeout((function () {
                $.ajax({ type: "GET", url: "//restapi.amap.com/v3/assistant/inputtips?s=rsv3&key=" + this._key + "&platform=JS&keywords=" + encodeURIComponent(dom.find(".input-wls").val()) + "&city=" + encodeURIComponent(this.city) + "&callback=?", dataType: "jsonp", success: (function (j) {
                        this.dom.find(".list-wls").html("").scrollTop(0);
                        for (var _i = 0, _a = j.tips; _i < _a.length; _i++) {
                            var item = _a[_i];
                            this.dom.find(".list-wls").append("<div class=\"item-wls\" location=\"" + item.location + "\"><div class=\"title-wls\">" + item.name + "</div><div class=\"text-wls\">" + item.address + "</div></div>");
                        }
                    }).bind(this) });
            }).bind(this), 300);
        }).bind(this));
        AMap.event.addListener(map, "moveend", (function () {
            var location = map.getCenter();
            this.getNear(location.getLat(), location.getLng());
        }).bind(this));
        map.plugin("AMap.Geolocation", (function () {
            this._geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 15000,
                buttonOffset: new AMap.Pixel(10, 20),
                zoomToAccuracy: true,
                buttonPosition: "RB"
            });
            map.addControl(this._geolocation);
            AMap.event.addListener(this._geolocation, "complete", (function (data) {
            }).bind(this));
        }).bind(this));
        this.dom = dom;
    }
    WidgetLocationSelector.prototype.show = function () {
        this.dom.css({ "display": "block" });
        this._geolocation.getCurrentPosition();
        window.location.hash = "#map-wls";
        $(window).on("hashchange.wls", (function () {
            if (window.location.hash === "#search-wls") {
                this.dom.find(".map-wls").css({ "display": "none" });
            }
            else if (window.location.hash === "#map-wls") {
                this.dom.find(".map-wls").removeAttr("style");
                this.dom.find(".input-wls").trigger("blur");
            }
            else {
                this.hide();
            }
        }).bind(this));
    };
    WidgetLocationSelector.prototype.hide = function () {
        $(window).off("hashchange.wls");
        this.dom.removeAttr("style").find(".input-wls").trigger("blur");
    };
    WidgetLocationSelector.prototype.getNear = function (lat, lng) {
        clearTimeout(this._nearTimer);
        this._nearTimer = setTimeout((function () {
            if (!this.dom.find(".list-wls").hasClass("loading-wls")) {
                this.dom.find(".list-wls").addClass("loading-wls").html("<div class=\"loading-wls\">\u52A0\u8F7D\u4E2D...</div>").scrollTop(0);
            }
            $.ajax({ type: "GET", url: "//restapi.amap.com/v3/place/around?location=" + lng + "," + lat + "&s=rsv3&key=" + this._key + "&radius=1000&offset=20&types=%E5%B0%8F%E5%8C%BA,%E5%86%99%E5%AD%97%E6%A5%BC,%E5%AD%A6%E6%A0%A1&page=1&callback=?", dataType: "jsonp", success: (function (j) {
                    this.dom.find(".list-wls").removeClass("loading-wls").html("");
                    for (var _i = 0, _a = j.pois; _i < _a.length; _i++) {
                        var item = _a[_i];
                        this.dom.find(".list-wls").append("<div class=\"item-wls\" location=\"" + item.location + "\"><div class=\"title-wls\">" + item.name + "</div><div class=\"text-wls\">" + item.address + "</div></div>");
                    }
                    ModuleTouch.tap(this.dom.find(".list-wls > .item-wls"), (function (e) {
                        var node = $(e.currentTarget);
                        var location = node.attr("location").split(",");
                        this.onSelect(node.children(".title-wls").text(), node.children(".text-wls").text(), location[1], location[0]);
                        window.location.hash = "";
                        e.preventDefault();
                        return false;
                    }).bind(this));
                }).bind(this) });
        }).bind(this), 300);
    };
    WidgetLocationSelector.verison = "0.1";
    return WidgetLocationSelector;
}());
//# sourceMappingURL=location-selector.js.map