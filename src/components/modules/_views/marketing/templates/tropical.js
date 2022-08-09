const canvasWidth = 500
const canvasHeight = 500

export const templateTropical = {
	configBackgroundImage: {
		image: 'vTL_qy03D1I',
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
		image: 'border-tropical',
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
		text: 'Awesome Header',
		use: true,
		draggable: true,
		name: 'headertext',
		fontFamily: 'Abril Fatface',
		fontSize: 50,
		lineHeight: 1,
		fontStyle: 'normal',
		align: 'center',
		fill: '#ffffff',
		x: 0,
		y: 380,
		offsetX: 0,
		padding: 10,
		width: canvasWidth,
		centerVertical: false,
		centerHorizontal: true
	},
	configBodyText: {
		text: 'Your text here',
		use: true,
		draggable: true,
		name: 'bodytext',
		fontFamily: 'Rubik',
		fontSize: 18,
		lineHeight: 1,
		fontStyle: 'normal',
		align: 'center',
		fill: '#ffffff',
		y: 438,
		x: 20,
		padding: 10,
		width: 300,
		centerHorizontal: true
	},
	configCaption: {
		use: false
	}
}