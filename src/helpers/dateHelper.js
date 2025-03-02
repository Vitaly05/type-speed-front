const options = {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	hour12: false,
}

function getFormattedDate(utcDate) {
	const date = new Date(utcDate)

	return date.toLocaleString('ru-RU', options)
}

export { getFormattedDate }
