$(document).ready(function () {
  $(document).mousedown(function () {
    overwolf.windows.getCurrentWindow(function(result) {
      console.log("mousedown called");
      overwolf.windows.dragMove(result.window.id);
    });
  });
  console.log("MADE A FUKKEN CHANGE");
  console.log("MADE ANOTHER FUKKEN CHANGE");
});
