// navbar javascript
document.addEventListener('DOMContentLoaded', function () {

  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener('click', function () {

        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $("#navMenu").slideToggle("fast");
        $target.classList.toggle('is-active');
      });
    });
  }
});


$(document).ready(function() {
  var analyzedListTier = {default: 0};


  // event listener to add more input fields
  $(document).on("keyup", function() {
    var counter = $("form input").length;
    var addLogic = true;
    for (var i = 0; i < counter; i++) {
      if ($("#input" + i).val() === "") {
        addLogic = false;
      }
    }
    if (addLogic === true && counter < 10) {
      addInput(counter);
    }

    if (counter > 1) {
      removeInput(counter - 1);
    }
  });

  // function to add another input field
  var addInput = function(index) {
    $(".inputfield").append("<div class='field is-horizontal' id=field" + index + "></div>");
    $("#field" + index).append("<div class='field-label is-normal'></div>");
    $("#field" + index).children().append("<label class=label>Priority " + (index + 1) + "</label>").hide().fadeIn(800);

    $("#field" + index).append("<div class=field-body></div>");
    $("#field" + index).children(".field-body").append("<div class=field></div>");
    $("#field" + index).children(".field-body").children(".field").append("<div class=control id=control" + index + "></div>");
    $("#control" + index).append("<input class=input type=text name=entry" + index + " id=input" + index + ">").hide().fadeIn(800);
  };

  // event listener to remove extra input field
  var removeInput = function(index){
    $("#input" + index).on("keyup", function() {
      if ($("#input" + index).val() === "") {
        $("#field" + (index + 1)).fadeOut(800, function() {
          $(this).remove();
        });
      }
    });
  };


  // event listener to toggle between results
  $(".search").on("click", function() {
    $(".searchresult-container").fadeIn(800).css("display", "block");
    $(".analyzedresult-container").fadeOut(800).css("display", "none");
    $(".search").addClass("is-active");
    $(".analyze").removeClass("is-active");
  });


  $(".analyze").on("click", function() {
    $(".searchresult-container").fadeOut(800).css("display", "none");
    $(".analyzedresult-container").fadeIn(800).css("display", "block");
    $(".search").removeClass("is-active");
    $(".analyze").addClass("is-active");
  });


  // event listener for flash messages
  $(".delete").on("click", function() {
    $(".flash").fadeOut(800);
  });

  setTimeout(function() {
    $(".flash").fadeOut(800);
  }, 1500);


  // ajax request to handle delete request from anchor tags
  $(".delete-search").on("click", function(e) {
    var id = $(this).data("id");
    $("#" + id).fadeOut(800);

    $.ajax({
      url: '/delete/search/' + id,
      type: 'delete',
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log(data);
      }
    });
  });

  $(".delete-analyzed").on("click", function(e) {
    var id = $(this).data("id");
    $("#" + id).fadeOut(800);

    $.ajax({
      url: '/delete/analyzed/' + id,
      type: 'delete',
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log(data);
      }
    });
  });


  // toggling through analyzed results list
  var showDistance = function(tier) {
    switch(tier) {
      case 0:
        return "Nearest";
        break;
      case 1:
        return "Near";
        break;
      case 2:
        return "Far";
        break;
      case 3:
        return "Furthest";
        break;
    }
  };

  // back button
  $(".fa-rotate-90").on("click", function() {
    var id = $(this).data("arrow");
    // console.log(id);
    if (!id) {
      if (analyzedListTier.default > 0) {
        $(".tier" + analyzedListTier.default).addClass("nodisplay");
        $(".tier" + analyzedListTier.default).removeClass("grid-result");
        analyzedListTier.default -= 1;
        $(".tier" + analyzedListTier.default).addClass("grid-result");
        $(".tier" + analyzedListTier.default).removeClass("nodisplay");
      }
      // console.log(analyzedListTier.default);
      $(".tier").text(showDistance(analyzedListTier.default));
    } else {
      if (!analyzedListTier[id]) {
        analyzedListTier[id] = 0;
      }
      if (analyzedListTier[id] > 0) {
        $("#" + id + " .tier" + analyzedListTier[id]).addClass("nodisplay");
        $("#" + id + " .tier" + analyzedListTier[id]).removeClass("grid-result");
        analyzedListTier[id] -= 1;
        $("#" + id + " .tier" + analyzedListTier[id]).addClass("grid-result");
        $("#" + id + " .tier" + analyzedListTier[id]).removeClass("nodisplay");
      }
      console.log(analyzedListTier);
      $("#" + id + " .tier").text(showDistance(analyzedListTier[id]));
    }
  });

  // forward button
  $(".fa-rotate-270").on("click", function() {
    var id = $(this).data("arrow");
    // console.log(id);
    if (!id) {
      if (analyzedListTier.default < 3) {
        $(".tier" + analyzedListTier.default).addClass("nodisplay");
        $(".tier" + analyzedListTier.default).removeClass("grid-result");
        analyzedListTier.default += 1;
        $(".tier" + analyzedListTier.default).addClass("grid-result");
        $(".tier" + analyzedListTier.default).removeClass("nodisplay");
      }
      // console.log(analyzedListTier.default);
      $(".tier").text(showDistance(analyzedListTier.default));
    } else {
      if (!analyzedListTier[id]) {
        analyzedListTier[id] = 0;
      }
      if (analyzedListTier[id] < 3) {
        $("#" + id + " .tier" + analyzedListTier[id]).addClass("nodisplay");
        $("#" + id + " .tier" + analyzedListTier[id]).removeClass("grid-result");
        analyzedListTier[id] += 1;
        $("#" + id + " .tier" + analyzedListTier[id]).addClass("grid-result");
        $("#" + id + " .tier" + analyzedListTier[id]).removeClass("nodisplay");
      }
      console.log(analyzedListTier);
      $("#" + id + " .tier").text(showDistance(analyzedListTier[id]));
    }
  });
});