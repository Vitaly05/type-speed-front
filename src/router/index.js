import { createRouter, createWebHistory } from 'vue-router'
import TextListView from '../views/TextListView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: TextListView,
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/LoginView.vue'),
		},
		{
			path: '/registration',
			name: 'registration',
			component: () => import('../views/RegistrationView.vue'),
		},
		{
			path: '/my-texts',
			name: 'my-texts',
			component: () => import('../views/MyTextListView.vue'),
		},
	],
})

export default router
