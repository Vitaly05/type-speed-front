import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

const MyPreset = definePreset(Aura, {
	components: {
		button: {
			colorScheme: {
				dark: {
					primary: {
						background: '{orange:500}',
						color: '{orange:50}',
						border: {
							color: '{orange:500}',
						},
						hover: {
							background: '{orange:600}',
							color: '{orange:50}',
							border: {
								color: '{orange:600}',
							},
						},
						active: {
							background: '{orange:700}',
							color: '{orange:50}',
							border: {
								color: '{orange:700}',
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
					danger: {
						background: '{red:600}',
						color: '{orange:50}',
						border: {
							color: '{red:600}',
						},
						hover: {
							background: '{red:700}',
							color: '{orange:50}',
							border: {
								color: '{red:700}',
							},
						},
						active: {
							background: '{red:800}',
							color: '{orange:50}',
							border: {
								color: '{red:800}',
							},
						},
					},
					outlined: {
						primary: {
							color: '{orange:400}',
							border: {
								color: '{orange:400}',
							},
							hover: {
								background: 'rgba(255,255,255,0.05)',
							},
							active: {
								background: 'rgba(255,255,255,0.1)',
							},
						},
					},
					link: {
						color: '{orange:400}',
						hover: {
							color: '{orange:500}',
						},
						active: {
							color: '{orange:600}',
						},
					},
				},
			},
		},
		paginator: {
			background: 'transparent',
			nav: {
				button: {
					color: 'rgb(255,255,255)',
					selected: {
						background: '{orange:500}',
					},
					hover: {
						background: '{stone:900}',
					},
				},
			},
		},
		inputtext: {
			background: '{stone:700}',
			color: '{orange:50}',
			border: {
				color: '{stone:900}',
			},
			hover: {
				border: {
					color: '{orange:600}',
				},
			},
			focus: {
				border: {
					color: '{orange:400}',
				},
			},
		},
		floatlabel: {
			color: '{orange:50}',
			focus: {
				color: '{orange:400}',
			},
			active: {
				color: '{orange:50}',
			},
			invalid: {
				color: '{red:500}',
			},
			on: {
				active: {
					background: '{stone:700}',
				},
			},
			font: {
				weight: 400,
			},
		},
	},
})

export { MyPreset }
