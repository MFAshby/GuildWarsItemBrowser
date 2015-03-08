/**
 * Created by Martin on 03/03/2015.
 */

function add_browser($browser, callback) {
    // Useful URLs
    var search_url_root = "http://localhost:8080?search=";
    var item_url_root = "https://api.guildwars2.com/v2/items/?ids=";

    // Set up components
    var $form = $('<form></form>');
    var $searchLabel = $('<label for="item_live_search"></label>');
    var $itemLiveSearch = $('<input id="item_live_search" type="text" size="30" placeholder="Search for items">');
    var $browserResults = $('<ul id="browser_results"></ul>');
    var $browserClose = $('<div id="browser_close">x</div>');

    $form.append($searchLabel);
    $form.append($itemLiveSearch);
    $browser.append($form);
    $browser.append($browserResults);
    $browser.append($browserClose);

    function item_selected(link) {
        var item_id = $(link.currentTarget).attr("item_id");
        callback(item_id);
    }

    function add_item(item_data) {
        var item_id = item_data.id;
        var name = item_data.name;
        var icon_url = item_data.icon;

        var $li = $('<li class="browser_result"></li>');
        var $img = $('<img class="browser_result_image"/>');

        $li.attr("item_id", "" + item_id);
        $li.click(item_selected);
        $img.attr("src", icon_url);
        $li.append($img);
        $li.append(name);
        $browserResults.append($li);
    }

    function add_new_items(items_list) {
        var items_string = items_list.join(",");
        // Get the item details from the GW2 API
        $.get(item_url_root + items_string, function(items_data) {
            // Add an item to the browser results
            for (var i=0; i<items_data.length; i++) {
                var item_data = items_data[i];
                add_item(item_data);
            }
        });
    }

    $browserClose.click(function() {
        $browser.hide(150);
    });

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
}

$(document).ready(function() {

    function callback(item_id) {
        console.log(item_id);
    }

    add_browser($('#browser'), callback);
});
