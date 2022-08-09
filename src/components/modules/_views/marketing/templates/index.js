import { templateDefault } from './default'
import { templateQuote } from './quote'
import { templateDiscount } from './discount'
import { templateCelebration } from './celebration'
import { templateTropical } from './tropical'

export const templates = [
	{
		name: 'default',
		display_name: 'Default',
		template: templateDefault
	},
	{
		name: 'quote',
		display_name: 'Quote',
		template: templateQuote
	},
	{
		name: 'discount',
		display_name: 'Discount',
		template: templateDiscount
	},
	{
		name: 'celebration',
		display_name: 'Celebration',
		template: templateCelebration
	},
	{
		name: 'tropical',
		display_name: 'Tropical',
		template: templateTropical
	}
]