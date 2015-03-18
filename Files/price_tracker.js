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

    var $reveal_button = $('<div id="reveal_tracked_items">Prices</div>');
    var $item_list_and_controls = $('<div id="tracked_items_list"></div>');
    var $add_button = $('<button class="tracker_button">add</button>');
    var $close_button = $('<button class="tracker_button">close</button>');
    var $item_browser = item_browser(browser_callback);
    var $item_list = item_list(list_callback, list_display_html_function);
    var $notification_panel = $('<div id="notification_panel"></div>');
    var $notification_item_list = item_list(notified_list_callback, list_display_html_function);
    var $notify_close_button = $('<button class="tracker_button">Close</button>');
    var $body = $('body');

    $item_list_and_controls.append($add_button);
    $item_list_and_controls.append($close_button);
    $item_list_and_controls.append($item_list);
    $item_list_and_controls.hide();
    $item_browser.hide();

    $notification_panel.append($notify_close_button);
    $notification_panel.append($notification_item_list);
    $notification_panel.hide();

    $body.append($item_list_and_controls);
    $body.append($item_browser);
    $body.append($notification_panel);

    $reveal_button.hover(function(){
        $reveal_button.animate({left: "+=70px"});
    },function(){
        $reveal_button.animate({left: "-=70px"});
    });

    $reveal_button.click(function () {
        $item_list_and_controls.show(150);
    });

    $add_button.click(function(){
        $item_browser.show_browser();
    });

    $close_button.click(function() {
        $item_list_and_controls.hide(150);
    });

    $notify_close_button.click(function() {
        notified_items = [];
        $notification_panel.hide(150);
    });

    function list_callback($li, item_id) {
        // Show the buttons panel
        var $buttons_list = $li.$buttons_list;
        if ($buttons_list.is(':visible')) {
            $buttons_list.detach();
        } else {
            $buttons_list.insertAfter($li);
        }
    }

    function list_display_html_function($li, item_data) {
        var name = item_data.name;
        var item_id = item_data.id;

        var $display_html = $('<p class="item_list_text"></p>');
        var $name_span = $('<span></span>');
        var $price_span = $('<span><br/>Loading price...</span>');
        var $buttons_list = $('<li><ul></ul></li>');
        var $remove_button = $('<li class="item_change_list_item"><button class="item_change_button">remove</button></li>');
        var $set_price_button = $('<li class="item_change_list_item"><button class="item_change_button">notify</button></li>');

        $name_span.text(name);
        $buttons_list.append($remove_button);
        $buttons_list.append($set_price_button);
        $display_html.append($name_span);
        $display_html.append($price_span);

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
        // Callbacks for the buttons. They should hide the list
        $remove_button.click(function () {
            var index = tracked_items.indexOf("" + item_id);
            if (index > -1) {
                tracked_items.splice(index, 1);
                save_object_to_storage(tracked_items_key, tracked_items);
                rebuild_item_list();
            }
        });
        $set_price_button.click(function () {
            show_notification_settings($li, item_data);
        });

        // Keep a reference to this so we can manipulate it later
        $li.$buttons_list = $buttons_list;

        $li.append($display_html);
    }

    // Add the browser
    function browser_callback($li, item_id) {
        console.log("browser_callback called");
        tracked_items.push(item_id);
        save_object_to_storage(tracked_items_key, tracked_items);
        $item_list.display_all_item_ids(tracked_items);
        $item_browser.hide(150);
    }

    function show_notification_settings($li, item_data) {
        var $notification_div = $('<div class="notification_settings">Notify me when the ' +
        '<select id="buy_sell_select" class="notification_select">' +
        '<option value="buys">buy</option>' +
        '<option value="sells">sell</option>' +
        '</select>' +
        'price of ' + item_data.name +
        ' is ' +
        '<select id="operator_select" class="notification_select">' +
        '<option value="gt">greater than</option>' +
        '<option value="lt">less than</option>' +
        '</select>' +
        '<input id="ngold" class="notification_number_entry" type="number" min="0">' +
        '<img src="Gold_coin.png"/>' +
        '<input id="nsilver" class="notification_number_entry" type="number" min="0">' +
        '<img src="Silver_coin.png"/>' +
        '<input id="ncopper" class="notification_number_entry" type="number" min="0">' +
        '<img src="Copper_coin.png"/>' +
        '<button id="save" class="tracker_button">Save</button>' +
        '<button id="delete" class="tracker_button">Delete</button>' +
        '<button id="close" class="tracker_button">Close</button>' +
        '</div>');

        var $buy_sell_select = $notification_div.find('#buy_sell_select');
        var $operator_select = $notification_div.find('#operator_select');
        var $ngold = $notification_div.find('#ngold');
        var $nsilver = $notification_div.find('#nsilver');
        var $ncopper = $notification_div.find('#ncopper');
        var $notification_save_button = $notification_div.find('#save');
        var $notification_delete_button = $notification_div.find('#delete');
        var $notification_close_button = $notification_div.find('#close');

        // Pre-populate with existing notification for this ID if one exists.
        var key = notification_storage_key_prefix + item_data.id;
        var existing_notification = get_object_array_from_storage(key);
        if (existing_notification.hasOwnProperty("buy_sell")) {
            $buy_sell_select.val(existing_notification.buy_sell);
            $operator_select.val(existing_notification.operator);
            var price_obj = split_price(existing_notification.price);
            $ngold.val(price_obj.ngold);
            $nsilver.val(price_obj.nsilver);
            $ncopper.val(price_obj.ncopper);
        } else {
            $buy_sell_select.val("buy");
            $operator_select.val(">");
            $ngold.val("0");
            $nsilver.val("0");
            $ncopper.val("0");
        }

        $notification_close_button.click(function() {
            $notification_div.remove();
        });
        $notification_delete_button.click(function () {
            localStorage.removeItem(key);
            $notification_div.remove();
        });
        $notification_save_button.click(function() {
            var price = unsplit_price($ngold.val(), $nsilver.val(), $ncopper.val());
            var notification = {
                buy_sell: $buy_sell_select.val(),
                operator: $operator_select.val(),
                price: price
            };
            save_object_to_storage(key, notification);
            $notification_div.remove();
        });
        $body.append($notification_div);

        // Adjust the height so that the notification div appears below the item description
        var original_offset = $notification_div.offset();
        var li_height = $li.height();
        var li_offset = $li.offset();
        $notification_div.offset({top: li_offset.top + li_height, left: original_offset.left});
    }

    function notified_list_callback($li, item_id) {
        localStorage.removeItem(notification_storage_key_prefix + item_id);
        var ix = notified_items.indexOf(parseInt(item_id));
        if (ix > -1) {
            notified_items.splice(ix, 1);
        }
        if (notified_items.length) {
            $notification_item_list.display_all_item_ids(notified_items);
        } else {
            $notification_panel.hide(150);
        }
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