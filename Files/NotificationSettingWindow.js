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
  var $notification_close_button = $('#close');

  function unsplit_price(gold, silver, copper) {
    return (10000 * parseInt(gold)) + (100 * parseInt(silver)) + parseInt(copper);
  }

  // Pre-populate with existing notification for this ID if one exists.
  var item_id = item_tracker.get_modify_notification();
  var existing_notification = item_tracker.get_notification(item_id);
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

  function close() {
    overwolf.windows.getCurrentWindow(function (result) {
      overwolf.windows.close(result.window.id);
    });
  }

  $notification_close_button.click(close);

  $notification_delete_button.click(function () {
    item_tracker.delete_notification(item_id);
    close();
  });
  $notification_save_button.click(function() {
    var price = unsplit_price($ngold.val(), $nsilver.val(), $ncopper.val());
    var notification = {
      buy_sell: $buy_sell_select.val(),
      operator: $operator_select.val(),
      price: price
    };
    item_tracker.set_notification(item_id, notification);
    close();
  });
});
