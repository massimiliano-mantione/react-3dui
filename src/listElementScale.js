function outerElementScale (elementIndex) {
  if (elementIndex < 0) {
    return 1
  } else if (elementIndex >= 3) {
    return 0
  } else {
    return 0.5 - (elementIndex / 6)
  }
}

function listElementScale (windowSize, windowPosition, elementIndex) {
  if (elementIndex < windowPosition) {
    return outerElementScale(windowPosition - elementIndex)
  } else if (elementIndex >= windowPosition + windowSize) {
    return outerElementScale(elementIndex - (windowPosition + windowSize))
  } else {
    return 1
  }
}

module.exports = listElementScale
