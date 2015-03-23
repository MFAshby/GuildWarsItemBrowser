/**
 * Created by Martin on 08/03/2015.
 */

function price_tracker() {
    const tracked_items_key = "tracked_items";
    const notification_storage_key_prefix = "notification_item_id_";
    const price_url_root = "https://api.guildwars2.com/v2/commerce/prices?ids=";

    // Functions for storage
    function check_storage_version() {
        const storage_version_key = "tracked_items_version";
        const storage_version = "3";
        var local_storage_version = localStorage[storage_version_key];
        if (local_storage_version === storage_version) {
            return true;
        } else {
            localStorage.clear();
            localStorage[storage_version_key] = storage_version;
        }
    }

    function save_object_to_storage(key, object_array) {
        localStorage[key] = JSON.stringify(object_array);
    }

    function get_object_array_from_storage(key) {
        var object_array = [];
        var object_string = localStorage[key];
        if (check_storage_version() && object_string) {
            object_array = JSON.parse(object_string);
        }
        return object_array;
    }

    var tracked_items = get_object_array_from_storage(tracked_items_key);

    var notified_items = [];

    // Format prices using the coin icons
    function format_price(price){
        var price_obj = split_price(price);
        var $price_description = $('<span></span>');
        if (price_obj.ngold > 0) {
            $price_description.append("" + price_obj.ngold);
            $price_description.append($('<img src="Gold_coin.png"/>'));
        }
        if (price_obj.nsilver > 0) {
            $price_description.append("" + price_obj.nsilver);
            $price_description.append($('<img src="Silver_coin.png"/>'));
        }
        if (price_obj.ncopper > 0) {
            $price_description.append("" + price_obj.ncopper);
            $price_description.append($('<img src="Copper_coin.png"/>'));
        }
        if ($price_description.text() === "") {
            $price_description.text('No cost!');
        }
        return $price_description;
    }

    function split_price(price) {
        var ncopper = price % 100;
        var nsilver = Math.round(price / 100) % 100;
        var ngold = Math.round((price / 10000));
        return {ngold:ngold, nsilver:nsilver, ncopper: ncopper};
    }

    function unsplit_price(gold, silver, copper) {
        return (10000 * parseInt(gold)) + (100 * parseInt(silver)) + parseInt(copper);
    }

    var $item_browser = item_browser(browser_callback);
    var $notification_panel = $('<div id="notification_panel"></div>');
    var $notification_item_list = item_list(notified_list_callback, list_display_html_function);
    var $notify_close_button = $('<button class="tracker_button">Close</button>');
    var $body = $('body');


    $item_list_and_controls.hide();
    $item_browser.hide();

    $notification_panel.append($notify_close_button);
    $notification_panel.append($notification_item_list);
    $notification_panel.hide();

    $body.append($item_list_and_controls);
    $body.append($item_browser);
    $body.append($notification_panel);

    $notify_close_button.click(function() {
        notified_items = [];
        $notification_panel.hide(150);
    });

    // Add the browser
    function browser_callback($li, item_id) {
        console.log("browser_callback called");
        tracked_items.push(item_id);
        save_object_to_storage(tracked_items_key, tracked_items);
        $item_list.display_all_item_ids(tracked_items);
        $item_browser.hide(150);
    }

    function notification_list_item_html($li, item_data) {
        var notification_settings = get_object_array_from_storage(notification_storage_key_prefix + item_data.id);
        $li.append($('<span>' + item_data.name + ' has reached target ' + notification_settings.buy_sell + ' price of ' +
            format_price(notification_settings.price) + ' </span>'));
    }

    function show_notification(item_id, notification_setting) {
        // Check if we're already showing this item
        if (notified_items.indexOf(item_id) > -1) {
            return;
        }

        // Add to the list of notified items
        notified_items.push(item_id);

        // Show the notification list if required
        if (notified_items.length > 0) {
            if (!$notification_panel.is(':visible')) {
                $notification_panel.show(150);
            }

            // Display the list of items we're notifying for
            $notification_item_list.display_all_item_ids(notified_items);
        }
    }

    function handle_price_data(price_data_list) {
        for (var i=0; i<price_data_list.length; i++) {
            // Get the notification for this price data.
            var price_data = price_data_list[i];
            var item_id = price_data.id;

            // Got to check if it still exists.
            var notification_setting = get_object_array_from_storage(notification_storage_key_prefix + item_id);
            if (typeof(notification_setting) !== 'undefined'
                && notification_setting.hasOwnProperty('buy_sell')) {
                // Now notify if required.
                var buy_or_sell = notification_setting.buy_sell;
                var price = price_data[buy_or_sell].unit_price;
                var show = false;
                if (notification_setting.operator === "gt") {
                    show = price > notification_setting.price;
                } else {
                    show = price < notification_setting.price;
                }
                if (show) {
                    console.log("Going to notify");
                    show_notification(item_id, notification_setting);
                }
            }
        }
    }

    // Self-calling functions go last
    function rebuild_item_list(){
        $item_list.display_all_item_ids(tracked_items);
    }
    rebuild_item_list();

    // Start polling the GW2 API to see when the price changes
    (function poll() {
        setTimeout(function (){
            // Get IDs to poll for from storage
            var ids = "";
            for (var i=0; i<localStorage.length; i++) {
                var key = localStorage.key(i);
                if (key.indexOf(notification_storage_key_prefix) === 0) {
                    if (i > 0) {
                        ids += ",";
                    }
                    ids += key.substr(notification_storage_key_prefix.length);
                }
            }

            $.ajax({
                url: price_url_root + ids,
                timeout: 30000,
                success: handle_price_data,
                complete: poll
            });
        }, 3000);
    })();

    return $reveal_button;
}
