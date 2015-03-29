function item_search(query, callback) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', './items.db', true);
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
    stmt.free();
    db.close();
    callback(results);
  };
  xhr.send();
}
