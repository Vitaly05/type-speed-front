<template>
	<AppHeader />

	<main>
		<div class="main-block bg-primary border-b border-orange-50">
			<ResultTable for-current-user />
		</div>

		<div class="main-block bg-primary">
			<ResultTable />
		</div>
	</main>
</template>

<script setup>
import AppHeader from '@/components/base/AppHeader.vue'
import ResultTable from '@/components/ResultTable.vue'
</script>
