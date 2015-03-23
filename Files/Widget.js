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
  });

  $reveal_button.mousedown(function () {
    overwolf.windows.getCurrentWindow(function(result) {
      console.log("mousedown called");
      overwolf.windows.dragMove(result.window.id);
    });
  });
});
