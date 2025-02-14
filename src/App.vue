<template>
	<RouterView />

	<Toast position="bottom-center" />
	<ConfirmPopup />
</template>

<script setup>
import { RouterView } from 'vue-router'
import { ConfirmPopup, Toast } from 'primevue'
</script>
