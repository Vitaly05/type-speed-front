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
			path: '/logout',
			name: 'logout',
			component: () => import('../views/LogoutView.vue'),
		},
		{
			path: '/registration',
			name: 'registration',
			component: () => import('../views/RegistrationView.vue'),
		},
		{
			path: '/reset-password',
			name: 'password-reset',
			component: () => import('../views/ResetPasswordView.vue'),
		},
		{
			path: '/my-texts',
			name: 'my-texts',
			component: () => import('../views/MyTextListView.vue'),
		},
		{
			path: '/text/:id',
			name: 'text',
			component: () => import('../views/TextView.vue'),
		},
		{
			path: '/rating',
			name: 'rating',
			component: () => import('../views/RatingView.vue'),
		},
		{
			path: '/:pathMatch(.*)*',
			name: '404',
			component: () => import('../views/NotFoundView.vue'),
		},
	],
})

export default router
