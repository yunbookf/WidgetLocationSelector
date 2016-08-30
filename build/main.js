$(document).ready(function (e) {
    var wmls = new WidgetMobileLocationSelector({
        key: "4db6fd173aaa29c6a3cca2c5efbbda21"
    });
    $("#abc").on("click", function (e) {
        wmls.show();
        e.preventDefault();
        return false;
    });
});
//# sourceMappingURL=main.js.map