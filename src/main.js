import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import { MyPreset } from '@/assets/preset.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
	theme: {
		preset: MyPreset,
		options: {
			darkModeSelector: '.dark'
		}
	},
})

app.mount('#app')
