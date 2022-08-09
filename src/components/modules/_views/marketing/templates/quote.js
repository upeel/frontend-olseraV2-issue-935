const canvasWidth = 500
const canvasHeight = 500

export const templateQuote = {
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
		fill: '#FAA4BD'
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
		text: 'Life isn\'t about finding\nyourself. Life is about\ncreating yourself.',
		use: true,
		draggable: true,
		name: 'headertext',
		fontFamily: 'Playfair Display',
		fontSize: 36,
		lineHeight: 1,
		align: 'left',
		fill: '#ffffff',
		y: 220,
		x: 20,
		offsetX: 0,
		offsetY: 0,
		padding: 10,
		width: canvasWidth,
		centerVertical: false,
		centerHorizontal: false
	},
	configBodyText: {
		text: 'QUOTES',
		use: true,
		draggable: true,
		name: 'bodytext',
		fontFamily: 'Rubik',
		fontSize: 16,
		lineHeight: 1,
		align: 'left',
		fill: '#ffffff',
		y: 20,
		x: 20,
		offsetX: 0,
		offsetY: 0,
		padding: 10,
		width: 300,
		centerVertical: false,
		centerHorizontal: false
	},
	configCaption: {
		text: 'GEORGE BERNARD SHAW',
		use: true,
		draggable: true,
		name: 'caption',
		fontFamily: 'Rubik',
		fontSize: 12,
		lineHeight: 1,
		align: 'left',
		fill: '#ffffff',
		y: 460,
		x: 20,
		offsetX: 0,
		offsetY: 0,
		padding: 10,
		width: 300,
		centerVertical: false,
		centerHorizontal: false
	},
}