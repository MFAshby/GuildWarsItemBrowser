$(document).ready(function () {
  var $reveal_button = $('#reveal_tracked_items');

  $reveal_button.click(function () {
    // Show the items list window
    console.log("Reveal clicked");
    overwolf.windows.obtainDeclaredWindow("ListWindow", function(result) {
      overwolf.windows.restore(result.window.id, function(result){
        console.log(result);
      });
    });
  })
});
