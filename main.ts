$(document).ready(function(e) {
    let wls: WidgetLocationSelector = new WidgetLocationSelector({
        key: "4db6fd173aaa29c6a3cca2c5efbbda21"
    });
    ModuleTouch.tap("#abc", function(e: JQueryEventObject): boolean {
        wls.show();
        e.preventDefault();
        return false;
    });
});

