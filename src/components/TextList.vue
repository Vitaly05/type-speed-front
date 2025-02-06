<template>
	<div v-if="canEdit" class="flex justify-center mb-10">
		<Button label="Добавить текст" icon="pi pi-plus" />
	</div>

	<div class="grid grid-cols-3 gap-8">
		<TextCard v-for="n in 9" :can-edit="canEdit" />
	</div>

	<Paginator
		class="mt-10"
		:rows="9"
		:total-records="100"
	/>
</template>

<script setup>
import TextCard from '@/components/TextCard.vue'
import { Button, Paginator } from 'primevue'

defineProps({
	canEdit: {
		type: Boolean,
		default: false,
	},
})
</script>
