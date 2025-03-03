import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.js'

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		Accept: 'application/json',
	},
})

instance.interceptors.request.use(
	function (config) {
		const authStore = useAuthStore()

		if (authStore.isAuthenticated) {
			config.headers.Authorization = `Bearer ${authStore.accessToken}`
		}

		return config
	},
	function (error) {
		return Promise.reject(error)
	},
)

instance.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		if (error.response && error.response.status === 401) {
			const authStore = useAuthStore()
			authStore.clearAccessToken()
		}

		if (error.response && error.response.status === 422) {
			return Promise.resolve(error.response)
		}

		return Promise.reject(error)
	},
)

async function apiRegister({ email, name, password }) {
	try {
		const response = await instance.post('auth/register', {
			email: email,
			name: name,
			password: password,
		})

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiLoginByEmail({ email, password }) {
	try {
		const response = await instance.post('auth/login-email', {
			email: email,
			password: password,
		})

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiLoginByName({ name, password }) {
	try {
		const response = await instance.post('auth/login-name', {
			name: name,
			password: password,
		})

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiGetAllTexts({ page = 1 }) {
	try {
		const response = await instance.get(`text/all?page=${page}`)

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiGetMyTexts({ page = 1 }) {
	try {
		const response = await instance.get(`text/all-my?page=${page}`)

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiDeleteText({ id }) {
	try {
		const response = await instance.delete(`text/${id}/delete`)

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiCreateText({ title, text }) {
	try {
		const response = await instance.post(`text/create`, {
			title: title,
			text: text,
		})

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiEditText({ id, title, text }) {
	try {
		const response = await instance.post(`text/${id}/edit`, {
			title: title,
			text: text,
		})

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiGetText({ id }) {
	try {
		const response = await instance.get(`text/get/${id}`)

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiSaveTestResult({
	textId,
	secondsElapsed,
	mistakesCount,
	wordsPerMinute,
	symbolsPerMinute,
}) {
	try {
		const response = await instance.post('text-progress/save/', {
			text_id: textId,
			seconds_elapsed: secondsElapsed,
			mistakes_count: mistakesCount,
			words_per_minute: wordsPerMinute,
			symbols_per_minute: symbolsPerMinute,
		})

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiGetTopRating({ page = 1 }) {
	try {
		const response = await instance.get(`text-progress/top-rating?page=${page}`)

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiGetMyBestResult() {
	try {
		const response = await instance.get('text-progress/my-best-result')

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiGetTextProgresses({ textId, page = 1 }) {
	try {
		const response = await instance.get(
			`text-progress/my-progresses?text_id=${textId}&page=${page}`,
		)

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiSendResetCodeRequest({ email }) {
	try {
		const response = await instance.post('auth/send-reset-code', {
			email: email,
		})

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiConfirmResetCode({ email, code }) {
	try {
		const response = await instance.post('auth/confirm-reset-code', {
			email: email,
			code: code,
		})

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

async function apiResetPassword({ email, code, newPassword }) {
	try {
		const response = await instance.post('auth/reset-password', {
			email: email,
			code: code,
			password: newPassword,
		})

		return response.data
	} catch (e) {
		console.error(e.message)
	}
}

export {
	apiRegister,
	apiLoginByEmail,
	apiLoginByName,
	apiGetAllTexts,
	apiGetMyTexts,
	apiDeleteText,
	apiCreateText,
	apiEditText,
	apiGetText,
	apiSaveTestResult,
	apiGetTopRating,
	apiGetMyBestResult,
	apiGetTextProgresses,
	apiSendResetCodeRequest,
	apiConfirmResetCode,
	apiResetPassword,
}
