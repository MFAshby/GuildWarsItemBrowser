$(document).ready(function (){
  const item_url_root = "https://api.guildwars2.com/v2/items/?ids=";
  const price_url_root = "https://api.guildwars2.com/v2/commerce/prices?ids=";

  // Reference items in the HTML document
  var $add_button = $('#tracker_add_button');
  var $close_button = $('#tracker_close_button');
  var $item_list = $('#tracked_items_list');

  // Register action handlers
  $add_button.click(add_button_clicked);
  $close_button.click(close_button_clicked);

  // Register data change handler
  item_tracker.register_tracked_item_changes(rebuild_item_list);

  // Handler functions
  function add_button_clicked() {
    overwolf.windows.obtainDeclaredWindow("SearchWindow", function(result) {
      overwolf.windows.restore(result.window.id, function(result){});
    });
  }

  function close_button_clicked() {
    overwolf.windows.getCurrentWindow(function (result) {
      overwolf.windows.close(result.window.id);
    });
  }

  function notify_item(item_id) {
    item_tracker.set_modify_notification(item_id);
    overwolf.windows.obtainDeclaredWindow("NotificationSettingWindow", function(result) {
      overwolf.windows.restore(result.window.id, function(result){});
    });
  }

  function rebuild_item_list(){
    var tracked_item_ids = item_tracker.get_tracked_items();

    // Clear down the existing list
    $item_list.empty();

    // Start loading indicator
    if (tracked_item_ids.length > 0) {
      $item_list.append($('<span>Loading...</span>'));
      var items_string = tracked_item_ids.join(",");

      // Get the item details from the GW2 API
      $.get(item_tracker.item_url_root + items_string, function(items_data) {

        // Get the price details from the GW2 API
        $.get(item_tracker.price_url_root + items_string, function(prices_data) {

          // Append the data together
          items_data.forEach(function (item_data) {
            var item_id = item_data.id;
            prices_data.forEach(function (price_data) {
              if (item_id === price_data.id) {
                item_data.buys_price = price_data.buys.unit_price;
                item_data.sells_price = price_data.sells.unit_price;
              }
            });
          });

          // Add the formatter for prices
          $.addTemplateFormatter("priceFormatter",  function(value, template) {
            return prices.format_price(value);
          });

          // Display the details using a template
          $item_list.empty();
          $item_list.loadTemplate("ListWindowItemTemplate.html", items_data, {
            // Set handlers for all the list items we just created
            complete: function() {
              $remove_button = $('.item_remove_button');
              $notify_button = $('.item_notify_button');
              $list_item = $('.item_list_result');

              $remove_button.click(function () {
                var item_id = $(this).attr('id');
                // Remove from local storage
                item_tracker.remove_tracked_item(item_id);
                rebuild_item_list();
              });

              $notify_button.click(function () {
                var item_id = $(this).attr('id');
                notify_item(item_id);
              });
            }
          });
        });
      });
    }
  }

  // Call this on page load
  rebuild_item_list();
});
