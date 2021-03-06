$(document).ready(function() {
  var $notification_div = $('#notification_settings');
  var $buy_sell_select = $('#buy_sell_select');
  var $item_name = $('#notification_item_name');
  var $operator_select = $('#operator_select');
  var $ngold = $('#ngold');
  var $nsilver = $('#nsilver');
  var $ncopper = $('#ncopper');
  var $notification_save_button = $('#save');
  var $notification_delete_button = $('#delete');
  var $notification_close_button = $('#notification_settings_close_button');

  // Populated in the populate function.
  var item_id = -1;

  // Register callbacks
  $notification_close_button.click(close);
  $notification_delete_button.click(delete_notification);
  $notification_save_button.click(save_notification);

  // Register for storage changes
  item_tracker.reg_changes(item_tracker.amending_notification_key, populate);

  // Pre-populate
  populate();

  // Pre-populate with existing notification for this ID if one exists.
  function populate() {
    item_id = item_tracker.get_modify_notification();
    var existing_notification = item_tracker.get_tracked_item(item_id)["notification_setting"];
    if (typeof(existing_notification) !== 'undefined') {
      $buy_sell_select.val(existing_notification.buy_sell);
      $operator_select.val(existing_notification.operator);
      var price_obj = prices.split_price(existing_notification.price);
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

    // Also actually show the name of the item. That would help.
    $.get(item_tracker.item_url_root + item_id, function(item_data) {
      $item_name.text(item_data[0].name);
    });
  }

  function close() {
    overwolf.windows.getCurrentWindow(function (result) {
      overwolf.windows.close(result.window.id);
    });
  }

  function delete_notification() {
    // Add, but with no notification.
    item_tracker.add_tracked_item(item_id);
    close();
  }

  function save_notification() {
    var price = prices.unsplit_price($ngold.val(), $nsilver.val(), $ncopper.val());
    var notification_setting = {
      buy_sell: $buy_sell_select.val(),
      operator: $operator_select.val(),
      price: price
    };
    item_tracker.add_tracked_item(item_id, notification_setting);
    close();
  }
});
