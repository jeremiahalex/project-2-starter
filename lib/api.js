// module.exports = {
//   geocoder: new google.maps.Geocoder(),
//   geocoding: {
//     initialize: () => {
//       var latlng = new google.maps.LatLng(-34.397, 150.644)
//       var mapOptions = {
//         zoom: 8,
//         center: latlng,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//       }
//       map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions)
//     }
//   },
//   codeAddress: (address) => {
//     geocoder.geocode({ 'address': address}, function (results, status) {
//       if (status == google.maps.GeocoderStatus.OK) {
//         map.setCenter(results[0].geometry.location)
//         var marker = new google.maps.Marker({
//           map: map,
//           position: results[0].geometry.location
//         })
//       } else {
//         alert('Geocode was not successful for the following reason: ' + status)
//       }
//     })
//   }
// }
