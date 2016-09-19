$(document).ready(function (e) {
    var wls = new WidgetLocationSelector({
        key: "4db6fd173aaa29c6a3cca2c5efbbda21"
    });
    ModuleTouch.tap("#abc", function (e) {
        wls.show();
        e.preventDefault();
        return false;
    });
});
//# sourceMappingURL=main.js.map