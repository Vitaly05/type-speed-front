import axios from 'axios'

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		Accept: 'application/json',
	},
})

instance.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
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

export { apiRegister, apiLoginByEmail, apiLoginByName }
