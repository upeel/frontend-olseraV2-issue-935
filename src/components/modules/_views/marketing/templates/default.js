const canvasWidth = 642
const canvasHeight = 453
const Konva = require('konva')
export const templateDefault = {
	configBackgroundImage: {
		image: '',
		name: 'backgroundImage',
		width: canvasWidth,
		height: canvasHeight
	},
	configRect: {
		width: canvasWidth,
		height: canvasHeight,
		fillPatternImage: '',
		fillPatternScale: { x: 1, y: 1 },
		fillPatternRepeat: 'repeat-x',
		fill: ''
	},
	configImage: {
		image: '',
		draggable: true,
		name: 'logo'
	},
	configGraphic: {
		image: '',
		draggable: true,
		name: 'graphic'
	},
	configHeaderText: {
		text: '30% OFF!',
		use: true,
		draggable: true,
		name: 'headertext',
		fontFamily: 'Abril Fatface',
		fontSize: 48,
		lineHeight: 1,
		// fontStyle: 'normal',
		align: 'center',
		fill: '#ffffff',
		x: 20,
		y: 40,
		offsetX: 0,
		offsetY: 0,
		padding: 10,
		width: canvasWidth,
		centerVertical: true,
		centerHorizontal: true
	},
	configBodyText: {
		text: '',
		use: true,
		draggable: true,
		name: 'bodytext',
		fontFamily: 'Rubik',
		fontSize: 22,
		lineHeight: 1,
		// fontStyle: 'normal',
		align: 'center',
		fill: '#ffffff',
		y: 280,
		x: 20,
		offsetX: 0,
		offsetY: 0,
		padding: 10,
		width: 300,
		centerVertical: false,
		centerHorizontal: true
	},
	configCaption: {
		text: '',
		use: true,
		draggable: true,
		name: 'caption',
		fontFamily: 'Rubik',
		fontSize: 16,
		lineHeight: 1,
		// fontStyle: 'normal',
		align: 'center',
		fill: '#ffffff',
		y: 460,
		x: 20,
		offsetX: 0,
		offsetY: 0,
		padding: 10,
		width: 300,
		centerVertical: false,
		centerHorizontal: true
	},
	filter: {
		label: 'Dark Overlay 20%',
		value: [Konva.Filters.HSV],
		config: [
			{
				name: 'value',
				value: -0.2
			}
		]
	}
}