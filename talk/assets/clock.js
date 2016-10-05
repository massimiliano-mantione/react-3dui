function startTime () {
  var today = new Date()
  var h = today.getHours()
  var m = today.getMinutes()
  h = checkTime(h)
  m = checkTime(m)
  document.getElementById('clock').innerHTML = h + ' ' + m
  setTimeout(function () { startTime() }, 500)
}

function checkTime (i) {
  if (i < 10) {
    i = '0' + i
  }  // add zero in front of numbers < 10
  return i
}

function prepareClock () {
  var theme = document.getElementById('theme')
  theme.href = 'assets/style-fd.css'

  var clock = document.getElementById('clock')
  var bottomband = document.getElementById('bottomband')
  var body = clock.parentNode.parentNode.parentNode
  clock = clock.parentNode.removeChild(clock)
  if (bottomband !== null) {
    bottomband = bottomband.parentNode.removeChild(bottomband)
    bottomband.insertBefore(clock, bottomband.firstChild)
    body.appendChild(bottomband)
  } else {
    body.appendChild(clock)
  }
  startTime()
}
