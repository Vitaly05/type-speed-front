<template>
	<header
		class="container bg-primary p-8 flex justify-between items-center border-b border-orange-50"
	>
		<div>
			<RouterLink to="/">
				<LogoIcon />
			</RouterLink>
		</div>

		<div class="flex gap-4">
			<RouterLink :to="{ name: 'home' }" class="link">Список текстов</RouterLink>

			<RouterLink :to="{ name: 'my-texts' }" class="link">Мои текста</RouterLink>

			<RouterLink :to="{ name: 'rating' }" class="link">Рейтинг пользователей</RouterLink>
		</div>

		<div v-if="authStore.isAuthenticated">
			<Button label="Выйти" severity="secondary" as="div" @click="logout" />
		</div>

		<div v-else class="flex gap-2">
			<Button
				label="Зарегистрироваться"
				severity="secondary"
				as="router-link"
				:to="{ name: 'registration' }"
			/>

			<Button label="Войти" as="router-link" :to="{ name: 'login' }" />
		</div>
	</header>
</template>

<script setup>
import { Button, useConfirm } from 'primevue'
import LogoIcon from '@/components/icons/LogoIcon.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'

const confirm = useConfirm()
const router = useRouter()
const authStore = useAuthStore()

const logout = (e) => {
	confirm.require({
		target: e.currentTarget,
		message: 'Вы уверены, что хотите выйти из аккаунта?',
		icon: 'pi pi-exclamation-triangle',
		rejectProps: {
			label: 'Отмена',
			severity: 'secondary',
		},
		acceptProps: {
			label: 'Выйти',
			severity: 'danger',
		},
		accept: () => {
			router.push({ name: 'logout' })
		},
	})
}
</script>
