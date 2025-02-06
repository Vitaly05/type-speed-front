import axios from 'axios'

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		Accept: 'application/json',
	},
})

async function fetchTest() {
	try {
		const response = await instance.get('test')

		console.log(response.data)
	} catch (e) {
		console.error(e.message)
	}
}

export { fetchTest }
