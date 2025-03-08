<template>
	<div class="flex justify-center items-center h-dvh">
		<div class="account-form-card relative">
			<h1 class="text-2xl text-center">Скорость печати - Регистрация</h1>

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

			<Form
				v-slot="$form"
				class="account-form mt-8"
				:validate-on-value-update="false"
				:validate-on-blur="true"
				:initial-values
				:resolver
				@submit="onSubmit"
			>
				<div class="flex flex-col gap-1">
					<FloatLabel variant="on">
						<InputText name="email" type="email" class="w-full" />
						<label for="email">Почта</label>
					</FloatLabel>

					<Message
						v-if="$form.email?.invalid || !!errorsFromApi.email"
						severity="error"
						size="small"
						variant="simple"
					>
						{{ $form.email.error?.message }}
						{{ errorsFromApi.email }}
					</Message>
				</div>

				<div class="flex flex-col gap-1">
					<FloatLabel variant="on">
						<InputText name="username" type="text" class="w-full" />
						<label for="username">Имя пользователя</label>
					</FloatLabel>

					<Message
						v-if="$form.username?.invalid || !!errorsFromApi.username"
						severity="error"
						size="small"
						variant="simple"
					>
						{{ $form.username.error?.message }}
						{{ errorsFromApi.username }}
					</Message>
				</div>

				<div class="flex flex-col gap-1">
					<FloatLabel variant="on">
						<InputText name="password" type="password" class="w-full" />
						<label for="password">Пароль</label>
					</FloatLabel>

					<Message
						v-if="$form.password?.invalid"
						severity="error"
						size="small"
						variant="simple"
						>{{ $form.password.error?.message }}
					</Message>
				</div>

				<Button
					type="submit"
					severity="secondary"
					label="Зарегистрироваться"
					:loading="isLoading"
				/>
			</Form>

			<div class="mt-5 flex justify-between">
				<Button
					label="Войти в существующий аккаунт"
					class="p-0!"
					as="router-link"
					variant="link"
					:to="{ name: 'login' }"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { Form } from '@primevue/forms'
import { InputText, FloatLabel, Message, Button, useToast } from 'primevue'
import { onMounted, reactive, ref } from 'vue'
import { validateEmail, validatePassword, validateUsername } from '@/helpers/validationHelper.js'
import { apiRegister } from '@/api.js'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'

const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)

const initialValues = reactive({
	email: '',
	username: '',
	password: '',
})

const errorsFromApi = reactive({
	email: '',
	username: '',
	password: '',
})

const resolver = ({ values }) => {
	const errors = {}

	const emailError = validateEmail(values.email)

	if (emailError) {
		errors.email = [{ message: emailError }]
	}

	const usernameError = validateUsername(values.username)

	if (usernameError) {
		errors.username = [{ message: usernameError }]
	}

	const passwordError = validatePassword(values.password)

	if (passwordError) {
		errors.password = [{ message: passwordError }]
	}

	return {
		errors,
	}
}

const onSubmit = async (form) => {
	if (!form.valid) {
		return
	}

	clearApiErrors()

	const data = {
		email: form.states.email.value,
		name: form.states.username.value,
		password: form.states.password.value,
	}

	isLoading.value = true

	const response = await apiRegister(data)

	isLoading.value = false

	if (!response) {
		toast.add({ summary: 'Произошла неизвестная ошибка', severity: 'error', life: 5000 })
		return
	}

	if (!response.success && response.messages) {
		if (response.messages.email) {
			errorsFromApi.email =
				response.messages.email[0] === 'The email has already been taken.'
					? 'Данная почта уже используется.'
					: ''
		}

		if (response.messages.name) {
			errorsFromApi.username =
				response.messages.name[0] === 'The name has already been taken.'
					? 'Данное имя пользователя уже используется.'
					: ''
		}
	}

	if (!response.access_token) {
		toast.add({ summary: 'Произошла неизвестная ошибка', severity: 'error', life: 5000 })
		return
	}

	authStore.setAccessToken(response.access_token)

	toast.add({ summary: 'Аккаунт успешно создан', severity: 'success', life: 5000 })

	router.push({ name: 'home' })
}

function clearApiErrors() {
	errorsFromApi.email = ''
	errorsFromApi.username = ''
	errorsFromApi.password = ''
}

onMounted(() => {
	if (authStore.isAuthenticated) {
		router.push({ name: 'home' })
	}
})
</script>
