<template>
	<AppHeader />

	<main class="main-block bg-primary">
		<div v-if="textsData?.meta.total !== 0" class="flex items-center mb-5" style="height: 50px">
			<ProgressSpinner
				v-if="isLoading"
				style="width: 50px; height: 50px"
				strokeWidth="6"
				fill="transparent"
				animationDuration="1s"
				aria-label="Загрузка"
			/>
		</div>

		<TextList
			v-if="textsData"
			:can-edit="false"
			:texts-data="textsData"
			@page-changed="onPageChange"
		/>
	</main>
</template>

<script setup>
import AppHeader from '@/components/base/AppHeader.vue'
import TextList from '@/components/TextList.vue'
import { onMounted, ref } from 'vue'
import { apiGetAllTexts } from '@/api.js'
import { ProgressSpinner } from 'primevue'

const textsData = ref(null)
const isLoading = ref(true)

onMounted(async () => {
	isLoading.value = true

	textsData.value = await apiGetAllTexts({ page: 1 })

	isLoading.value = false
})

async function onPageChange(page) {
	isLoading.value = true

	textsData.value = await apiGetAllTexts({ page: page })

	isLoading.value = false
}
</script>
