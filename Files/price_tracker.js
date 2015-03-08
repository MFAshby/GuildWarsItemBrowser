/**
 * Created by Martin on 08/03/2015.
 */

function price_tracker() {
    const tracked_items_key = "tracked_items";
    const price_url_root = "https://api.guildwars2.com/v2/commerce/prices?ids=";

    // A list of the item IDs that I'm currently tracking
    function get_tracked_from_storage() {
        const tracked_items_version_key = "tracked_items_version";
        const tracked_items_version = "2";

        var tracked_items = [];
        var local_tracked_items_version = localStorage[tracked_items_version_key];
        var tracked_items_string = localStorage[tracked_items_key];
        if ((local_tracked_items_version === tracked_items_version)
            && tracked_items_string) {
            tracked_items = JSON.parse(tracked_items_string);
            console.log("got " + tracked_items.length + " stored tracked items");
        } else {
            localStorage[tracked_items_version_key] = tracked_items_version;
        }
        return tracked_items;
    }

    function save_tracked_items_to_storage(tracked_items) {
        localStorage[tracked_items_key] = JSON.stringify(tracked_items);
    }

    var tracked_items = get_tracked_from_storage();

    // Format prices using the coin icons
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

    // A tab at the side of the screen to reveal the price tracker
    var $reveal_button = $('<div id="reveal_tracked_items">Prices</div>');
    var $item_list_and_controls = $('<div id="tracked_items_list"></div>');
    var $add_button = $('<button class="tracker_button">add</button>');
    var $close_button = $('<button class="tracker_button">close</button>');
    var $item_browser = item_browser(browser_callback);
    var $item_list = item_list(list_callback, list_display_html_function);
    var $body = $('body');

    $item_list_and_controls.append($add_button);
    $item_list_and_controls.append($close_button);
    $item_list_and_controls.append($item_list);
    $item_list_and_controls.hide();
    $item_browser.hide();

    $body.append($item_list_and_controls);
    $body.append($item_browser);

    $reveal_button.hover(function(){
        $reveal_button.animate({left: "+=70px"});
    },function(){
        $reveal_button.animate({left: "-=70px"});
    });

    $reveal_button.click(function () {
        $item_list_and_controls.show(150);
    });

    // Buttons for adding/removing from the list
    $add_button.click(function(){
        $item_browser.show_browser();
    });

    $close_button.click(function() {
        $item_list_and_controls.hide(150);
    });

    function rebuild_item_list(){
        $item_list.display_all_item_ids(tracked_items);
    }
    // Call it once it's defined.
    rebuild_item_list();

    // Add an item list for the currently tracked items
    function list_callback($li, item_id) {
        // Show the buttons panel
        var $buttons_list = $li.$buttons_list;
        if ($buttons_list.is(':visible')) {
            $buttons_list.detach();
        } else {
            $buttons_list.insertAfter($li);
        }
    }

    // Display the name AND current cost of the item
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
                save_tracked_items_to_storage(tracked_items);
                rebuild_item_list();
            }
        });
        $set_price_button.click(function () {

        });

        // Keep a reference to this so we can manipulate it later
        $li.$buttons_list = $buttons_list;

        $li.append($display_html);
    }

    // Add the browser
    function browser_callback($li, item_id) {
        console.log("browser_callback called");
        tracked_items.push(item_id);
        save_tracked_items_to_storage(tracked_items);
        $item_list.display_all_item_ids(tracked_items);
        $item_browser.hide(150);
    }

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

    return $reveal_button;
}