<template>
	<main>Logout...</main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useToast } from 'primevue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

onMounted(() => {
	if (authStore.isAuthenticated) {
		authStore.clearAccessToken()
		toast.add({ summary: 'Вы вышли из аккаунта', severity: 'success', life: 5000 })
	}

	router.push({ name: 'home' })
})
</script>
