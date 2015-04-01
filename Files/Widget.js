$(document).ready(function () {
  var $reveal_button = $('#reveal_tracked_items');

  $reveal_button.click(show_list_window);

  function show_list_window() {
    overwolf.windows.obtainDeclaredWindow("ListWindow", function(result) {
      overwolf.windows.restore(result.window.id, function(result){
        console.log(result);
      });
    });
  };

  // This window is always visible, so it's reponsible for checking prices and popping up the list window if anything hits a target.
  function handle_price(price_data) {
    try
    {
      var tracked_item = item_tracker.get_tracked_item(price_data.id);
      if (typeof(tracked_item) === 'undefined') {
        return false;
      }

      var notification_setting = tracked_item.notification_setting;
      if (typeof(notification_setting) === 'undefined'
       || !notification_setting.hasOwnProperty("buy_sell")) {
        return false;
      }

      var current_price = price_data[notification_setting.buy_sell].unit_price;
      var target_price = notification_setting.price;

      if ((notification_setting.operator === "gt" && current_price > target_price)
          || (notification_setting.operator === "lt" && current_price < target_price)) {
        notification_setting.notified = "notified";
        item_tracker.add_tracked_item(price_data.id, notification_setting);
        show_list_window();
      }
    } catch (err) {
      console.log(err);
    }
  }

  function check_prices() {
    var tracked_items = item_tracker.get_tracked_items();
    var tracked_item_ids = Object.keys(tracked_items);

    $.get(item_tracker.price_url_root + tracked_item_ids.join(","), function(prices_data) {
      prices_data.forEach(function (price_data) {
        handle_price(price_data);
      });
      setTimeout(check_prices, 15000);
    });
  }
  setTimeout(check_prices, 5000);
});
