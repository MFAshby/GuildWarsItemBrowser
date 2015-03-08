/**
 * Created by Martin on 08/03/2015.
 */

$(document).ready(function() {
    var price_url_root = "https://api.guildwars2.com/v2/commerce/prices?ids=";

    function format_price(price){
        var ncopper = price % 100;
        var nsilver = Math.round(price / 100) % 100;
        var ngold = Math.round((price / 10000));
        var $price_description = $('<span></span>');
        if (ngold > 0) {
            $price_description.append("" + ngold);
            $price_description.append($('<img src="Gold_coin.png"/>'));
        }
        if (nsilver > 0) {
            $price_description.append("" + nsilver);
            $price_description.append($('<img src="Silver_coin.png"/>'));
        }
        if (ncopper > 0) {
            $price_description.append("" + ncopper);
            $price_description.append($('<img src="Copper_coin.png"/>'));
        }
        if ($price_description.text() === "") {
            $price_description.text('No cost!');
        }
        return $price_description;
    }

    // A list of the item IDs that I'm currently tracking
    var tracked_items = [];

    // The div in which we show the tracked item list
    var $trackedItems = $('#tracked_items');
    var $addItemButton = $('<span class="add_item">Add item</span>');
    $trackedItems.append($addItemButton);

    // Add an item list for the currently tracked items
    function list_callback(item_id) {
        console.log("list_callback called");
        // Show option to remove the tracked item
        var $popup_remove = $('<div class="popup_remove">Remove this item</div>');
        $popup_remove.click(function() {
            $popup_remove.remove();
            var index = tracked_items.indexOf(item_id);
            if (index > -1) {
                tracked_items.splice(index, 1);
                $item_list.display_all_item_ids(tracked_items);
            }
        });
        $trackedItems.append($popup_remove);
    }
    // Display the name AND current cost of the item
    function list_display_html_function(item_data) {
        var name = item_data.name;
        var item_id = item_data.id;

        var $display_html = $('<span class="item_list_text"></span>');
        var $name_span = $('<span></span>');
        var $price_span = $('<span> Loading price...</span>');
        $.get(price_url_root + item_id, function(price_data) {
            var item_sells_cost = price_data[0].sells.unit_price;
            var item_buys_cost = price_data[0].buys.unit_price;
            $price_span.text('');
            $price_span.append($('<br/>'));
            $price_span.append('Buys for ');
            $price_span.append(format_price(item_buys_cost));
            $price_span.append($('<br/>'));
            $price_span.append('Sells for ');
            $price_span.append(format_price(item_sells_cost));
        });
        $name_span.text(name);
        $display_html.append($name_span);
        $display_html.append($price_span);
        return $display_html;
    }
    var $item_list = item_list(list_callback, list_display_html_function);
    $item_list.insertAfter($trackedItems);

    // Add the browser
    function browser_callback(item_id) {
        console.log("browser_callback called");
        tracked_items.push(item_id);
        $item_list.display_all_item_ids(tracked_items);
        $item_browser.hide(150);
    }
    var $item_browser = item_browser(browser_callback);
    $item_browser.insertAfter($item_list);
    $item_browser.hide();
    $addItemButton.click(function() {
        $item_browser.show_browser();
    });

    /*setTimeout(function() {
        $browser.show(150);
    }, 3000);*/

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