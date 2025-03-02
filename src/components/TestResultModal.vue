<template>
	<Dialog
		v-model:visible="show"
		header="Результаты теста"
		modal
		:draggable="true"
		:dismissable-mask="!isLoading"
		:closable="!isLoading"
		@hide="$emit('close')"
	>
		<div class="flex flex-col gap-8">
			<div class="results-panel grid grid-cols-2 gap-x-2 gap-y-1">
				<span>
					Слов введено: <b>{{ enteredWords.length }}</b> из <b>{{ words.length }}</b>
				</span>

				<span>
					Символов введено: <b>{{ enteredSymbolsLength }}</b> из
					<b>{{ symbolsLength }}</b> (с пробелами)
				</span>

				<span>
					Слов в минуту: <b>{{ wordsPerMinute }}</b>
				</span>

				<span>
					Символов в минуту: <b>{{ symbolsPerMinute }}</b>
				</span>

				<span>
					Количество ошибок: <b>{{ errorsCount }}</b>
				</span>

				<span>
					Потрачено времени: <b>{{ formattedElapsedTime }}</b>
				</span>
			</div>

			<div v-if="authStore.isAuthenticated">
				<div v-if="canSaveResult">
					<Message :severity="messageSeverity">
						<div v-if="isLoading" class="flex items-center gap-2">
							<ProgressSpinner
								style="width: 20px; height: 20px"
								strokeWidth="6"
								fill="transparent"
								animationDuration="1s"
								aria-label="Загрузка"
							/>

							<span>Результат сохраняется</span>
						</div>

						<div v-else-if="savedSuccess" class="flex items-center gap-2">
							<span class="pi pi-check"></span>

							<span>Результат сохранён</span>
						</div>

						<div v-else class="flex items-center gap-2">
							<span class="pi pi-error"></span>

							<span>Не удалось сохранить результат, попробуйте ещё раз позже</span>
						</div>
					</Message>
				</div>

				<Message v-else severity="warn">
					Допущено слишком много ошибок, результат <b class="italic">не сохранён</b>
				</Message>
			</div>

			<div v-else>
				<Message severity="info">
					<div class="flex items-center gap-2">
						<span class="pi pi-error"></span>

						<span>Войдите в аккаунт, чтобы сохранить результат</span>
					</div>
				</Message>
			</div>

			<Button
				label="Пройти заново"
				icon="pi pi-replay"
				:disabled="isLoading"
				@click="show = false"
			/>
		</div>
	</Dialog>
</template>

<script setup>
import { Button, Dialog, Message, ProgressSpinner } from 'primevue'
import { computed, ref, watch } from 'vue'
import { getFormattedTime } from '@/helpers/timeHelper.js'
import { apiSaveTestResult } from '@/api.js'
import { useAuthStore } from '@/stores/authStore.js'

const emit = defineEmits(['close', 'saved'])

const props = defineProps({
	words: {
		type: Array,
		required: true,
	},
	enteredWords: {
		type: Array,
		required: true,
	},
	elapsedTime: {
		type: Number,
		required: true,
	},
	textId: {
		type: Number,
		required: true,
	},
})

const show = defineModel('show')

const authStore = useAuthStore()

const isLoading = ref(false)
const savedSuccess = ref(false)

const messageSeverity = computed(() => {
	if (isLoading.value) {
		return 'warn'
	} else if (savedSuccess.value) {
		return 'success'
	} else {
		return 'error'
	}
})

const symbolsLength = computed(
	() => props.words.reduce((acc, word) => (acc += word.length), 0) + props.words.length - 1,
)

const enteredSymbolsLength = computed(
	() =>
		props.enteredWords.reduce((acc, word) => (acc += word.length), 0) +
		props.enteredWords.length -
		1,
)

const formattedElapsedTime = computed(() => getFormattedTime(props.elapsedTime))

const wordsPerMinute = computed(() => {
	const nonEmptyWords = props.enteredWords.filter((word) => word !== '')
	const elapsedTime = props.elapsedTime === 0 ? 1 : props.elapsedTime

	return Math.round((nonEmptyWords.length / elapsedTime) * 60)
})

const symbolsPerMinute = computed(() => {
	const elapsedTime = props.elapsedTime === 0 ? 1 : props.elapsedTime
	return Math.round((enteredSymbolsLength.value / elapsedTime) * 60)
})

const errorsCount = computed(() => {
	let errorsCount = 0

	for (let i = 0; i < props.words.length; i++) {
		if (typeof props.enteredWords[i] !== 'string') {
			break
		}

		for (let j = 0; j < props.words[i].length; j++) {
			if (!props.enteredWords[i][j]) {
				errorsCount++
				continue
			}

			if (props.words[i][j] !== props.enteredWords[i][j]) {
				errorsCount++
			}
		}

		if (props.enteredWords[i].length > props.words[i].length) {
			errorsCount += Math.abs(props.enteredWords[i].length - props.words[i].length)
		}
	}

	return errorsCount
})

const canSaveResult = computed(
	() => errorsCount.value < enteredSymbolsLength.value - enteredSymbolsLength.value * 0.4,
)

watch(show, async (newValue) => {
	if (newValue && canSaveResult.value && authStore.isAuthenticated) {
		isLoading.value = true

		const response = await apiSaveTestResult({
			textId: props.textId,
			secondsElapsed: props.elapsedTime,
			mistakesCount: errorsCount.value,
			wordsPerMinute: wordsPerMinute.value,
			symbolsPerMinute: symbolsPerMinute.value,
		})

		savedSuccess.value = !!response?.success

		if (savedSuccess.value) {
			emit('saved')
		}

		isLoading.value = false
	}
})
</script>
