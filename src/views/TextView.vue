<template>
	<AppHeader />

	<main class="main-block bg-primary">
		<div v-if="isLoading" class="flex items-center">
			<ProgressSpinner
				style="width: 50px; height: 50px"
				strokeWidth="6"
				fill="transparent"
				animationDuration="1s"
				aria-label="Загрузка"
			/>
		</div>

		<div v-else class="flex flex-col items-center justify-center gap-10">
			<div class="flex gap-5">
				<span>Тип теста:</span>

				<div class="flex flex-wrap gap-4">
					<div class="flex items-center gap-2">
						<RadioButton
							v-model="selectedTestType"
							input-id="selectedType1"
							value="one-minute"
							:disabled="isTestRunning"
						/>

						<label
							for="selectedType1"
							:class="`${isTestRunning ? '' : 'cursor-pointer'}`"
						>
							За минуту
						</label>
					</div>

					<div class="flex items-center gap-2">
						<RadioButton
							v-model="selectedTestType"
							input-id="selectedType2"
							value="full-text"
							:disabled="isTestRunning"
						/>

						<label
							for="selectedType2"
							:class="`${isTestRunning ? '' : 'cursor-pointer'}`"
						>
							Весь текст
						</label>
					</div>
				</div>
			</div>

			<TimerStopwatch
				ref="timerStopwatchRef"
				:type="selectedTestType"
				@time-out="finishTest"
			/>

			<div class="words-panel" ref="virtualScrollerRef">
				<template v-for="(word, index) in wordsArray" :key="word.id">
					<span
						v-if="isWordVisible(Math.floor(index / optimizeStepLength))"
						:class="getWorldClass(index)"
						:ref="setItemRef"
						:id="`word-${index}`"
					>
						<span
							v-for="(symbol, symbolIndex) in word"
							:key="symbolIndex"
							:class="getSymbolClass(index, symbolIndex)"
						>
							{{ symbol }}
						</span>
					</span>
				</template>
			</div>

			<div class="flex flex-col gap-3 items-center">
				<InputText
					v-model="currentEnteredWord"
					class="w-[400px]"
					:disabled="isTestFinished"
					@focus="onInputFocus"
					@keydown="onTextKeyDown"
					@input="onTextInput"
				/>

				<Message size="small" variant="simple">Пробел - подтвердить слово</Message>

				<transition name="fade">
					<Message v-if="!isTestRunning && !isTestFinished" size="small"
						>Чтобы начать, начните вводить слово
					</Message>
				</transition>
			</div>

			<TestResultModal
				v-model:show="showResultDialog"
				:text-id="textData.id"
				:words="wordsArray"
				:entered-words="enteredWordsArray"
				:elapsed-time="passedSeconds"
				@close="restartTest"
			/>
		</div>
	</main>
</template>

<script setup>
import AppHeader from '@/components/base/AppHeader.vue'
import { useRoute, useRouter } from 'vue-router'
import { nextTick, ref, watchEffect } from 'vue'
import { apiGetText } from '@/api.js'
import { useToast, ProgressSpinner, InputText, Message, RadioButton } from 'primevue'
import TestResultModal from '@/components/TestResultModal.vue'
import TimerStopwatch from '@/components/TimerStopwatch.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isLoading = ref(false)
const textData = ref(null)
const wordsArray = ref([])
const currentWorldIndex = ref(0)
const currentEnteredWord = ref('')
const enteredWordsArray = ref([])
const selectedTestType = ref('one-minute')
const isTestRunning = ref(false)
const isTestFinished = ref(false)
const showResultDialog = ref(false)
const passedSeconds = ref(0)
const optimizeStepLength = ref(150)

const virtualScrollerRef = ref(null)
const itemRefs = ref([])
const timerStopwatchRef = ref(null)

watchEffect(async () => {
	isLoading.value = true

	const response = await apiGetText({ id: route.params.id })

	if (response) {
		textData.value = response

		wordsArray.value = response.text.split(' ')
	} else {
		router.push({ name: '404' })
		toast.add({ summary: 'Не удалось найти текст', severity: 'error', life: 5000 })
	}

	isLoading.value = false
})

function isWordVisible(optimizeStep) {
	const currentOptimizeStep = Math.floor(currentWorldIndex.value / optimizeStepLength.value)

	return optimizeStep === currentOptimizeStep || optimizeStep === currentOptimizeStep + 1
}

function getWorldClass(wordIndex) {
	switch (true) {
		case wordIndex < currentWorldIndex.value:
			return 'done-word'
		case wordIndex === currentWorldIndex.value:
			return 'current-word'
		case wordIndex > currentWorldIndex.value:
		default:
			return 'pending-word'
	}
}

function getSymbolClass(wordIndex, symbolIndex) {
	if (wordIndex < currentWorldIndex.value) {
		const enteredWord = enteredWordsArray.value[wordIndex]

		if (!enteredWord || wordsArray.value[wordIndex][symbolIndex] !== enteredWord[symbolIndex]) {
			return 'error-symbol'
		}
	}

	return ''
}

function setItemRef(element) {
	if (element && !itemRefs.value.some((el) => el.id === element.id)) {
		itemRefs.value.push(element)
	}
}

async function scrollToItem(index) {
	if (itemRefs.value[index] && virtualScrollerRef.value) {
		const parent = virtualScrollerRef.value
		const child = itemRefs.value[index]

		await nextTick()

		const offset = child.offsetLeft - parent.offsetLeft - parent.clientWidth / 2

		const behavior =
			currentWorldIndex.value % optimizeStepLength.value === 0 ? 'instant' : 'smooth'

		parent.scrollTo({
			left: offset,
			behavior: behavior,
		})
	}
}

function onInputFocus() {
	scrollToItem(currentWorldIndex.value)
}

function onTextInput() {
	startTest()
}

function onTextKeyDown(e) {
	if (e.key === ' ') {
		startTest()

		e.preventDefault()

		enteredWordsArray.value.push(currentEnteredWord.value)

		currentEnteredWord.value = ''

		currentWorldIndex.value++

		scrollToItem(currentWorldIndex.value)

		if (currentWorldIndex.value === wordsArray.value.length) {
			finishTest()
		}
	}
}

function startTest() {
	if (isTestRunning.value) {
		return
	}

	isTestFinished.value = false
	isTestRunning.value = true

	timerStopwatchRef.value.start()
}

function finishTest() {
	isTestRunning.value = false
	isTestFinished.value = true

	if (currentEnteredWord.value) {
		enteredWordsArray.value.push(currentEnteredWord.value)
		currentEnteredWord.value = ''
		currentWorldIndex.value++
	}

	timerStopwatchRef.value.stop()
	passedSeconds.value = timerStopwatchRef.value.passedSeconds

	showResultDialog.value = true
}

function restartTest() {
	isTestRunning.value = false
	isTestFinished.value = false

	timerStopwatchRef.value.reset()
	passedSeconds.value = 0

	currentEnteredWord.value = ''
	currentWorldIndex.value = 0
	enteredWordsArray.value = []
}
</script>
