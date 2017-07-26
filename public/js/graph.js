var ctx = document.getElementById("myChart").getContext('2d')
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: 'upvotes',
      data: upvotesTotal,
      backgroundColor: [
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    },
      {
        label: 'downvotes',
        data: downvotesTotal,
        backgroundColor: [
          'rgba(255,99,132,1)'
        ],
        borderWidth: 1
      }],
    options: {
      scales: {
        yAxes: [{
          ticks: {
              beginAtZero:true
          }
        }]
      }
    }
  }
})
