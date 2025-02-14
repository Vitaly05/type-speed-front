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
			<RouterLink to="/" class="link">Список текстов</RouterLink>

			<RouterLink to="/f" class="link">Мои текста</RouterLink>

			<RouterLink to="/ff" class="link">Рейтинг пользователей</RouterLink>
		</div>

		<div v-if="isAuthenticated">
			<Button label="Выйти" severity="secondary" as="div" />
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
import { Button } from 'primevue'
import LogoIcon from '@/components/icons/LogoIcon.vue'
import { ref } from 'vue'

const isAuthenticated = ref(false)
</script>
