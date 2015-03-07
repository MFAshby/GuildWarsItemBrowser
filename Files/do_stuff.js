/**
 * Created by Martin on 03/03/2015.
 */

$(document).ready(function(){
    // Useful URLs
    var search_url_root = "http://localhost:8080?search=";
    var item_url_root = "https://api.guildwars2.com/v2/items/";

    // Component handles
    var $itemLiveSearch = $("#item_live_search");
    var $browser = $("#browser");
    var $browserResults = $("#browser_results");
    var $browserClose = $("#browser_close");

    // Global list of tracked item IDs. Maybe save this in overwolf prefs or something?
    var tracked_item_ids = [];

    // Click functions
    $browserClose.click(function() {
        $browser.hide(150);
    });

    function toggle_tracked_item(link) {
        var item_id = $(link.currentTarget).attr("item_id");
        tracked_item_ids.push(item_id);
    }

    function add_new_items(items_list) {
        for (var i=0; i<items_list.length; i++ ) {
            var item_id = items_list[i];
            $.get(item_url_root + item_id, function(item_data) {
                // Add an item to the browser results
                var item_id = item_data.id;
                var name = item_data.name;
                var icon_url = item_data.icon;

                var $a = $("<a></a>");
                var $li = $("<li></li>");
                var $img = $("<img/>");

                $a.attr("item_id", "" + item_id);
                $a.click(toggle_tracked_item);
                $img.addClass("browser_result_image");
                $img.attr("src", icon_url);
                // Start of as display none, fade in after.
                $li.append($img);
                $li.append(name);
                $a.append($li);
                $browserResults.append($a);
            });
        }
    }

    var timer;
    $itemLiveSearch.keyup(function() {
        clearTimeout(timer);
        var search_text = $itemLiveSearch.val();
        timer = setTimeout(function() {
            var search_url = search_url_root + search_text;
            $.get(search_url, function(data) {
                var items_list = data;
                $browserResults.empty();
                add_new_items(items_list);
            });
        }, 200);
    });

    $(function() {

        $("#searchMe").keyup(function() {

        });
    });

    /*function handle_price_data(data) {
        // Parse the interesting info out of the data.
        $notificationPopin.text("Now selling for " + data.sells.unit_price);
        $notificationPopin.show(350);
    }

    // Start polling the GW2 API to see when the price changes
    (function poll() {
        setTimeout(function() {
            $.ajax({
                url: prices_url_root + "19684",
                success: handle_price_data,
                dataType: "json",
                complete: poll
            });
        }, 30000)
    })();*/
});


