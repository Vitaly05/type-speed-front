<template>
	<Message v-if="!authStore.isAuthenticated" severity="warn">
		Войдите в аккаунт, чтобы следить за своим прогрессом
	</Message>

	<Message v-else-if="showNoProgressMessage" severity="warn">
		Вы ещё не прошли этот текст
	</Message>

	<DataTable
		v-else
		:value="progresses?.data"
		:loading="isLoading"
		:lazy="true"
		:paginator="progresses?.meta.total > progresses?.meta.per_page"
		:rows="progresses?.meta.per_page"
		:total-records="progresses?.meta.total"
		@page="onPageChange"
	>
		<Column field="speed.symbols" header="Скорость (символов)">
			<template #body="slotProps">
				<span
					><b>{{ slotProps.data.speed.symbols }}</b> (симв/мин)</span
				>
			</template>
		</Column>

		<Column field="speed.words" header="Скорость (слов)">
			<template #body="slotProps">
				<span>
					<b>{{ slotProps.data.speed.words }}</b> (слов/мин)
				</span>
			</template>
		</Column>

		<Column field="seconds_elapsed" header="Потрачено времени">
			<template #body="slotProps">
				<span>{{ getFormattedTime(slotProps.data.seconds_elapsed) }}</span>
			</template>
		</Column>

		<Column field="mistakes_count" header="Совершено ошибок"></Column>

		<Column field="date" header="Дата">
			<template #body="slotProps">
				<span>{{ getFormattedDate(slotProps.data.date) }}</span>
			</template>
		</Column>
	</DataTable>
</template>

<script setup>
import { DataTable, Column, Message } from 'primevue'
import { onMounted, ref } from 'vue'
import { apiGetTextProgresses } from '@/api.js'
import { useAuthStore } from '@/stores/authStore.js'
import { getFormattedTime } from '../helpers/timeHelper.js'
import { getFormattedDate } from '../helpers/dateHelper.js'

const props = defineProps({
	textId: {
		type: Number,
		required: true,
	},
})

defineExpose({
	fetchProgresses,
})

const authStore = useAuthStore()

const isLoading = ref(false)
const progresses = ref(null)
const currentPage = ref(0)
const showNoProgressMessage = ref(false)

function onPageChange({ page }) {
	if (currentPage.value === page) {
		return
	}

	currentPage.value = page

	fetchProgresses()
}

async function fetchProgresses() {
	if (!authStore.isAuthenticated) {
		return
	}

	isLoading.value = true

	const result = await apiGetTextProgresses({ textId: props.textId, page: currentPage.value + 1 })

	if (result.data?.length === 0) {
		showNoProgressMessage.value = true
	} else {
		progresses.value = result
	}

	isLoading.value = false
}

onMounted(() => {
	fetchProgresses()
})
</script>
