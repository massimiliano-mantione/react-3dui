function outerElementScale (elementPosition) {
  if (elementPosition < 0) {
    return 1
  } else if (elementPosition >= 1) {
    return 0
  } else {
    return 1 - elementPosition
  }
}

function listElementScale (windowSize, windowPosition, elementIndex) {
  if (elementIndex < windowPosition) {
    return outerElementScale(windowPosition - elementIndex)
  } else {
    let windowEnd = windowPosition + (windowSize - 1)
    if (elementIndex >= windowEnd) {
      return outerElementScale(elementIndex - windowEnd)
    } else {
      return 1
    }
  }
}

module.exports = listElementScale
