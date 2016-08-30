$(document).ready(function(e) {
    let wmls: WidgetMobileLocationSelector = new WidgetMobileLocationSelector({
        key: "4db6fd173aaa29c6a3cca2c5efbbda21"
    });
    $("#abc").on("click", function(e): boolean {
        wmls.show();
        e.preventDefault();
        return false;
    });
});

