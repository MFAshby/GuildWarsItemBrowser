// Everything has to use local storage, as inter-window communication is NOT
// provided by the overwolf API. Lame.
var item_tracker = {

  //API URLs.
  item_url_root: "https://api.guildwars2.com/v2/items/?ids=",

  price_url_root: "https://api.guildwars2.com/v2/commerce/prices?ids=",

  //Top level keys for local storage.
  tracked_items_key: "tracked_items_key",

  amending_notification_key: "amending_notification_key",

  // Functions for dealing with what items are in the tracker
  get_tracked_items: function() {
    var json_string = localStorage[this.tracked_items_key];
    var tracked_items = {};
    // Keys may not exist in local storage the first time the app starts
    if (typeof(json_string) !== 'undefined') {
       tracked_items = JSON.parse(json_string);
    }
    return tracked_items;
  },

  get_tracked_item: function(item_id) {
    var all_items = this.get_tracked_items();
    return all_items[item_id];
  },

  add_tracked_item: function(item_id, notification_setting) {
    var tracked_items = this.get_tracked_items();

    // Add key for this item_id
    tracked_items[item_id] = {};

    // Add the notification setting (if one was provided) as a property of that item ID.
    tracked_items[item_id].notification_setting = notification_setting;

    // Mash it all back to local storage.
    localStorage[this.tracked_items_key] = JSON.stringify(tracked_items);
  },

  remove_tracked_item: function(item_id) {
    var tracked_items = this.get_tracked_items();
    delete tracked_items[item_id];
    localStorage[this.tracked_items_key] = JSON.stringify(tracked_items);
  },

  // Functions for dealing with which item we're amending the notification settings for
  set_modify_notification: function(item_id) {
    localStorage[this.amending_notification_key] = item_id;
  },

  get_modify_notification: function() {
    return localStorage[this.amending_notification_key];
  },

  reg_changes: function(key, cb_function) {
    $(window).bind('storage', function(e) {
      console.log("storage change " + e.originalEvent.key);
      if (e.originalEvent.key === key)
        console.log("notifying");
        cb_function();
    });
  }
};
