import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const settingNames = {
	progressFormat: 'pf',
}

export const useSettingsStore = defineStore('settings', () => {
	const _settings = ref(JSON.parse(localStorage.getItem('type-speed-settings') ?? '{}'))

	function _checkSettings() {
		if (!progressFormat.value) {
			setProgressFormat(progressFormats.value.both)
		}
	}

	function _saveSettings() {
		localStorage.setItem('type-speed-settings', JSON.stringify(_settings.value))
	}

	const progressFormats = computed(() => ({
		wordsPerMinute: 'wpm',
		symbolsPerMinute: 'spm',
		both: 'b',
	}))

	const progressFormat = computed(() => _settings.value[settingNames.progressFormat])

	function setProgressFormat(format) {
		if (Object.values(progressFormats.value).includes(format)) {
			_settings.value[settingNames.progressFormat] = format
			_saveSettings()
		} else {
			console.error('Invalid progress format')
		}
	}

	_checkSettings()

	return { progressFormat, progressFormats, setProgressFormat }
})
