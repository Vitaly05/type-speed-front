<template>
	<div class="flex justify-center items-center h-dvh">
		<div class="account-form-card relative">
			<h1 class="text-2xl text-center">Type Speed - Вход</h1>

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
					:to="{ name: 'login' }"
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
import { InputText, Message, Button, FloatLabel } from 'primevue'
import { reactive, ref } from 'vue'
import { validateEmail, validatePassword, validateUsername } from '@/helpers/validationHelper.js'

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

const onSubmit = (form) => {
	if (!form.valid) {
		return
	}

	console.log(form.states.username.value)
	console.log(form.states.password.value)
}
</script>
