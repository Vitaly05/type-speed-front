function getFormattedTime(secondsCount) {
	const minutes = Math.floor(secondsCount / 60)
	const minutesString = getMinutesString(minutes)

	const seconds = secondsCount % 60
	const secondsString = getSecondsString(seconds)

	let values = []

	if (minutes > 0) {
		values.push(`${minutes} ${minutesString}`)
	}

	if (seconds > 0 || minutes <= 0) {
		values.push(`${seconds} ${secondsString}`)
	}

	return values.join(' ')
}

function getMinutesString(minutes) {
	switch (true) {
		case minutes === 1:
			return 'минута'
		case minutes >= 2 && minutes <= 4:
			return 'минуты'
		case minutes === 0:
		default:
			return 'минут'
	}
}

function getSecondsString(seconds) {
	switch (true) {
		case seconds === 1:
			return 'секунда'
		case seconds >= 2 && seconds <= 4:
			return 'секунды'
		case seconds === 0:
		default:
			return 'секунд'
	}
}

export { getFormattedTime, getMinutesString, getSecondsString }
