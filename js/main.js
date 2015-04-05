
$(document).foundation();

//
function newNumbers() {
  var curGameLevel = Number(localStorage.getItem("peramid-level"));
  if (curGameLevel > 0) {
    curGameLevel += 1;
    $("#glevel").text(" - " + curGameLevel);
    localStorage.setItem("peramid-level", curGameLevel ); 
    $( "#level" ).val( curGameLevel ); //$( "#slider-range-max" ).slider( "value" )
    $( "#slider-range-max" ).slider( {value: curGameLevel} ) ;
    $('#s-level').attr('level', curGameLevel);
    curGameLevel = curGameLevel * 6;
  }
  else {
    localStorage.setItem("peramid-level", "1");      
    $( "#level" ).val( 1 );
    curGameLevel = 10;
  }
  for (var i = 1; i < 5; i++) {
    var tmpNo = Math.floor((Math.random() * curGameLevel) + 1);
    $("#l1-"+i).val(tmpNo);
  };

  console.log("== curGameLevel: "+ curGameLevel);
}

//
function cleanAll() {
 for (var i = 1; i < 4; i++) {
    var tmpNo = Math.floor((Math.random() * 10) + 1);
    $("#l2-"+i).val("");
    if (i < 3) {
      $("#l3-"+i).val("");
    }
  }
  $("#l4-1").val("");
}


//
// start the party 
//
$( document ).ready(function() {
  $( "#slider-range-max" ).slider({
    range: "min",
    min: 1,
    max: 50,
    value: 1,
    slide: function( event, ui ) {
      var newLevel = ui.value;
      $( "#level" ).val( newLevel );
      if ( !isNaN(newLevel)) {
          localStorage.setItem("peramid-level", newLevel);  
          newNumbers();
          cleanAll();
        }
        else {
          console.warn("Got newLevel: "+ newLevel + " something is not good dude!");
        }
    }
  });
  $( "#level" ).val( $( "#slider-range-max" ).slider( "value" ) );

  // Start with random numbers at the bottom
  newNumbers();

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

      // Are we done with this peramid?
      if (curLevel === 4) {
        var notEmptyFields = 0;
        $('input').each(function() {
          if ($(this).val() != "") {
            notEmptyFields++;
          }    
        });
        if (notEmptyFields > 9) {
          $(".tup").show();
          setTimeout(function() { 
            $(".tup").hide();
            cleanAll();
            newNumbers();
          }, 1500);  
        }
        
      }

    }
    else {
       $(this).css("background-color", "red");
    }
  });


  
});