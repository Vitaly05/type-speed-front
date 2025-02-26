<template>
	<div class="flex gap-1 text-2xl">
		<span>{{ formatNumber(minutes) }}</span>

		<span>:</span>

		<span>{{ formatNumber(seconds) }}</span>
	</div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watchEffect } from 'vue'

const props = defineProps({
	type: {
		type: String,
		required: true,
		validator(value) {
			return ['one-minute', 'full-text'].includes(value)
		},
	},
})

const emit = defineEmits(['time-out'])

const interval = ref(null)
const secondsLimit = ref(0)
const useSecondsLimit = ref(false)
const passedSeconds = ref(0)

const displayedSeconds = computed(() => Math.abs(secondsLimit.value - passedSeconds.value))
const minutes = computed(() => formatNumber(Math.floor(displayedSeconds.value / 60)))
const seconds = computed(() => formatNumber(displayedSeconds.value % 60))

defineExpose({
	start,
	stop,
	reset,
	passedSeconds,
})

function formatNumber(value) {
	return value.toString().padStart(2, '0')
}

function start() {
	clearInterval(interval.value)

	interval.value = setInterval(() => {
		passedSeconds.value += 1

		if (useSecondsLimit.value && passedSeconds.value >= secondsLimit.value) {
			stop()
			emit('time-out')
		}
	}, 1000)
}

function stop() {
	clearInterval(interval.value)
}

function reset() {
	configTestType()
	passedSeconds.value = 0
}

function configTestType() {
	if (props.type === 'one-minute') {
		secondsLimit.value = 60
		useSecondsLimit.value = true
	} else if (props.type === 'full-text') {
		secondsLimit.value = 0
		useSecondsLimit.value = false
	}
}

watchEffect(() => {
	configTestType()
})

onBeforeUnmount(() => {
	stop()
})
</script>
