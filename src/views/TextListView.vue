<template>
	<AppHeader />

	<main class="main-block bg-primary">
		<TextList :can-edit="false" />
	</main>
</template>

<script setup>
import AppHeader from '@/components/base/AppHeader.vue'
import TextList from '@/components/TextList.vue'
</script>
