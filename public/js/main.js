$(document).ready(function() {

  // express messages delay and disappear
  $('#messages').ready(function() {
    $('#messages').delay(5000).fadeOut();
  });


  // css select
  $('select').material_select();


  // css modal
  $('.modal').modal();


  // trigger for textarea
  $('#review').trigger('autoresize');


  // google maps autocomplete
  function initialize() {
    let options = {
      componentRestrictions: {
        country: 'sg'
      }
    };
    let input = document.getElementById('location');
    let autocomplete = new google.maps.places.Autocomplete(input, options);
  }
  google.maps.event.addDomListener(window, 'load', initialize);


  // delete for bookmark
  $('.delete-bookmark').on('click', function(e) {
    e.preventDefault();

    $.ajax({
      url: $(this).attr('href'),
      type: 'DELETE',
      success: function(data) {
        window.location.reload();
      },
      error: function(err) {
        if (err) throw err;
      }
    });
  });


  // delete for review
  $('.delete-review').on('click', function(e) {
    e.preventDefault();

    $.ajax({
      url: $(this).attr('href'),
      type: 'DELETE',
      success: function(data) {
        window.location.href = '/';
      },
      error: function(err) {
        if (err) throw err;
      }
    });
  });


  //write comments
  $('#comment-form').on('submit', function(e) {
    e.preventDefault();
    let field = $(this).serializeArray();
    let username = field[0].value;
    let comment = field[1].value;

    $.ajax({
      url: $(this).attr('action'),
      type: 'POST',
      data: {
        username: username,
        comment: comment
      },
      success: function(data) {
        window.location.reload();
      },
      error: function(err) {
        if (err) throw err;
      }
    });
  });


  // delete for comments
  $('.delete-comment').on('click', function(e) {
    e.preventDefault();

    $.ajax({
      url: $(this).attr('href'),
      type: 'DELETE',
      success: function(data) {
        window.location.reload();
      },
      error: function(err) {
        if (err) throw err;
      }
    });
  });


// remove error messages
$('#errors').on('click', 'i', function() {
  $(this).parent().remove();
});



  // end of document ready
});
