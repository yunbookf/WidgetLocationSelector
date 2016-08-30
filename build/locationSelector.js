var scriptBaseSrc = $("script").last().attr("src");
var scriptBaseSrcIndexOf = scriptBaseSrc.indexOf("/");
if (scriptBaseSrcIndexOf !== -1)
    scriptBaseSrc = scriptBaseSrc.substring(0, scriptBaseSrc.indexOf("/") + 1);
else
    scriptBaseSrc = "";
var WidgetMobileLocationSelector = (function () {
    function WidgetMobileLocationSelector(opts) {
        this.city = "";
        this._inputTimer = 0;
        this._nearTimer = 0;
        this.onSelect = function () { };
        var dom = $("<div class=\"widgetMobileLocationSelector\">\n            <div class=\"mapPage_WMLS\">\n                <div class=\"title_WMLS\">\n                    <input class=\"input_WMLS\" placeholder=\"\u8BF7\u8F93\u5165\u5C0F\u533A/\u5927\u53A6/\u5B66\u6821\u7B49\u8FDB\u884C\u641C\u7D22\">\n                </div>\n                <div class=\"map_WMLS\"><div class=\"marker_WMLS\"></div></div>\n                <div class=\"list_WMLS\"></div>\n            </div>\n        </div>");
        $("body").append(dom);
        this._key = opts.key;
        this._path = scriptBaseSrc;
        var map = new AMap.Map(dom.find(".map_WMLS")[0]);
        dom.find(".input_WMLS").on("touchend focus", function () {
            if (window.location.hash === "#map_WMLS") {
                window.location.hash = "#search_WMLS";
                dom.find(".list_WMLS").scrollTop(0);
            }
        }).on("input", (function () {
            clearTimeout(this._inputTimer);
            this._inputTimer = setTimeout((function () {
                $.ajax({ type: "GET", url: "http://restapi.amap.com/v3/assistant/inputtips?s=rsv3&key=" + this._key + "&platform=JS&keywords=" + encodeURIComponent(dom.find(".input_WMLS").val()) + "&city=" + encodeURIComponent(this.city) + "&callback=?", dataType: "jsonp", success: (function (j) {
                        this.dom.find(".list_WMLS").html("").scrollTop(0);
                        for (var _i = 0, _a = j.tips; _i < _a.length; _i++) {
                            var item = _a[_i];
                            this.dom.find(".list_WMLS").append("<div class=\"item_WMLS\" location=\"" + item.location + "\"><div class=\"title_WMLS\">" + item.name + "</div><div class=\"text_WMLS\">" + item.address + "</div></div>");
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
        dom.find(".list_WMLS").on("click", ".item_WMLS", (function (e) {
            var node = $(e.currentTarget);
            var location = node.attr("location").split(",");
            this.onSelect(node.children(".title_WMLS").text(), node.children(".text_WMLS").text(), location[1], location[0]);
            window.location.hash = "";
        }).bind(this));
        this.dom = dom;
    }
    WidgetMobileLocationSelector.prototype.show = function () {
        this.dom.css({ "display": "block" });
        this._geolocation.getCurrentPosition();
        window.location.hash = "#map_WMLS";
        $(window).on("hashchange.wmls", (function () {
            if (window.location.hash === "#search_WMLS") {
                this.dom.find(".map_WMLS").css({ "display": "none" });
            }
            else if (window.location.hash === "#map_WMLS") {
                this.dom.find(".map_WMLS").removeAttr("style");
                this.dom.find(".input_WMLS").trigger("blur");
            }
            else {
                this.hide();
            }
        }).bind(this));
    };
    WidgetMobileLocationSelector.prototype.hide = function () {
        $(window).off("hashchange.wmls");
        this.dom.removeAttr("style").find(".input_WMLS").trigger("blur");
    };
    WidgetMobileLocationSelector.prototype.getNear = function (lat, lng) {
        clearTimeout(this._nearTimer);
        this._nearTimer = setTimeout((function () {
            $.ajax({ type: "GET", url: "http://restapi.amap.com/v3/place/around?location=" + lng + "," + lat + "&s=rsv3&key=" + this._key + "&radius=1000&offset=20&types=%E5%B0%8F%E5%8C%BA,%E5%86%99%E5%AD%97%E6%A5%BC,%E5%AD%A6%E6%A0%A1&page=1&callback=?", dataType: "jsonp", success: (function (j) {
                    this.dom.find(".list_WMLS").html("").scrollTop(0);
                    for (var _i = 0, _a = j.pois; _i < _a.length; _i++) {
                        var item = _a[_i];
                        this.dom.find(".list_WMLS").append("<div class=\"item_WMLS\" location=\"" + item.location + "\"><div class=\"title_WMLS\">" + item.name + "</div><div class=\"text_WMLS\">" + item.address + "</div></div>");
                    }
                }).bind(this) });
        }).bind(this), 300);
    };
    WidgetMobileLocationSelector.verison = "0.1";
    return WidgetMobileLocationSelector;
}());
//# sourceMappingURL=locationSelector.js.map