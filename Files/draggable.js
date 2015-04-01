$(document).ready(function () {
  $(document).mousedown(function () {
    overwolf.windows.getCurrentWindow(function(result) {
      console.log("mousedown called");
      overwolf.windows.dragMove(result.window.id);
    });
  });

  $resize_grip = $('.resize_grip');
  if ($resize_grip) {
    $resize_grip.mousedown(function () {
      overwolf.windows.getCurrentWindow(function(result){
        if (result.status=="success"){
          overwolf.windows.dragResize(result.window.id, 'BottomRight');
        }
      });
    });
  }
});
