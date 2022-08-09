<template>
  <div class="container-app">
    <div v-show="isRepositioning" class="bg-repositioning">
      <croppie
        ref="croppie"
        :viewport="viewport"
        @update="update"
        @result="result"
      />
      <div class="bg-repositioning-buttons" style="padding: 16px 8px">
        <button ref="buttonTriggerCrop" class="btn btn-primary" @click="crop">Crop</button>
        <button class="btn btn-info" @click="showCropDialog(false)">Cancel</button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4">
        <form-content
          :header-text="configHeaderText.text"
          :body-text="configBodyText.text"
          :caption-text="configCaption.text"
          @use-header-text="useHeaderText"
          @change-header-text="changeHeaderText"
          @use-body-text="useBodyText"
          @change-body-text="changeBodyText"
          @use-caption="useCaption"
          @change-caption="changeCaption"
          @logo-uploaded="logoUploaded"
          @logo-removed="logoRemoved"
        />
        <search-images
          :get-image-id="imageIdFromTemplate"
          :init-filter="configBackgroundImage.filterLabel || null"
          @image-selected="handleImageSelected"
          @filter-changed="filterChanged"
          @flatcolor-selected="handleFlatcolorSelected"
        />
      </div>

      <div class="col-md-8" style="position: sticky; top: 0;">
        <div class="choose-sizes">
          Ukuran Kertas
          <el-select v-model="selectedPaperSize">
            <el-option
              v-for="item in PAPER_SIZES"
              :value="item"
              :key="item">
              {{ item }}
            </el-option>
          </el-select>
        </div>
        <div class="canvas-wrapper-all">
          <div class="card-relative">
            <div
              v-if="isEditingText.name"
              :style="computedStyle"
              class="text-settings Card-Base"
              @click.stop="stopIt">
              <div class="flex-container">
                <div class="flex-item">
                  <div class="field">
                    <el-select
                      v-model="editingTextValues.fontFamily"
                      :clearable="false"
                      @change="changeTextFontFamily"
                      style="width: 220px; padding: 2px; border-radius: 4px;">
                      <el-option
                       v-for="(item, key) in webfonts"
                       :key="key"
                       :value="item"
                       :label="item"
                      />
                    </el-select>
                  </div>
                </div>
                <div class="flex-item">
                    <div class="field">
                    <input
                      v-model="editingTextValues.fontSize"
                      type="number"
                      class="form-control"
                      style="width: 64px;"
                      @change="changeTextFontSize"
                    />
                  </div>
                </div>
                
                <div class="flex-item">
                  <div class="field">
                    <select
                      v-model="editingTextValues.align"
                      class="form-control"
                      @change="changeTextAlign">
                      <option value="center">Center</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="justify">Justify</option>
                    </select>
                  </div>	
                </div>

                <div class="flex-item">
                  <div class="field">
                    <button
                      v-if="!showColorPicker" 
                      :style="'background:' + editingTextValues.fill"
                      class="btn btn-outline-light"
                      @click="showColorPicker = true">
                      Color
                    </button>
                    <button
                      v-if="showColorPicker"
                      class="btn btn-outline-light"
                      @click="showColorPicker = false"
                    >
                      Close
                    </button>
                    <picker-chrome
                      v-if="showColorPicker"
                      v-model="editingTextValues.fill"
                      @input="changeTextColor"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-show="loading">
              Loading...
            </div>

            <v-stage
              v-show="!loading"
              ref="konvastage"
              :config="configKonva"
              @mousedown="handleStageMouseDown">
              <v-layer>
                <v-image
                  :config="configBackgroundImage"
                  ref="backgroundImage"
                />

                <v-rect :config="configRect" ref="wrapperImageBackground" />

                <v-image
                  v-if="configImage.image"
                  ref="contentLogo"
                  :config="configImage"
                  v-on:keyup.delete="logoRemoved()"
                />

                <v-image
                  v-if="configGraphic.image"
                  ref="contentGraphic"
                  :config="configGraphic"
                  v-on:keyup.delete="selectedEmoticon('none')"
                />

                <v-text
                  v-if="configHeaderText.use"
                  ref="headerText"
                  :config="configHeaderText"
                  @click="settingText"
                />

                <v-text
                  v-if="configBodyText.use"
                  ref="bodyText"
                  :config="configBodyText"
                  @click="settingText"
                />

                <v-text
                  v-if="configCaption.use"
                  ref="captionText"
                  :config="configCaption"
                  @click="settingText"
                />
                <v-transformer ref="transformer" :config="configTransformer" />
              </v-layer>
            </v-stage>

            <span v-if="dragCentered === true" class="centered-notif" />
            <span v-if="dragCenteredVertically === true" class="centered-vertically-notif" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const canvasWidth = 642
const canvasHeight = 453
const WebFontLoader = require('WebFontLoader')
import resizeImage from 'smart-img-resize'
import { templateDefault } from './templates/default'
import eventHub from '@/eventHub'
import SearchImages from './SearchImages'
import FormContent from './FormContent'
import { Chrome } from 'vue-color'
import Croppie from './components/Croppie'
import './components/VueKonva'

const PAPER_SIZES = [
  'A5',
  'Square'
]

export default {
  components: {
    SearchImages,
    FormContent,
    PickerChrome: Chrome,
    Croppie
  },

  props: {
    isSaving: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      PAPER_SIZES,
      // save
      selectedPaperSize: 'A5',
      configKonva: {
        width: canvasWidth,
        height: canvasHeight
      },
      configTransformer: {
        keepRatio: true,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        centeredScaling: true
      },
      // save
      configBackgroundImage: {
        image: '',
        name: 'backgroundImage',
        width: canvasWidth,
        height: canvasHeight,
        imageId: ''
      },
      configRect: {
        width: canvasWidth,
        height: canvasHeight,
        fillPatternImage: '',
        fillPatternScale: { x: 1, y: 1 },
        fillPatternRepeat: 'repeat-x',
        fill: ''
      },
      // save
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
      // save
      configHeaderText: {
        text: 'Awesome Header',
        use: true,
        draggable: true,
        name: 'headertext',
        fontFamily: 'Rubik',
        fontSize: 30,
        lineHeight: 1,
        fontStyle: 'normal',
        align: 'left',
        fill: '#ffffff',
        x: 20,
        y: 20,
        offsetX: 0,
        offsetY: 0
      },
      configBodyText: {
        text: 'Your text here',
        use: true,
        draggable: true,
        name: 'bodytext',
        fontFamily: 'Rubik',
        fontSize: 20,
        lineHeight: 1,
        fontStyle: 'normal',
        align: 'left',
        fill: '#ffffff',
        y: 80,
        x: 20,
        offsetX: 0,
        offsetY: 0
      },
      configCaption: {
        text: 'Your caption text',
        use: true,
        draggable: true,
        name: 'caption',
        fontFamily: 'Rubik',
        fontSize: 17,
        lineHeight: 1,
        fontStyle: 'normal',
        align: 'left',
        fill: '#ffffff',
        y: 120,
        x: 20,
        offsetX: 0,
        offsetY: 0
      },
      webfonts: [
        'Abril Fatface',
        'Rubik',
        'Roboto Slab',
        'Poppins',
        'Playfair Display',
        'Nunito',
        'Permanent Marker',
        'Caveat Brush',
        'Droid Sans',
        'Droid Serif'
      ],
      sizes: [
        {
          id: 'fb',
          icon: 'iconsocmed-facebook',
          name: 'Facebook Post Size',
          dimensions: [
            {
              name: '1080 x 1080 (px)',
              x: 500,
              y: 500
            },
            {
              name: '1200 x 628 (px)',
              x: 500,
              y: 261.7
            },
            {
              name: '940 x 788 (px)',
              x: 500,
              y: 419.1489361702128
            }
          ]
        },
        {
          id: 'linkedin',
          icon: 'iconsocmed-linkedin-logo',
          name: 'LinkedIn Post Size',
          dimensions: [
            {
              name: '1200 x 628 (px)',
              x: 500,
              y: 261.7
            }
          ]
        },
        {
          id: 'youtube',
          icon: 'iconsocmed-youtube',
          name: 'Youtube Video Cover',
          dimensions: [
            {
              name: '1280 x 720 (px)',
              x: 500,
              y: 281.25
            }
          ]
        },
        {
          id: 'twitter',
          icon: 'iconsocmed-twitter',
          name: 'Twitter Post Size',
          dimensions: [
            {
              name: '1200 x 675 (px)',
              x: 500,
              y: 281.25
            }
          ]
        },
        {
          id: 'ig',
          icon: 'iconsocmed-instagram',
          name: 'Instagram Post Size',
          dimensions: [
            {
              name: '1080 x 1080 (px)',
              x: 500,
              y: 500
            }
          ]
        }
      ],
      selectedShapeName: '',
      isRepositioning: false,
      selectedImage: '',
      rawImageUrl: '',
      rawImageUploaded: '',
      points: null,
      zoom: 0,
      isEditingText: {
        name: null,
        x: null,
        y: null
      },
      editingTextValues: {
        fontFamily: 'Rubik',
        fontSize: 14,
        align: 'left',
        fontStyle: 'normal',
        fill: '#ffffff',
        lineHeight: 1
      },
      showColorPicker: false,
      loading: false,
      selectedSize: 'fb',
      selectedSocialMediaName: 'Facebook Post Size',
      selectedDimension: {
        name: '1080 x 1080 (px)',
        x: 642,
        y: 453
      },
      fontLoaded: false,
      dragCentered: false,
      dragCenteredVertically: false,
      isDragging: false,
      imageIdFromTemplate: null,
      graphicFromTemplate: null,
      selectedTemplate: {},
      loadingSave: false
    }
  },

  computed: {
    computedStyle() {
      let plusMinus = 100
      if (this.isEditingText.y < 80) {
        plusMinus = - 30
      }
      const val = this.isEditingText.y - plusMinus
      return 'top:' + val + 'px'
    },
    optionsSizes()  {
      return this.sizes.filter(item => {
        return item.id === this.selectedSize
      })
    },
    viewport() {
      return {
        width: this.configKonva.width,
        height: this.configKonva.height
      }
    }
  },

  watch: {
    isSaving: {
      immediate: true,
      handler(payload) {
        if (payload) {
          this.handleSave()
        }
      }
    },
    formData: {
      immediate: true,
      deep: true,
      handler(payload) {
        this.handleEditFormData()
      }
    }
  },

  mounted() {
    //
    WebFontLoader.load({
      google: {
        families: this.webfonts
      },
      active: () => {
        this.fontLoaded = true
        this.setSelectedTemplate({
          name: 'default',
          display_name: 'Default',
          template: templateDefault
        })
      }
    })
    document.addEventListener('click', this.detachTransformerAndEverything)
    document.addEventListener('keyup', this.addKeyUpListener)
    eventHub.$on('download', this.download)
  },

  beforeDestroy() {
    document.removeEventListener('keyup', this.addKeyUpListener)
    document.removeEventListener('click', this.detachTransformerAndEverything)
  },

  methods: {
    stopIt() {
      console.log('do not update')
    },
    addKeyUpListener($event) {
      if ($event.isComposing || $event.keyCode === 229) {
        return
      }
      if ($event.keyCode === 46 || $event.keyCode === 8) {
        if (this.selectedShapeName === 'graphic') {
          this.selectedEmoticon('none')
        } else if (this.selectedShapeName === 'logo') {
          this.logoRemoved()
        }
        this.selectedShapeName = ''
        this.updateTransformer()
      }
    },
    detachTransformerAndEverything(e) {
      if (e.target && e.target.nodeName === 'CANVAS') {
        return
      }
      this.dragCentered = false
      this.dragCenteredVertically = false
      this.isEditingText.name = null
      this.isEditingText.x = null
      this.isEditingText.y = null
      this.editingTextValues.fill = '#fff'

      this.selectedShapeName = ''
      this.updateTransformer()
    },
    handleStageMouseDown(e) {
      this.isEditingText.name = null
      this.isEditingText.x = null
      this.isEditingText.y = null
      this.editingTextValues.fill = '#fff'
      // clicked on stage - cler selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = ''
        this.updateTransformer()
        return
      }

      // clicked on transformer - do nothing
      const clickedOnTransformer = e.target.getParent().className === 'Transformer'
      if (clickedOnTransformer) {
        return
      }

      const name = e.target.name()
      // console.log(name)
      if (name) {
        this.selectedShapeName = name
        this.updateTransformer()
      } else {
        this.selectedShapeName = ''
        this.updateTransformer()
      }
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getStage()
      const stage = transformerNode.getStage()
      const { selectedShapeName } = this

      const selectedNode = stage.findOne('.' + selectedShapeName)
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        this.dragCentered = false
        this.dragCenteredVertically = false
        transformerNode.detach()
        return
      }

      if (selectedNode) {
        // console.log(selectedNode)
        transformerNode.attachTo(selectedNode)

        let centerY = parseInt(this.configKonva.height / 2)
        let currentY = parseInt(selectedNode.attrs.y)
        let currentOffsetY = parseInt(selectedNode.height() / 2)

        if (((centerY - currentOffsetY) + selectedNode.attrs.offsetY) === currentY ) {
          this.dragCenteredVertically = true
        } else {
          this.dragCenteredVertically = false
        }

        let centerX = this.configKonva.width / 2
        let currentX = parseInt(selectedNode.attrs.x)

        if (centerX === currentX) {
          this.dragCentered = true
        } else {
          this.dragCentered = false
        }

        selectedNode.on('dragmove', (e) => {
          this.isDragging = true
          let realtimeX = parseInt(e.currentTarget.attrs.x)
          let realtimeY = parseInt(e.currentTarget.attrs.y)
          let realtimeOffsetY = parseInt(e.currentTarget.attrs.offsetY)
          
          if (((centerY - currentOffsetY) + realtimeOffsetY) === realtimeY ) {
            this.dragCenteredVertically = true
          } else {
            this.dragCenteredVertically = false
          }

          if (centerX === realtimeX) {
            this.dragCentered = true
          } else {
            this.dragCentered = false
          }
        })

        selectedNode.on('dragend', (e) => {
          this.isDragging = false
        })
      } else {
        this.dragCentered = false
        this.dragCenteredVertically = false
        transformerNode.detach()
      }
      transformerNode.getLayer().batchDraw()
    },
    useHeaderText(data) {
      this.configHeaderText.use = data
    },
    changeHeaderText(data) {
      this.configHeaderText.text = data
    },
    useBodyText(data) {
      this.configBodyText.use = data
    },
    changeBodyText(data) {
      this.configBodyText.text = data
    },
    useCaption(data) {
      this.configCaption.use = data
    },
    changeCaption(data) {
      this.configCaption.text = data
    },
    changeTextFontFamily(data) {
      if (!data) {
        if (this.isEditingText.name === 'headertext') {
          this.configHeaderText.align = 'Rubik'
        } else if (this.isEditingText.name === 'bodytext') {
          this.configBodyText.align = 'Rubik'
        } else if (this.isEditingText.name === 'caption') {
          this.configCaption.align = 'Rubik'
        }
      } else {
        if (this.isEditingText.name === 'headertext') {
          this.configHeaderText.fontFamily = data
        } else if (this.isEditingText.name === 'bodytext') {
          this.configBodyText.fontFamily = data
        } else if (this.isEditingText.name === 'caption') {
          this.configCaption.fontFamily = data
        }
      }
    },
    changeTextColor(data) {
      // console.log(this.isEditingText)
      if (this.isEditingText.name === 'headertext') {
        this.configHeaderText.fill = data.hex8
        this.editingTextValues.fill = data.hex8
      } else if (this.isEditingText.name === 'bodytext') {
        this.configBodyText.fill = data.hex8
      } else if (this.isEditingText.name === 'caption') {
        this.configCaption.fill = data.hex8
      }
    },
    changeTextAlign(data) {
      const value = this.editingTextValues.align
      if (this.isEditingText.name === 'headertext') {
        this.configHeaderText.align = value
      } else if (this.isEditingText.name === 'bodytext') {
        this.configBodyText.align = value
      } else if (this.isEditingText.name === 'caption') {
        this.configCaption.align = value
      }
    },
    changeTextFontStyle(data) {
      const value = this.editingTextValues.fontStyle

      if (this.isEditingText.name === 'headertext') {
        this.configHeaderText.fontStyle = value
      } else if (this.isEditingText.name === 'bodytext') {
        this.configBodyText.fontStyle = value
      } else if (this.isEditingText.name === 'caption') {
        this.configCaption.fontStyle = value
      }
    },
    changeTextFontSize(data) {
      const value = this.editingTextValues.fontSize

      if (this.isEditingText.name === 'headertext') {
        this.configHeaderText.fontSize = value
      } else if (this.isEditingText.name === 'bodytext') {
        this.configBodyText.fontSize = value
      } else if (this.isEditingText.name === 'caption') {
        this.configCaption.fontSize = value
      }
    },
    changeTextLineHeight(data) {
      const value = this.editingTextValues.lineHeight

      if (this.isEditingText.name === 'headertext') {
        this.configHeaderText.lineHeight = value
      } else if (this.isEditingText.name === 'bodytext') {
        this.configBodyText.lineHeight = value
      } else if (this.isEditingText.name === 'caption') {
        this.configCaption.lineHeight = value
      }
    },
    refreshCache() {
      const node = this.$refs.backgroundImage.getStage()
      node.cache()
      node.getLayer().batchDraw()
    },
    handleImageSelected(data) {
      this.loading = true
      this.points = []
      this.zoom = 0
      let imageUrl = ''

      // handle image from 3rdparty source
      if (data.urls) {
        imageUrl = data.urls.raw + '&w=' + this.configKonva.width * 2 + '&h=' + this.configKonva.height * 2 + '&fit=crop&crop=faces'
        this.selectedImage = data.urls.raw + '&w=' + this.configKonva.width * 2
        this.rawImageUrl = data.urls.raw
        this.configBackgroundImage.imageId = data.id
        this.fillImage(imageUrl)
      } else {
        this.rawImageUploaded = data.raw
        this.selectedImage = data.url
        this.rawImageUrl = ''
        this.resizeImageUploaded()
      }
    },
    resizeImage() {
      const imageUrl = this.rawImageUrl + '&w=' + this.configKonva.width * 2 + '&h=' + this.configKonva.height * 2 + '&fit=crop&crop=faces'
      // console.log(imageUrl)
      this.fillImage(imageUrl)
    },
    resizeImageUploaded() {
      const img = this.rawImageUploaded
      if (img) {
        resizeImage(img, {
          outputFormat: 'png',
          targetWidth: this.configKonva.width * 2,
          targetHeight: this.configKonva.height * 2,
          crop: true
        }, (err, b64img) => {
          if (err) {
            console.error(err)
            this.loading = false
            return
          }
          this.fillImage(b64img)
        })
      }
    },
    fillImage(imageUrl) {
      this.loading = true
      const image = new window.Image()
      image.crossOrigin = 'anonymous'
      image.src = imageUrl
      image.onload = () => {
        this.configRect.fill = ''
        this.configBackgroundImage.image = image
        this.configBackgroundImage.width = this.configKonva.width
        this.configBackgroundImage.height = this.configKonva.height
        this.$nextTick(() => {
          // console.log('ref', this.$refs.croppie)
          this.$refs.croppie.refresh()
          this.refreshCache()
        })
        this.loading = false
      }
    },
    handleFlatcolorSelected(data) {
      this.configRect.fillPatternImage = ''
      this.configBackgroundImage.image = ''
      this.configRect.fill = data
      // this.$nextTick(() => {
      // 	this.refreshCache()
      // })
    },
    renderCroppedImage(output) {
      let options = {
        format: 'png',
        type: 'base64',
        quality: 1,
        size: 'original'
      }

      this.$refs.croppie.result(options, output => {
        // console.log(output)
        const image = new window.Image()
        image.crossOrigin = 'anonymous'
        image.src = output
        image.onload = () => {
          this.configBackgroundImage.image = image
          this.configBackgroundImage.width = this.configKonva.width
          this.configBackgroundImage.height = this.configKonva.height
          this.$nextTick(() => {
            this.refreshCache()
          })
        }
        this.isRepositioning = false
      })
    },
    result(output) {
      this.renderCroppedImage(output)
    },
    update(data) {
      this.points = data.points
      this.zoom = data.zoom
    },
    crop(output) {
      this.renderCroppedImage(output)
    },
    showCropDialog(bool) {
      this.$refs.croppie.$refs.croppieRef.bind({
        url: this.selectedImage,
        points: this.points,
        zoom: this.zoom
      })
      this.isRepositioning = bool
    },
    filterChanged(data) {
      console.log('filterChanged', data)
      if (data && data.value) {
        this.refreshCache()
        this.$set(this.configBackgroundImage, 'filters', data.value)
        this.$set(this.configBackgroundImage, 'filterLabel', data.label)
        if (data.config) {
          data.config.map(item => {
            this.$set(this.configBackgroundImage, item.name, item.value)
          })
        }
      } else {
        this.$delete(this.configBackgroundImage, 'filters')
        this.$nextTick(() => {
          this.refreshCache()
        })
      }
    },
    detachTextSetting() {
      // console.log('detach')
      this.isEditingText.name = null
    },
    settingText(val) {
      // console.log(val)
      if (this.isEditingText.name === val.target.attrs.name) {
        this.detachTextSetting()
      } else {
        this.isEditingText.name = val.target.attrs.name
        this.isEditingText.y = val.target.attrs.y
        this.isEditingText.x = val.target.attrs.x
        this.editingTextValues = { ...this.editingTextValues, ...val.target.attrs }
      }
    },
    changeSize(size) {
      this.selectedSocialMediaName = size.name
      this.selectedSize = size.id
      this.selectedDimension = {
        name: this.optionsSizes[0].dimensions[0].name,
        x: this.optionsSizes[0].dimensions[0].x,
        y: this.optionsSizes[0].dimensions[0].y
      }
      this.changeDimension()
    },
    changeDimension() {
      this.points = []
      this.zoom = 0

      this.configKonva.width = this.selectedDimension.x
      this.configKonva.height = this.selectedDimension.y

      this.configRect.width = this.selectedDimension.x
      this.configRect.height = this.selectedDimension.y

      this.checkOverlapXY()

      this.$nextTick(() => {
        this.$refs.croppie.refresh()
        if (!this.configRect.fill) {
          if (!this.rawImageUrl) {
          this.resizeImageUploaded()
          } else {
            this.resizeImage()
          }
        }
      })
    },
    async checkOverlapXY() {
      if (this.configHeaderText.use) {
        this.configHeaderText.y = 20
        if (this.configHeaderText.offsetY) {
          this.configHeaderText.offsetY = 0
        }
      }

      if (this.configCaption.use) {
        this.configCaption.y = 160
        if (this.configCaption.offsetY) {
          this.configCaption.offsetY = 0
        }
      }

      if (this.configBodyText.use) {
        this.configBodyText.y = 220
        if (this.configBodyText.offsetY) {
          this.configBodyText.offsetY = 0
        }
      }
    },
    dataURIToBlob(dataURI) {
      const binStr = atob(dataURI.split(',')[1])
      const len = binStr.length
      const arr = new Uint8Array(len)

      for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i)
      }
      // service.post('/download').then(response => {
      //   console.log(response)
      // })
      this.downloadCallback(new Blob([arr]))
    },
    downloadCallback(blob) {
      const fileName = this.configHeaderText.text + '_' + this.selectedSize + '_' + this.selectedDimension.name.replace(/\s/g, "") + '.png'

      const link = document.createElement('a')
      link.download = fileName
      // link.innerHTML = 'download'

      // the string representation of the object URL will be small enough to workaround the browser's limitations
      link.href = URL.createObjectURL(blob)
      // you must revoke the object URL, 
      //   but since we can't know when the download occured, we have to attach it on the click handler..
      document.body.appendChild(link)
      link.click()
      link.onclick = function() {
          // ..and to wait a frame
          requestAnimationFrame(function() {
            URL.revokeObjectURL(link.href)
          })
          document.body.removeChild(link)
        }
    },
    download(pixelRatio) {
      const transformerNode = this.$refs.transformer.getStage()
      transformerNode.detach()
      const stage = this.$refs.konvastage.getStage()
      // let pixelRatio = window.pixelRatio
      const dataURL = stage.toDataURL({ pixelRatio })
      this.dataURIToBlob(dataURL)
    },
    logoUploaded(logo) {
      const image = new window.Image()
      image.crossOrigin = 'anonymous'
      image.src = logo
      image.onload = () => {
        this.configImage.image = image
      }
    },
    logoRemoved() {
      this.configImage.image = ''
    },
    selectedEmoticon(graphic, fromTemplate = false) {
      if (!fromTemplate) {
        this.$delete(this.configGraphic, 'width')
        this.$delete(this.configGraphic, 'height')
      }
      if (graphic !== 'none') {
        const image = new window.Image()
        image.crossOrigin = 'anonymous'
        image.src = '/images/graphics/' + graphic + '.png'
        image.onload = () => {
          this.configGraphic.image = image
        }
      } else {
        this.configGraphic.image = ''
      }
    },
    resetSizeAndSocmed() {
      this.selectedSize = 'fb',
      this.selectedSocialMediaName = 'Facebook Post Size',
      this.selectedDimension = {
        name: '1080 x 1080 (px)',
        x: 642,
        y: 453
      }

      this.configKonva.width = 642
      this.configKonva.height = 453
      this.configRect.width = 642
      this.configRect.height = 453

      this.$nextTick(() => {
        this.$refs.croppie.refresh()
        if (!this.configRect.fill) {
          if (!this.rawImageUrl) {
            this.resizeImageUploaded()
          } else {
            this.resizeImage()
          }
        }
      })
    },
    async setSelectedTemplate(data) {
      this.resetSizeAndSocmed()

      this.selectedTemplate = { ...data }
      if (data.template.configBackgroundImage.image) {
        this.imageIdFromTemplate = data.template.configBackgroundImage.image
      }

      this.configRect = { ...this.configRect, ...data.template.configRect }

      this.configCaption = await Object.assign({}, this.configCaption, data.template.configCaption)
      if (!this.formData.configHeaderText) {
        this.configHeaderText = await Object.assign({}, this.configHeaderText, data.template.configHeaderText)
      }
      this.configBodyText = await Object.assign({}, this.configBodyText, data.template.configBodyText)

      const konva = await this.$refs.konvastage.getStage()

      const headerText = await this.$refs.headerText.getStage()
      const bodyText = await this.$refs.bodyText.getStage()

      if (data.template.configCaption.use) {
        const captionText = await this.$refs.captionText.getStage()
        if (data.template.configCaption.centerHorizontal) {
          this.configCaption.x = konva.width() / 2
          this.configCaption.offsetX = captionText.width() / 2
        }
        if (data.template.configCaption.centerVertical) {
          this.configCaption.y = konva.height() / 2
          this.configCaption.offsetY = captionText.height() / 2
        }
      }

      // centered horizontal
      if (data.template.configHeaderText.centerHorizontal) {
        this.configHeaderText.x = konva.width() / 2
        this.configHeaderText.offsetX = headerText.width() / 2
      }
      if (data.template.configBodyText.centerHorizontal) {
        this.configBodyText.x = konva.width() / 2
        this.configBodyText.offsetX = bodyText.width() / 2
      }

      // centered vertical
      if (data.template.configHeaderText.centerVertical) {
        this.configHeaderText.y = konva.height() / 2
        this.configHeaderText.offsetY = headerText.height() / 2
      }
      if (data.template.configBodyText.centerVertical) {
        this.configBodyText.y = konva.height() / 2
        this.configBodyText.offsetY = bodyText.height() / 2
      }

      // check graphic
      if (data.template.configGraphic.image) {
        this.$set(this.configGraphic, 'width', data.template.configGraphic.width)
        this.$set(this.configGraphic, 'height', data.template.configGraphic.height)
        this.graphicFromTemplate = data.template.configGraphic.image
        this.selectedEmoticon(this.graphicFromTemplate, true)

        if (data.template.configGraphic.centerVertical) {
          this.configGraphic.y = konva.height() / 2
          this.configGraphic.offsetY = headerText.height() / 2
        } else {
          this.configGraphic.y = data.template.configGraphic.y
          this.configGraphic.offsetY = data.template.configGraphic.offsetY
        }

        if (data.template.configGraphic.centerHorizontal) {
          this.configGraphic.x = konva.width() / 2
          this.configGraphic.offsetX = headerText.width() / 2
        } else {
          this.configGraphic.x = data.template.configGraphic.x
          this.configGraphic.offsetX = data.template.configGraphic.offsetX
        }
      } else {
        this.$delete(this.configGraphic, 'width')
        this.$delete(this.configGraphic, 'height')
        this.graphicFromTemplate = null
        this.selectedEmoticon('none', true)
      }
      // check filters 
      if (data.template.filter) {
        this.filterChanged(data.template.filter)
      }
      this.refreshCache()
    },
    handleSave() {
      this.loadingSave = true
      setTimeout(() => {
        localStorage.setItem(
          'olsbo_marketingdesigner',
          JSON.stringify({
            selectedPaperSize: this.selectedPaperSize,
            configBackgroundImage: this.configBackgroundImage,
            configImage: this.configImage,
            configHeaderText: this.configHeaderText
          })
        )
        this.loadingSave = false
        this.$emit('saved')
      }, 5000)
    },
    handleEditFormData() {
      if (this.formData) {
        this.selectedPaperSize = this.formData.selectedPaperSize
        this.configBackgroundImage = { ...this.formData.configBackgroundImage, image: '', filters: function() {} }
        this.configImage = { ...this.formData.configImage }
        this.configHeaderText = { ...this.formData.configHeaderText }
        // image handler
        this.imageIdFromTemplate = this.formData.configBackgroundImage.imageId || null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-container {
	display: flex;
	flex-wrap: wrap;
}

.canvas-wrapper-all {
	position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

	.btn-trigger-reposition {
		z-index: 5;
		color: #2e384d;
		border: solid 1px #e0e7ff;
  		background-color: #f4f6fc;
  		border-radius: 4px;
		padding: 8px 16px;
		font-size: 13px;
		text-align: center;
	}

}

.selected-social-media-name {
	font-family: Rubik;
	font-size: 15px;
	font-weight: 500;
	font-style: normal;
	font-stretch: normal;
	line-height: normal;
	letter-spacing: normal;
	color: #2e384d;
	position: relative;
    top: 7px;
    left: 10px;
}

.canvas-wrapper-all:hover {
	.btn-trigger-reposition {
		display: inline-block;
	}
}

.bg-repositioning {
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	z-index: 999;

	.croppie-container {
		height: 90%;
		background: rgba(#2e384d, 0.9);

		.cr-slider-wrap {
			background: #fff;
			height: 80px;
			bottom: 0;
			left: 0;
			width: 100%;
			margin: 0 0 0 0;

			.cr-slider {
				padding-top: 33px;
			}
		}
	}

	.bg-repositioning-buttons {
		.btn-info {
			background: #fff;
			color: #2e5bff;
			border: 1px solid #fff;
		}
	}
}

.Card-Base {
  	width: 428px;
  	opacity: 0.95;
  	border-radius: 4px;
  	border: solid 1px rgba(46, 91, 255, 0.08);
  	background-color: #2e384d;
}

.text-settings {
	position: absolute;
	z-index: 999;
	max-width: 480px;
	left: 0;
	right: 0;
	margin: auto;
	width: 100%;
	padding: 10px;

	.field {
		color: #fff;
		width: 100%;
		padding: 4px;
		position: relative;

		.vc-chrome {
			position: absolute;
		}

		label {
			display: block;
			font-size: 12px;
			color: #b0bac9;
			line-height: 1;
		}

		.v-select,
		select,
		input {
			background: transparent;
			color: #fff;
			border: 1px solid #fff;

			.selected-tag {
				color: #fff;
			}

			input {
				border: none;
			}
		}
	}
}

.card-relative {
	position: relative;
}

.canvas-header {
	background: #fff;
	padding: 8px;
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
  	border: solid 1px rgba(46, 91, 255, 0.08);
  	border-bottom: none;
}

.choose-sizes {
	text-align: center;
	margin-bottom: 16px;
	background: #fff;
	padding: 16px;
	border-radius: 4px;
  	border: solid 1px rgba(46, 91, 255, 0.08);
}

.size-item {
	position: relative;
	display: inline-block;
	width: 46px;
	height: 46px;
	margin: 0 8px;
	background: rgba(46, 91, 255, 0.08);
	color: #bfc5d2;
	text-align: center;
	border-radius: 100%;
	font-size: 23px;
    vertical-align: middle;
    line-height: 46px;

    .checked {
		position: absolute;
		bottom: 0;
		right: 0;
		color: #fff;
		width: 18px;
		height: 18px;
		border-radius: 100%;
		text-align: center;
		font-size: 8px;
		vertical-align: middle;
		line-height: 18px;
		background: #2e5bff;
	}
}

.konvajs-content {
	background: #fff;
}

.card-subtitle {
	color: #b0bac9 !important;
	font-size: 12px;
	letter-spacing: 1.1px;
	text-transform: uppercase;
	font-weight: normal;
}

.col-8 {
	.card-subtitle {
		position: relative;
		top: 8px;
	}
}

.card-title {
	color: #2e384d;
	font-size: 15px;
	font-weight: 500;
}

// .form-control {
// 	border-radius: 5px;
// 	border: solid 1px #e0e7ff;
// 	background-color: rgba(224, 231, 255, 0.2);
// }

.centered-notif {
	position: absolute;
	width: 2px;
	height: 100%;
	background: #4a90e2;
	content: '';
	z-index: 10;
	top: 0;
	left: 50%;
	display: block;
}

.centered-vertically-notif {
	position: absolute;
	width: 100%;
	height: 2px;
	background: #4a90e2;
	content: '';
	z-index: 10;
	top: 50%;
	left: 0;
	display: block;
}

.btn-trigger-dialog {
	border-color: #e0e7ff !important;
	color: #2e384d !important;

	i {
		color: #e0e7ff !important;
	}

	&:hover {
		color: #fff !important;
	}
}

</style>
