// Useful script for debugging model.js without clicking through a load of shit.
// TODO maybe get a unit testing framework. Maybe.


// Clear before testing...
localStorage.clear();

// Check getting empty list.
var items = item_tracker.get_tracked_items();
items;

// Adding with no notification.
item_tracker.add_tracked_item(12345);
var items = item_tracker.get_tracked_items();
items;

// Adding with notification setting
item_tracker.add_tracked_item(9999, {buy_sell: "buy", price: 13343});
var items = item_tracker.get_tracked_items();
items;

item_tracker.get_tracked_item(9999);

// Remove
item_tracker.remove_tracked_item(12345);
var items = item_tracker.get_tracked_items();
items;


item_tracker.set_modify_notification(12345);
item_tracker.set_modify_notification(12346);
item_tracker.get_modify_notification(12345);
