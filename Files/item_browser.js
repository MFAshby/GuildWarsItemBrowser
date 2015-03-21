/**
 * Created by Martin on 03/03/2015.
 */

function item_browser(browser_callback) {

    // Set up components
    var $browser = $('<div id="browser" class="browser_element"></div>');
    var $search = $('<input id="browser_search" class="browser_element" type="text" size="30" placeholder="Search for items" autocomplete="off">');
    var $results = item_list(browser_callback);
    var $close = $('<div id="browser_close" class="browser_element">x</div>');

    //$form.append($itemLiveSearch);
    $browser.append($search);
    $browser.append($close);
    $browser.append($results);


    $browser.show_browser = function() {
        $browser.show(150);
        $search.focus();
    };

    $close.click(function() {
        $browser.hide(150);
    });

    // On timeout, get results from the search API, and pass them to the item list.
    var timer;
    $search.keyup(function() {
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
    });

    return $browser;
}
