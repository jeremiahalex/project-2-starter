
$(function () {
  const $searchInput = $('#searchInput')
  const $searchResults = $('#searchResults')
  const $searchGigs = $('#searchGigs')
  const $searchGigsResults = $('#searchGigsResults')

  const $deleteForm = $('.deleteForm')
  $deleteForm.on('submit', function (e) {
    e.preventDefault()

    var form = $(this)
    var formData = form.serializeArray()
    var userId = formData[0].value
    var json = JSON.stringify({
      userId
    })

    console.log(`delete this user ${userId}`)
    console.log(json)

    fetch('/deleteUser', {
      method: 'DELETE',
      body: json,
      headers: {
        'Content-Type': 'application/json'
      }
    })
     .then(json => {
       console.log('manipulate the dom now')
       form.parents('.col-4').remove()
       /* below's redirection is not a good approach.
       This needs to be backend but res.redirect don't work.
      Temporary fix */
       window.location.href = '/'
     })
  })

  $searchInput.on('keyup', e => { // e is the event object of the keyup event
    $('#allPeople').remove()
    var keyword = e.target.value
    var json = JSON.stringify({
      keyword
    })

    fetch('/peeps', {
      method: 'POST',
      body: json,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json()) // convert the json file into js object
    .then(showPeeps) // at this point we got the data
    .catch(err => console.log(err))
  })

  function showPeeps (data) {
    let allUsers = data.map(user => {
      const $newCol = $('<div class="col-4">')
      const $newCard = $('<div class="card">')
      const $newCardBody = $('<div class="card-body">')
      const $newCardTitle = $('<h4 class="card-title">')
      const $newCardText = $('<p class="card-text">')
      const $newCardLinks = $(`<form
        class="form-inline"
        action="/profile/${user.slug}/settings?_method=DELETE"
        method="post"
        >`)

      $newCardTitle.text(user.name)
      $newCardText.html(
        `${user.profile[0].skills}
        `
      )

      $newCardBody.append($newCardTitle, $newCardText)

      $newCard.append($newCardBody)
      $newCol.append($newCard)
      return $newCol
    })

    $searchResults.html('')
    $searchResults.append(allUsers)
  }

/* Search Gigs Section */

  $searchGigs.on('keyup', g => { // e is the event object of the keyup event
    $('#allGigCards').remove()
    var keyword = g.target.value
    var json = JSON.stringify({
      keyword
    })

    fetch('/', {
      method: 'POST',
      body: json,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  .then(response => response.json())
  // convert the json file into js object
  .then(showGigs) // at this point we got the data
  .catch(err => console.log(err))
  })

  function showGigs (data) {
    console.log(data)
    let allGigs = data.map(gig => {
      const $newCol = $('<div class="col-4">')
      const $newCard = $('<div class="card">')
      const $newCardBody = $('<div class="card-body">')
      const $newCardTitle = $('<h4 class="card-title">')
      const $newCardText = $('<p class="card-text">')

      $newCardTitle.text(gig.name)
      $newCardText.html(
      `${gig.wage} ${gig.author}
      `
    )

      $newCardBody.append($newCardTitle, $newCardText)

      $newCard.append($newCardBody)
      $newCol.append($newCard)
      return $newCol
    })

    $searchGigsResults.html('')
    $searchGigsResults.append(allGigs)
  }

// ===== userSkills =====//

  $('#selectSkills').on('change', (e) => {
    // get previous value first
    var prev = $('#skills').val()
    console.log(prev)
    // get new added value
    var str = $('#selectSkills :selected').text()
    // userSkills.push($('#selectSkills :selected').text())
    var newValue = prev ? `${prev}, ${str}` : `${str}`
    $('#skills').attr('value', newValue)
  })

  $('#selectGigSkills').on('change', (e) => {
    // get previous value first
    var prev = $('#gigSkills').val()
    console.log(prev)
    // get new added value
    var str = $('#selectGigSkills :selected').text()
    // userSkills.push($('#selectSkills :selected').text())
    var newValue = prev ? `${prev}, ${str}` : `${str}`
    $('#gigSkills').attr('value', newValue)
  })
})
