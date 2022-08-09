const canvasWidth = 500
const canvasHeight = 500

export const templateCelebration = {
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
		fill: '#25CED1'
	},
	configImage: {
		image: '',
		draggable: true,
		name: 'logo'
	},
	configGraphic: {
		image: 'border-celebration',
		draggable: true,
		name: 'graphic',
		y: 0,
		x: 0,
		offsetY: 0,
		offsetX: 0,
		width: 500,
		height: 500
	},
	configHeaderText: {
		text: 'Celebrate This Time\nof Our Live',
		use: true,
		draggable: true,
		name: 'headertext',
		fontFamily: 'Caveat Brush',
		fontSize: 60,
		lineHeight: 1,
		fontStyle: 'normal',
		align: 'center',
		fill: '#ffffff',
		x: 0,
		y: 0,
		offsetX: 0,
		padding: 10,
		width: canvasWidth,
		centerVertical: true,
		centerHorizontal: true
	},
	configBodyText: {
		text: 'Brand Here',
		use: true,
		draggable: true,
		name: 'bodytext',
		fontFamily: 'Rubik',
		fontSize: 18,
		lineHeight: 1,
		fontStyle: 'normal',
		align: 'center',
		fill: '#ffffff',
		y: 340,
		x: 20,
		padding: 10,
		width: 300,
		centerHorizontal: true
	},
	configCaption: {
		text: 'Hello There',
		use: true,
		draggable: true,
		name: 'caption',
		fontFamily: 'Rubik',
		fontSize: 12,
		lineHeight: 1,
		fontStyle: 'normal',
		align: 'center',
		fill: '#ffffff',
		y: 150,
		x: 20,
		padding: 10,
		width: 300,
		centerHorizontal: true
	},
}