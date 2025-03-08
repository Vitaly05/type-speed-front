<template>
	<div class="flex justify-center items-center h-dvh">
		<div class="account-form-card relative">
			<h1 class="text-2xl text-center">Скорость печати - Вход</h1>

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
						<InputText name="username" type="username" class="w-full" />
						<label for="username">Имя пользователя или почта</label>
					</FloatLabel>

					<Message
						v-if="$form.username?.invalid"
						severity="error"
						size="small"
						variant="simple"
						>{{ $form.username.error?.message }}
					</Message>
				</div>

				<div class="flex flex-col gap-1">
					<FloatLabel variant="on">
						<InputText name="password" type="password" class="w-full" />
						<label for="username">Пароль</label>
					</FloatLabel>

					<Message
						v-if="$form.password?.invalid"
						severity="error"
						size="small"
						variant="simple"
						>{{ $form.password.error?.message }}
					</Message>
				</div>

				<Button type="submit" severity="secondary" label="Войти" :loading="isLoading" />
			</Form>

			<div class="mt-5 flex justify-between">
				<Button
					label="Забыли пароль?"
					class="p-0!"
					as="router-link"
					variant="link"
					:to="{ name: 'password-reset' }"
				/>

				<Button
					label="Создать новый аккаунт"
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
import { Form } from '@primevue/forms'
import { InputText, Message, Button, FloatLabel, useToast } from 'primevue'
import { onMounted, reactive, ref } from 'vue'
import { validateEmail, validatePassword, validateUsername } from '@/helpers/validationHelper.js'
import { apiLoginByEmail, apiLoginByName } from '@/api.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)

const initialValues = reactive({
	username: '',
	password: '',
})

const resolver = ({ values }) => {
	const errors = {}

	const usernameError = values.username.includes('@')
		? validateEmail(values.username)
		: validateUsername(values.username)

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

	const data = {
		email: form.states.username.value,
		name: form.states.username.value,
		password: form.states.password.value,
	}

	isLoading.value = true

	const response = form.states.username.value.includes('@')
		? await apiLoginByEmail(data)
		: await apiLoginByName(data)

	isLoading.value = false

	if (!response) {
		toast.add({ summary: 'Произошла неизвестная ошибка', severity: 'error', life: 5000 })
		return
	}

	if (!response.success) {
		if (response.message === 'Invalid credentials') {
			toast.add({ summary: 'Неверные данные для входа', severity: 'error', life: 5000 })
			return
		}
	}

	if (!response.access_token) {
		toast.add({ summary: 'Произошла неизвестная ошибка', severity: 'error', life: 5000 })
		return
	}

	authStore.setAccessToken(response.access_token)

	toast.add({ summary: 'Вы успешно вошли в аккаунт', severity: 'success', life: 5000 })

	router.push({ name: 'home' })
}

onMounted(() => {
	if (authStore.isAuthenticated) {
		router.push({ name: 'home' })
	}
})
</script>
