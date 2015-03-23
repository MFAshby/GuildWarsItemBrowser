$(document).ready(function (){
  const price_url_root = "https://api.guildwars2.com/v2/commerce/prices?ids=";

  // Reference items in the HTML document
  var $item_list_and_controls = $('#tracked_items_list');
  var $add_button = $('#tracker_add_button');
  var $close_button = $('#tracker_close_button');

  // Register handlers
  $add_button.click(add_button_clicked);
  $close_button.click(close_button_clicked);

  item_tracker.register_storage_changes(rebuild_item_list);

  // Construct the item list (it's special)
  var $item_list = item_list(list_callback, list_display_html_function);
  $item_list_and_controls.append($item_list);

  // Handlers
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

  function list_callback($li, item_id) {
    // Show/hide the buttons panel
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
      console.log("REmove button");
      item_tracker.remove_tracked_item(item_id);
      rebuild_item_list();
    });
    $set_price_button.click(function () {
      // Set this as the notification to be modified
      item_tracker.set_modify_notification(item_id);
      // Now pop up the notification settings window.
      overwolf.windows.obtainDeclaredWindow("NotificationSettingWindow", function(result) {
        overwolf.windows.restore(result.window.id, function(result){});
      });
    });

    // Keep a reference to this so we can manipulate it later
    $li.$buttons_list = $buttons_list;
    $li.append($display_html);
  }

  function rebuild_item_list(){
    $item_list.display_all_item_ids(item_tracker.get_tracked_items());
  }
  rebuild_item_list();

  // Drawing prices etc.
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

  // Allow dragging this window to move it.
  $item_list_and_controls.mousedown(function () {
    overwolf.windows.getCurrentWindow(function(result) {
      overwolf.windows.dragMove(result.window.id);
    });
  });

});
