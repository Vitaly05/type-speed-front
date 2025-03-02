<template>
	<div class="flex justify-center items-center h-dvh">
		<div class="account-form-card relative w-150!">
			<h1 class="text-2xl text-center">Type Speed - Сброс пароля</h1>

			<div class="absolute right-2 top-2">
				<Button
					icon="pi pi-home"
					variant="outlined"
					aria-label="На главную"
					as="router-link"
					:to="{ name: 'home' }"
					rounded
				/>
			</div>

			<div class="account-form mt-8">
				<Stepper value="3" class="my-10" linear>
					<StepList>
						<Step value="1">Почта</Step>

						<Step value="2">Код подтверждения</Step>

						<Step value="3">Новый пароль</Step>
					</StepList>

					<StepPanels>
						<StepPanel
							v-slot="{ activateCallback }"
							class="flex flex-col gap-5"
							value="1"
						>
							<h3 class="text-md">
								Введите почту от вашего аккаунта. На неё придёт код подтверждения
							</h3>

							<div class="flex flex-col gap-1">
								<FloatLabel variant="on">
									<InputText
										v-model="email"
										name="email"
										type="email"
										class="w-full"
										:invalid="validation.email.messageVisible"
									/>

									<label for="username">Почта</label>
								</FloatLabel>

								<Message
									v-if="validation.email.messageVisible"
									severity="error"
									size="small"
									variant="simple"
								>
									{{ validation.email.message }}
								</Message>
							</div>

							<div class="flex justify-end">
								<Button
									label="Далее"
									:disabled="!validation.email.isValid"
									:loading="isLoading.firstStep"
									@click="onFirstStepEnd(() => activateCallback('2'))"
								/>
							</div>
						</StepPanel>

						<StepPanel
							v-slot="{ activateCallback }"
							class="flex flex-col gap-5"
							value="2"
						>
							<div class="flex flex-col items-center gap-5">
								<h3 class="text-xl">Введите код из письма</h3>

								<InputOtp v-model="code" :length="6" integer-only />
							</div>

							<div class="flex justify-between">
								<Button
									label="Назад"
									severity="secondary"
									:loading="isLoading.secondStep"
									@click="activateCallback('1')"
								/>

								<Button
									label="Далее"
									:disabled="!validation.code.isValid"
									:loading="isLoading.secondStep"
									@click="onSecondStepEnd(() => activateCallback('3'))"
								/>
							</div>
						</StepPanel>

						<StepPanel value="3" class="flex flex-col gap-5">
							<h3 class="text-md">Введите новый пароль для вашего аккаунта</h3>

							<div class="flex flex-col gap-1">
								<FloatLabel variant="on">
									<InputText
										v-model="password"
										name="password"
										type="password"
										class="w-full"
										:invalid="validation.password.messageVisible"
									/>

									<label for="username">Новый пароль</label>
								</FloatLabel>

								<Message
									v-if="validation.password.messageVisible"
									severity="error"
									size="small"
									variant="simple"
								>
									{{ validation.password.message }}
								</Message>
							</div>

							<Button
								label="Использовать этот пароль"
								:disabled="!validation.password.isValid"
								:loading="isLoading.thirdStep"
								@click="resetPassword"
							/>
						</StepPanel>
					</StepPanels>
				</Stepper>
			</div>

			<div class="mt-5 flex justify-between">
				<Button
					label="Вход"
					class="p-0!"
					as="router-link"
					variant="link"
					:to="{ name: 'login' }"
				/>

				<Button
					label="Регистрация"
					class="p-0!"
					as="router-link"
					variant="link"
					:to="{ name: 'registration' }"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	Button,
	FloatLabel,
	InputText,
	Message,
	Stepper,
	StepList,
	Step,
	StepPanels,
	StepPanel,
	InputOtp,
} from 'primevue'
import { reactive, ref, watch } from 'vue'
import { validateEmail, validatePassword } from '@/helpers/validationHelper.js'

const validation = reactive({
	email: {
		isValid: false,
		message: '',
		messageVisible: false,
	},
	code: {
		isValid: false,
		message: '',
		messageVisible: false,
	},
	password: {
		isValid: false,
		message: '',
		messageVisible: false,
	},
})

const isLoading = reactive({
	firstStep: false,
	secondStep: false,
	thirdStep: false,
})

const email = ref('')
const code = ref('')
const password = ref('')

watch(email, (newValue) => {
	const message = validateEmail(newValue)

	if (message) {
		validation.email.isValid = false
		validation.email.messageVisible = true
		validation.email.message = message
	} else {
		validation.email.isValid = true
		validation.email.messageVisible = false
		validation.email.message = ''
	}
})

watch(code, (newValue) => {
	validation.code.isValid = newValue.length === 6
})

watch(password, (newValue) => {
	const message = validatePassword(newValue)

	if (message) {
		validation.password.isValid = false
		validation.password.messageVisible = true
		validation.password.message = message
	} else {
		validation.password.isValid = true
		validation.password.messageVisible = false
		validation.password.message = ''
	}
})

async function onFirstStepEnd(callback) {
	isLoading.firstStep = true

	isLoading.firstStep = false

	callback()
}

async function onSecondStepEnd(callback) {
	isLoading.secondStep = true

	isLoading.secondStep = false

	callback()
}

async function resetPassword() {
	isLoading.thirdStep = true

	isLoading.thirdStep = false
}
</script>
