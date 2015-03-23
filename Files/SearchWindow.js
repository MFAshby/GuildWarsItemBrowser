/**
 * Created by Martin on 03/03/2015.
 */

$(document).ready(function() {

  // References to components we need
  var $browser = $('#browser');
  var $close = $('#browser_close');
  var $search = $('#browser_search');

  // Focus the search to start with
  $search.focus();

  overwolf.windows.getCurrentWindow(function (result) {

    var $results = item_list(item_selected);
    $browser.append($results);

    // Register events
    $search.keyup(search_keyup);
    $close.click(browser_close_clicked);

    // Handlers
    function item_selected($li, item_id) {
      item_tracker.add_tracked_item(item_id);
    }

    function browser_close_clicked() {
      overwolf.windows.getCurrentWindow(function (result) {
        overwolf.windows.close(result.window.id);
      });
    }

    var timer;
    function search_keyup() {
      clearTimeout(timer);
      var search_text = $search.val();
      timer = setTimeout(function() {
        if (search_text === "") {
          console.log("Empty search, clearing");
          $results.empty();
          return;
        }

        console.log("Calling search API");
        $results.append("Searching...");
        item_search(search_text, function(item_ids_list) {
          console.log("Search API call finished");
          $results.display_all_item_ids(item_ids_list);
        });
      }, 200);
    }
  });

  // Allow dragging this window to move it.
  $browser.mousedown(function () {
    overwolf.windows.getCurrentWindow(function(result) {
      overwolf.windows.dragMove(result.window.id);
    });
  });
});
