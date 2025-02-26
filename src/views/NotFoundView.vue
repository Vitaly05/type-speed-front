<template>
	<div class="flex flex-col gap-10 items-center justify-center h-dvh">
		<h1 class="text-5xl">404 Страница не найдена</h1>

		<Button label="На главную" as="router-link" :to="{ name: 'home' }" />
	</div>
</template>

<script setup>
import { Button } from 'primevue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
	router.push({ name: '404' })
})
</script>
