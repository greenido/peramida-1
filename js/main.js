$(document).foundation();

//
// start the party 
//
$( document ).ready(function() {
  
  // start with random numbers at the bottom
  for (var i = 1; i < 5; i++) {
    var tmpNo = Math.floor((Math.random() * 10) + 1);
    $("#l1-"+i).val(tmpNo);
  };

  // lets have only numners as answers
  $("input").keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
         // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) || 
         // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
             // let it happen, don't do anything
             return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
  });



  // calculate if it's the correct answer
  $("input").on("blur", function(){
    //
    var curId = $(this).attr('id');
    var curVal = Number($(this).val());
    console.log("A new answer on id: " + curId + " val:" + curVal);
    var curLevel = Number(curId.substring(1,2));
    var curCell  = Number(curId.substring(3));  
    console.log("level: " + curLevel + " cell:" + curCell);

    var isCorrect = false;
    var cellLeftId  = "#l" + (curLevel-1) + "-" + curCell;
    var cellRightId = "#l" + (curLevel-1) + "-" + (1 + curCell );
    var cellLeft = Number($(cellLeftId).val());
    var cellRight = Number($(cellRightId).val());
    if (curVal === cellLeft + cellRight ) {
      //
      $("#malert").show();
      setTimeout(function() { 
        $("#malert").hide();
      }, 1500);

      $(this).css("background-color", "white");
    }
    else {
       $(this).css("background-color", "red");
    }
  });


  
});