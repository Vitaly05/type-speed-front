import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

const MyPreset = definePreset(Aura, {
	components: {
		button: {
			colorScheme: {
				dark: {
					primary: {
						background: '{orange.500}',
						color: '{orange:950}',
						border: {
							color: '{orange.500}',
						},
						hover: {
							background: '{orange.600}',
							color: '{orange:950}',
							border: {
								color: '{orange.600}',
							},
						},
						active: {
							background: '{orange.700}',
							color: '{orange:950}',
							border: {
								color: '{orange.700}',
							},
						},
					},
					secondary: {
						background: 'rgb(255,255,255)',
						color: '{orange:950}',
						border: {
							color: 'rgb(255,255,255)',
						},
						hover: {
							background: 'rgb(220,220,220)',
							color: '{orange:950}',
							border: {
								color: 'rgb(220,220,220)',
							},
						},
						active: {
							background: 'rgb(200,200,200)',
							color: '{orange:950}',
							border: {
								color: 'rgb(200,200,200)',
							},
						},
					},
				},
			},
		},
	},
})

export { MyPreset }
