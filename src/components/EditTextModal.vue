<template>
	<Dialog v-model:visible="show" :header="editModalHeader" modal>
		<Stepper value="1">
			<StepList>
				<Step value="1">Название текста</Step>
				<Step value="2">Содержание текста</Step>
			</StepList>

			<Form
				v-slot="$form"
				ref="formRef"
				:validate-on-value-update="true"
				:validate-on-blur="true"
				:validate-on-submit="true"
				:initial-values
				:resolver
				@submit="onEditModalFormSubmit"
			>
				<StepPanels>
					<StepPanel v-slot="{ activateCallback }" value="1">
						<div class="flex flex-col gap-10">
							<div class="flex flex-col gap-1">
								<FloatLabel variant="on">
									<InputText name="title" type="text" class="w-full" />
									<label for="title">Название</label>
								</FloatLabel>

								<Message
									v-if="$form.title?.invalid"
									severity="error"
									size="small"
									variant="simple"
									>{{ $form.title.error?.message }}
								</Message>
							</div>

							<Button
								label="Далее"
								icon="pi pi-arrow-right"
								iconPos="right"
								@click="activateCallback('2')"
							/>
						</div>
					</StepPanel>

					<StepPanel v-slot="{ activateCallback }" value="2">
						<div class="flex flex-col gap-5">
							<FileUpload
								class="flex"
								mode="basic"
								accept=".txt"
								choose-label="Выбрать файл"
								custom-upload
								@select="onFileSelect"
							>
								<template #filelabel>
									<span></span>
								</template>
							</FileUpload>

							<span class="text-center text-xl">Или</span>

							<div class="flex flex-col gap-1">
								<FloatLabel variant="on">
									<Textarea
										v-model="textareaTextValue"
										name="text"
										rows="15"
										class="w-full"
										@input="onTextInput"
									/>
									<label for="text">Текст</label>
								</FloatLabel>

								<Message
									v-if="$form.text?.invalid"
									severity="error"
									size="small"
									variant="simple"
									>{{ $form.text.error?.message }}
								</Message>
							</div>

							<div class="flex justify-between">
								<Button
									label="Назад"
									severity="secondary"
									icon="pi pi-arrow-left"
									@click="activateCallback('1')"
								/>

								<Button
									label="Сохранить"
									type="submit"
									icon="pi pi-save"
									:disabled="!$form.valid"
									:loading="isLoading"
								/>
							</div>
						</div>
					</StepPanel>
				</StepPanels>

				<Message v-if="!$form.valid" severity="error" size="small">
					Нельзя сохранить, проверьте данные
				</Message>
			</Form>
		</Stepper>
	</Dialog>
</template>

<script setup>
import {
	Button,
	Dialog,
	FloatLabel,
	InputText,
	Message,
	Step,
	StepList,
	StepPanel,
	StepPanels,
	Stepper,
	Textarea,
	FileUpload,
	useToast,
} from 'primevue'
import { Form } from '@primevue/forms'
import { computed, reactive, ref, watchEffect } from 'vue'
import {
	textTextInvalidSymbolsRegex,
	validateTextText,
	validateTextTitle,
} from '@/helpers/validationHelper.js'
import { apiCreateText, apiEditText } from '@/api.js'

const props = defineProps({
	textData: {
		type: Object,
		default: null,
	},
})

const emit = defineEmits(['save'])

const show = defineModel({ type: Boolean, default: false })

const toast = useToast()

const formRef = ref(null)

const isLoading = ref(false)
const textareaTextValue = ref('')

const initialValues = reactive({
	title: '',
	text: '',
})

watchEffect(() => {
	initialValues.title = props.textData?.title ?? ''
	initialValues.text = props.textData?.text ?? ''
	textareaTextValue.value = props.textData?.text ?? ''
})

const resolver = ({ values }) => {
	const errors = {}

	const titleError = validateTextTitle(values.title)

	if (titleError) {
		errors.title = [{ message: titleError }]
	}

	const textError = validateTextText(values.text)

	if (textError) {
		errors.text = [{ message: textError }]
	}

	return {
		errors,
	}
}

const editModalHeader = computed(() => {
	return !props.textData ? 'Создание текста' : 'Редактирование текста'
})

function onTextInput() {
	if (textareaTextValue.value.length) {
		textareaTextValue.value = textareaTextValue.value.replace(textTextInvalidSymbolsRegex, '')
		textareaTextValue.value = textareaTextValue.value.replace(/\s{2,}/g, ' ')
	}
}

function onFileSelect(e) {
	const file = e.files[0]

	const reader = new FileReader()

	reader.onload = async (e) => {
		const text = e.target.result
		const formattedText = text
			.trim()
			.replace(textTextInvalidSymbolsRegex, '')
			.replace(/\s{2,}/g, ' ')

		textareaTextValue.value = formattedText
		formRef.value.states.text.value = formattedText
	}

	reader.readAsText(file)
}

async function onEditModalFormSubmit(form) {
	if (!form.valid) {
		return
	}

	const data = {
		id: props.textData?.id,
		title: form.states.title.value,
		text: form.states.text.value,
	}

	isLoading.value = true

	const response = props.textData ? await apiEditText(data) : await apiCreateText(data)

	if (response?.success) {
		toast.add({ summary: 'Текст сохранён', severity: 'success', life: 5000 })

		textareaTextValue.value = ''

		emit('save', !props.textData)
	} else {
		toast.add({ summary: 'Не удалось сохранить текст', severity: 'error', life: 5000 })
	}

	isLoading.value = false
}
</script>
