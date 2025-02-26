<template>
	<AppHeader />

	<main class="main-block bg-primary">
		<div v-if="authStore.isAuthenticated">
			<div v-if="isLoading" class="flex items-center mb-5">
				<ProgressSpinner
					style="width: 50px; height: 50px"
					strokeWidth="6"
					fill="transparent"
					animationDuration="1s"
					aria-label="Загрузка"
				/>
			</div>

			<TextList
				v-if="textsData"
				:can-edit="true"
				:texts-data="textsData"
				@page-changed="onPageChanged"
				@text-deleted="onTextDeleted"
				@text-saved="onTextSaved"
			/>
		</div>

		<div v-else class="text-center text-xl">Войдите в аккаунт, чтобы создавать свои текста</div>
	</main>
</template>

<script setup>
import AppHeader from '@/components/base/AppHeader.vue'
import TextList from '@/components/TextList.vue'
import { onMounted, ref } from 'vue'
import { apiGetMyTexts } from '@/api.js'
import { ProgressSpinner } from 'primevue'
import { useAuthStore } from '@/stores/authStore.js'

const authStore = useAuthStore()

const textsData = ref(null)
const isLoading = ref(true)
const currentPage = ref(0)

onMounted(async () => {
	if (!authStore.isAuthenticated) {
		return
	}

	isLoading.value = true

	textsData.value = await apiGetMyTexts({ page: 1 })

	isLoading.value = false
})

async function onPageChanged(page) {
	isLoading.value = true

	currentPage.value = page

	textsData.value = await apiGetMyTexts({ page: page })

	isLoading.value = false
}

async function onTextDeleted(textId) {
	isLoading.value = true

	textsData.value.data = textsData.value.data.filter((text) => text.id !== textId)

	if (textsData.value.data.length === 0) {
		currentPage.value = 1
	}

	textsData.value = await apiGetMyTexts({ page: currentPage.value })

	isLoading.value = false
}

async function onTextSaved(isNewText) {
	isLoading.value = true

	if (isNewText) {
		currentPage.value = 1
	}

	textsData.value = await apiGetMyTexts({ page: currentPage.value })

	isLoading.value = false
}
</script>
