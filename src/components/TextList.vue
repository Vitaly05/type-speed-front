<template>
	<div v-if="canEdit" class="flex justify-center mb-10">
		<Button label="Добавить текст" icon="pi pi-plus" />
	</div>

	<div v-if="!textsData || textsData.data.length === 0" class="text-center text-xl">
		Текста не найдены
	</div>

	<div v-else>
		<div class="grid grid-cols-3 gap-8">
			<TextCard
				v-for="data in textsData.data"
				:key="data.id"
				:data="data"
				:can-edit="canEdit"
			/>
		</div>

		<Paginator
			v-if="textsData.meta.total > textsData.meta.per_page"
			class="mt-10"
			:rows="textsData.meta.per_page"
			:total-records="textsData.meta.total"
			@page="onPageChange"
		/>
	</div>
</template>

<script setup>
import TextCard from '@/components/TextCard.vue'
import { Button, Paginator } from 'primevue'
import { ref } from 'vue'

const emit = defineEmits(['page-changed'])

const props = defineProps({
	canEdit: {
		type: Boolean,
		default: false,
	},
	textsData: {
		type: Object,
		default: null,
	},
})

const lastPage = ref(props.textsData.meta.current_page - 1)

function onPageChange(pageState) {
	const page = pageState.page

	if (lastPage.value !== page) {
		lastPage.value = page

		emit('page-changed', page + 1)
	}
}
</script>
