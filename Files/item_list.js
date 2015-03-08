/**
 * Created by Martin on 08/03/2015.
 */

// Creates an item list
function item_list(callback_function, display_html_function) {

    display_html_function = typeof(display_html_function) !== 'undefined' ? display_html_function
        : function($li, item_data) {
        var $item_text = $('<p class="item_list_text"></p>');
        $item_text.text(item_data.name);
        $li.append($item_text);
    };
    console.log("item_list creation called");

    // Need to know the URL to hit to get item information for display
    var item_url_root = "https://api.guildwars2.com/v2/items/?ids=";

    // Create the HTML element
    var $item_list = $('<ul class="item_list"></ul>');
    var $loading_text = $('<span>Loading...</span>');

    // Assign the callback function
    $item_list.callback_function = callback_function;

    // When an item is selected, call the callback function

    $item_list.add_item = function(item_data) {
        console.log("add_item called");
        var item_id = item_data.id;
        var icon_url = item_data.icon;

        var $li = $('<li class="item_list_result"></li>');
        var $img = $('<img class="item_list_image"/>');

        $li.attr("item_id", "" + item_id);
        $li.click(function () {
            console.log("item_selected called");
            var item_id = $li.attr("item_id");
            callback_function($li, item_id);
        });

        $img.attr("src", icon_url);
        $li.append($img);
        display_html_function($li, item_data);
        $(this).append($li);
    };

    $item_list.display_all_item_ids = function (item_ids_list) {
        console.log("display_all_item_ids called");
        $item_list.empty();
        if (item_ids_list.length > 0) {
            $item_list.append($loading_text);
            console.log("showing loading indicator for item list");
            var items_string = item_ids_list.join(",");
            // Get the item details from the GW2 API
            $.get(item_url_root + items_string, function(items_data) {
                $item_list.empty();
                // Add an item to the browser results
                for (var i=0; i<items_data.length; i++) {
                    var item_data = items_data[i];
                    $item_list.add_item(item_data);
                }
            });
        }
    };

    return $item_list;
}