import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import { MyPreset } from '@/assets/preset.js'
import { ConfirmationService, ToastService } from 'primevue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
	theme: {
		preset: MyPreset,
		options: {
			darkModeSelector: '.dark',
		},
	},
})
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
