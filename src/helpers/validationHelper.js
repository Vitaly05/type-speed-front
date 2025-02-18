const validationMessages = {
	required: 'Это поле является обязательным.',
	minMaxLength: (min, max) => `Поле должно содержать от ${min} до ${max} символов.`,
	invalidEmail: 'Неправильный формат почты.',
	invalidCharacters: 'Вы ввели недопустимые символы.',
}

const usernameRegex = /^[A-Za-zА-Яа-я0-9_-]+$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?]+$/
const textTitleRegex = /^[a-zA-Zа-яА-Я0-9\s'-]+$/
const textTextRegex = /^[a-zA-Zа-яА-Я0-9\s.,!?:;]+$/
const textTextInvalidSymbolsRegex = /[^a-zA-Zа-яА-Я0-9\s.,!?:;]/g

function validateUsername(value) {
	if (!value.length) {
		return validationMessages.required
	}

	if (!usernameRegex.test(value)) {
		return validationMessages.invalidCharacters
	}

	if (value.length < 4 || value.length > 15) {
		return validationMessages.minMaxLength(4, 15)
	}

	return null
}

function validateEmail(value) {
	if (!value.length) {
		return validationMessages.required
	}

	if (!emailRegex.test(value)) {
		return validationMessages.invalidEmail
	}

	return null
}

function validatePassword(value) {
	if (!value.length) {
		return validationMessages.required
	}

	if (!passwordRegex.test(value)) {
		return validationMessages.invalidCharacters
	}

	if (value.length < 6 || value.length > 30) {
		return validationMessages.minMaxLength(6, 30)
	}

	return null
}

function validateTextTitle(value) {
	if (!value.length) {
		return validationMessages.required
	}

	if (!textTitleRegex.test(value)) {
		return validationMessages.invalidCharacters
	}

	if (value.length < 4 || value.length > 255) {
		return validationMessages.minMaxLength(4, 255)
	}

	return null
}

function validateTextText(value) {
	if (!value.length) {
		return validationMessages.required
	}

	if (!textTextRegex.test(value)) {
		return validationMessages.invalidCharacters
	}

	if (value.length < 20 || value.length > 65535) {
		return validationMessages.minMaxLength(20, 65535)
	}

	return null
}

export {
	validationMessages,
	textTextInvalidSymbolsRegex,
	validateUsername,
	validateEmail,
	validatePassword,
	validateTextTitle,
	validateTextText,
}
