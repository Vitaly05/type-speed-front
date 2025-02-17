<template>
	<div class="bg-secondary p-5 rounded-lg flex flex-col gap-3">
		<h2 class="text-2xl">{{ data?.title }}</h2>

		<div class="flex flex-col text-sm">
			<span>Слов: {{ data?.words_count }}</span>
			<span>Символов: {{ data?.symbols_count }}</span>
			<span>Рекорд: XXX</span>
			<span>Пройдено раз (вы/все): XXX</span>
		</div>

		<div class="flex flex-row-reverse justify-between gap-4 mt-2">
			<Button label="Пройти" />

			<div v-if="canEdit" class="flex gap-4">
				<Button label="Удалить" severity="danger" icon="pi pi-trash" />
				<Button label="Редактировать" severity="secondary" icon="pi pi-pencil" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { Button } from 'primevue'

defineProps({
	canEdit: {
		type: Boolean,
		default: false,
	},
	data: {
		type: Object,
		default: null,
	},
})
</script>
