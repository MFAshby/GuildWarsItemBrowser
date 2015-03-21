function item_search(query, callback) {
  // Open a connection to the database.
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/home/martin/workspace/GuildWarsItemBrowser/Files/items.db', true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    var uInt8Array = new Uint8Array(this.response);
    var db = new SQL.Database(uInt8Array);
    var stmt = db.prepare("SELECT id FROM items_search\
                            WHERE items_search MATCH ?\
                            LIMIT 5", [query]);
    var results = [];
    while (stmt.step()) {
        var item_id = stmt.get()[0];
        results.push(item_id);
    }

    // free the memory used by the statement
    stmt.free();

    console.log("Closing");

    db.close();

    callback(results);
  };
  xhr.send();
}
