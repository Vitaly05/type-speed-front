<template>
	<Message v-if="forCurrentUser && !authStore.isAuthenticated" severity="warn">
		Войдите в аккаунт, чтобы увидеть свой лучший результат
	</Message>

	<Message v-else-if="showNoResultMessage" severity="warn">
		Вы ещё не прошли ни одного теста
	</Message>

	<DataTable
		v-else
		:value="results?.data"
		:loading="isLoading"
		:lazy="true"
		:paginator="!forCurrentUser && results?.meta.total > results?.meta.per_page"
		:rows="!forCurrentUser && results?.meta.per_page"
		:total-records="!forCurrentUser && results?.meta.total"
		@page="onPageChange"
	>
		<Column field="position" header="Место"></Column>

		<Column field="user_name" header="Имя пользователя">
			<template #body="slotProps">
				<span>{{ slotProps.data.user_name }}{{ forCurrentUser ? ' (Вы)' : '' }}</span>
			</template>
		</Column>

		<Column field="best_spm" header="Лучший результат">
			<template #body="slotProps">
				<span><b>{{ slotProps.data.best_spm }}</b> (симв/мин)</span>
			</template>
		</Column>

		<Column field="avg_spm" header="Средний результат">
			<template #body="slotProps">
				<span><b>{{ slotProps.data.avg_spm }}</b> (симв/мин)</span>
			</template>
		</Column>

		<Column field="text_passed" header="Пройдено текстов"></Column>
	</DataTable>
</template>

<script setup>
import { DataTable, Column, Message } from 'primevue'
import { onMounted, ref } from 'vue'
import { apiGetMyBestResult, apiGetTopRating } from '@/api.js'
import { useAuthStore } from '@/stores/authStore.js'

const props = defineProps({
	forCurrentUser: {
		type: Boolean,
		required: false,
		default: false,
	},
})

const authStore = useAuthStore()

const isLoading = ref(false)
const results = ref(null)
const currentPage = ref(0)
const showNoResultMessage = ref(false)

function onPageChange({ page }) {
	if (currentPage.value === page) {
		return
	}

	currentPage.value = page

	fetchResults()
}

async function fetchResults() {
	isLoading.value = true

	if (props.forCurrentUser) {
		const result = await apiGetMyBestResult()

		if (result.success === false) {
			showNoResultMessage.value = true
		}

		results.value = {
			data: [result],
		}
	} else {
		results.value = await apiGetTopRating({ page: currentPage.value + 1 })
	}

	isLoading.value = false
}

onMounted(() => {
	fetchResults()
})
</script>
