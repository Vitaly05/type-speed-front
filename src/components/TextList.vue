<template>
	<div v-if="canEdit" class="flex justify-center mb-10">
		<Button label="Добавить текст" icon="pi pi-plus" @click="onCreateClick" />
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
				@delete="onTextDelete"
				@edit="onTextEditClick"
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

	<EditTextModal
		v-if="canEdit"
		v-model="showEditModal"
		:text-data="editedTextData"
		@save="onTextSave"
	/>
</template>

<script setup>
import TextCard from '@/components/TextCard.vue'
import { Button, Paginator } from 'primevue'
import { ref, watchEffect } from 'vue'
import EditTextModal from '@/components/EditTextModal.vue'

const emit = defineEmits(['page-changed', 'text-deleted', 'text-saved'])

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
const showEditModal = ref(false)
const editedTextData = ref(null)

watchEffect(() => {
	lastPage.value = props.textsData.meta.current_page - 1
})

function onPageChange(pageState) {
	const page = pageState.page

	if (lastPage.value !== page) {
		lastPage.value = page

		emit('page-changed', page + 1)
	}
}

function onTextDelete(textId) {
	emit('text-deleted', textId)
}

function onCreateClick() {
	editedTextData.value = null
	showEditModal.value = true
}

function onTextSave(isNewText) {
	showEditModal.value = false

	emit('text-saved', isNewText)
}

function onTextEditClick(text) {
	editedTextData.value = text
	showEditModal.value = true
}
</script>
