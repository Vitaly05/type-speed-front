<template>
	<div class="bg-secondary p-5 rounded-lg flex flex-col gap-3">
		<h2 class="text-2xl">{{ data?.title }}</h2>

		<div class="flex flex-col text-sm">
			<span>Слов: {{ data?.words_count }}</span>
			<span>Символов: {{ data?.symbols_count }}</span>
			<span>Рекорд: {{ record(data) }}</span>
			<span>
				Пройдено раз (вы/все):
				{{ dashOrValue(data.completed.by_user) }}/{{
					dashOrValue(data.completed.by_others)
				}}
			</span>
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
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore.js'

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

const settingsStore = useSettingsStore()

const record = (item) =>
	computed(() => {
		switch (settingsStore.progressFormat) {
			case settingsStore.progressFormats.symbolsPerMinute:
				return `${dashOrValue(item?.record.symbols)} (симв/мин)`
			case settingsStore.progressFormats.wordsPerMinute:
				return `${dashOrValue(item?.record.words)} (слов/мин)`
			case settingsStore.progressFormats.both:
			default:
				if (!item?.record.symbols && !item?.record.words) {
					return '-'
				}

				return `${dashOrValue(item?.record.symbols)} (симв/мин) / ${dashOrValue(item?.record.words)} (слов/мин)`
		}
	})

const dashOrValue = (value) => (!value || value === 0 ? '-' : value)
</script>
