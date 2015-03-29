/**
 * Created by Martin on 03/03/2015.
 */

$(document).ready(function() {

  // References to components we need
  var $browser = $('#browser');
  var $close = $('#browser_close');
  var $search = $('#browser_search');
  var $results = $('#browser_results');

  // Focus the search to start with
  $search.focus();

  overwolf.windows.getCurrentWindow(function (result) {

    // Register events
    $search.keyup(search_keyup);
    $close.click(browser_close_clicked);

    // Handlers
    function item_selected(item_id) {
      console.log("Adding item id " + item_id);
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
        $results.empty();

        if (search_text === "") {
          return;
        }

        $results.append("Searching...");
        item_search(search_text, function(item_ids) {
          $results.empty();
          if (item_ids.length > 0) {
            var items_string = item_ids.join(",");
            $.get(item_tracker.item_url_root + items_string, function(items_data) {
              console.log(items_data[0]);
              $results.loadTemplate("SearchWindowItemTemplate.html", items_data, {
                complete: function() {
                  // Add callbacks for the list items
                  $('.item_list_result').click(function () {
                    var item_id = $(this).attr('id');
                    item_selected(item_id);
                  });
                }
              });
            });
          }
        });
      }, 200);
    };
  });
});
