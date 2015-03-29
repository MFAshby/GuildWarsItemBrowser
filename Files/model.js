// Provides all the behind-the-scenes data for my lovely windows to show.
// Everything has to use local storage, as inter-window communication is NOT
// provided by the overwolf API. Lame.
var item_tracker = {

  get_tracked_items: function() {
    var json_string = localStorage["tracked_items"];
    return JSON.parse(json_string);
  },

  add_tracked_item: function(item_id) {
    var json_string = localStorage["tracked_items"];

    var tracked_items = [];
    if (typeof(json_string) !== 'undefined') {
       tracked_items = JSON.parse(json_string);
    }

    if ($.inArray(item_id, tracked_items) === -1) {
      console.log(item_id);
      console.log(tracked_items);
      tracked_items.push(item_id);
      localStorage["tracked_items"] = JSON.stringify(tracked_items);
    }
  },

  remove_tracked_item: function(item_id) {
    var json_string = localStorage["tracked_items"];
    var tracked_items = JSON.parse(json_string);

    var ix = $.inArray("" + item_id, tracked_items);
    console.log(tracked_items);
    console.log(item_id);
    console.log(ix);
    if (ix > -1) {
      tracked_items.splice(ix, 1);
      localStorage["tracked_items"] = JSON.stringify(tracked_items);
    }
  },

  // The item_id for which notifications are currently being modified
  set_modify_notification: function(item_id) {
    localStorage["current_notification_setting_mod"] = item_id;
  },
  get_modify_notification: function() {
    return localStorage["current_notification_setting_mod"];
  },

  get_all_notifications: function() {

  },

  get_notification: function(item_id) {
    var json_string = localStorage["notification_item_id_" + item_id];
    var notification_setting = {};
    if (json_string !== 'undefined') {
      notification_setting = JSON.parse(json_string);
    }
    return notification_setting;
  },

  set_notification: function(item_id, notification_setting) {
    localStorage["notification_item_id_" + item_id] = JSON.stringify(notification_setting);
  },

  delete_notification: function(item_id) {
    localStorage.removeItem("notification_item_id_" + item_id);
  },

  register_tracked_item_changes: function(cb_function) {
    $(window).bind('storage', function(e) {
      if (e.originalEvent.key === "tracked_items")
        cb_function();
    });
  },

  register_modify_notification_changes: function(cb_function) {
    $(window).bind('storage', function(e) {
      if (e.originalEvent.key === "current_notification_setting_mod")
        cb_function();
    });
  }
};
