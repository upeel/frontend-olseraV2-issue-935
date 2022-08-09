const canvasWidth = 500
const canvasHeight = 500

export const templateDiscount = {
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
		fill: '#345995'
	},
	configImage: {
		image: '',
		draggable: true,
		name: 'logo'
	},
	configGraphic: {
		image: 'brush-yellow',
		draggable: true,
		name: 'graphic',
		width: 500,
		height: 125,
		centerVertical: true,
		centerHorizontal: true
	},
	configHeaderText: {
		text: '20% OFF',
		use: true,
		draggable: true,
		name: 'headertext',
		fontFamily: 'Permanent Marker',
		fontSize: 75,
		lineHeight: 1,
		align: 'center',
		fill: '#ffffff',
		y: 0,
		x: 0,
		offsetX: 0,
		offsetY: 0,
		padding: 10,
		width: canvasWidth,
		centerVertical: true,
		centerHorizontal: true
	},
	configBodyText: {
		text: 'SALE ALL ITEMS',
		use: true,
		draggable: true,
		name: 'bodytext',
		fontFamily: 'Playfair Display',
		fontSize: 32,
		lineHeight: 1,
		align: 'center',
		fill: '#ffffff',
		y: 100,
		x: 0,
		offsetX: 0,
		offsetY: 0,
		padding: 10,
		width: 480,
		centerVertical: false,
		centerHorizontal: true
	},
	configCaption: {
		text: 'Date and Time',
		use: true,
		draggable: true,
		name: 'caption',
		fontFamily: 'Rubik',
		fontSize: 16,
		lineHeight: 1,
		align: 'center',
		fill: '#ffffff',
		y: 350,
		x: 0,
		offsetX: 0,
		offsetY: 0,
		padding: 10,
		width: 300,
		centerVertical: false,
		centerHorizontal: true
	},
}