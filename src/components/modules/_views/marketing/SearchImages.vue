<template>
  <div>
    <div class="card mb-16">
			<div class="card-body">
				<div class="form-card">
					<h5 class="card-title">Warna Theme</h5>
					<div class="color-list">
						<span
							v-for="(item, key) in flatcolors"
							:style="'background: ' + item"
							:key="key"
							class="color-item"
							@click="selectFlatColor(item)"
						/>
					</div>
				</div>

				<hr />

				<div class="form-card">
					<h6 class="card-subtitle mb-2 text-muted">Images</h6>
					<input
						v-model="params.query"
						type="search"
						name="search"
						class="form-control"
						placeholder="Search"
						@change="searchImages"
					/>

					<div class="image-feeds">
						<div class="wrapper-image-feeds">
							<div class="row-image-feeds">
								<template v-if="loading">
									Loading...
								</template>

								<template v-else>
									<div
										v-for="(item, key) in images"
										:key="key"
										class="image-thumb"
										@click="selectImage(item)">
										<div class="wrapper-image-thumb">
											<img v-if="item.urls" :src="item.urls.raw + '&w=107&h=107&fit=crop&crop=faces'" />
											<img v-else :src="item.url" width="320" />
										</div>
										<template v-if="selectedImage.id === item.id">
											<div class="selected-image-border" />
											<span class="selected-image"><i class="fontello-ok" /></span>
										</template>
									</div>
								</template>

								<!-- <infinite-loading force-use-infinite-wrapper="wrapper-image-feeds" @infinite="nextPage" /> -->
							</div>
						</div>
					</div>
				</div>

				<div class="form-card" style="padding-top: 8px;">
					<button class="btn btn-secondary btn-block btn-upload-background" @click="uploadImage">Upload</button>
					<input ref="upload-file" type="file" style="display: none;" @change="onFileChange">
				</div>
			</div>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="form-card">
          <h5 class="card-title">Image Effect</h5>
          <el-button
						v-for="(item) in filteredList"
						:key="item.label"
						class="mb-4 mr-4"
						style="margin-left: 0;"
						@click="handleFilterChanged(item)">
						<div
							v-if="item !== 'none'"
							:class="{ active: selectedFilter && selectedFilter.label === item.label }">
							{{ item.label }}
							<span v-if="selectedFilter && selectedFilter.label === item.label" class="selected-image"><i class="fontello-ok" /></span>
						</div>
					</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Konva = require('konva')
import service from '@/api/unsplash'
export default {
	props: ['getImageId', 'initFilter'],

	data() {
		return {
			loading: false,
			showDialogFilter: false,
			searchText: '',
			images: [],
			uploadedImage: '',
			selectedImage: '',
			selectedFlatColor: '',
			imageIdFromTemplate: null,
			params: {
				query: '',
				page: 1,
				per_page: 30,
				count: 30
			},
			selectedFilter: {
				label: 'None'
			},
			filters: [
				{
					label: 'None',
					thumb: 'None',
					value: null
				},
				{
					label: 'Dark Overlay',
					thumb: 'dark-overlay-70',
					value: [Konva.Filters.HSV],
					config: [
						{
							name: 'value',
							value: -0.7
						}
					]
				},
				{
					label: 'Blur',
					thumb: 'Blur',
					value: [Konva.Filters.Blur, Konva.Filters.HSV],
					config: [
						{
							name: 'blurRadius',
							value: 10
						},
						{
							name: 'value',
							value: -0.2
						}
					]
				},
				{
					label: 'Grayscale',
					thumb: 'Grayscale',
					value: [Konva.Filters.Grayscale, Konva.Filters.HSV],
					config: [
						{
							name: 'value',
							value: -0.2
						}
					]
				},
				{
					label: 'Vintage',
					thumb: 'Vintage',
					value: [Konva.Filters.Noise, Konva.Filters.HSV],
					config: [
						{
							name: 'noise',
							value: 0.3
						},
						{
							name: 'value',
							value: -0.2
						}
					]
				}
			],
			flatcolors: [
				'#7a7d7d',
				'#0a8754',
				'#25ced1',
				'#23ce6b',
				'#f0cf65',
				'#f34213'
			]
		}
	},

	computed: {
		filteredList() {
			return this.filters.filter(item => {
				return item.label.toLowerCase().includes(this.searchText.toLowerCase())
			})
		}
	},

	watch: {
		getImageId(id) {
			this.imageIdFromTemplate = id
			this.getImageFromTemplate()
		},
		initFilter: {
			immediate: true,
			handler(label) {
				this.getImageFilterFromTemplate()
			}
		}
	},

	mounted() {
		this.getInitImage()
	},

	methods: {
		handleShowDialog() {
			if (this.showDialogFilter) {
				this.showDialogFilter = false
			} else {
				this.showDialogFilter = true
			}
		},
		getInitImage() {
			this.loading = true
			this.images = []
			let imageId = 'GFrBMipOd_E'
			if (this.getImageId) {
				imageId = this.getImageId
			}
			service.get('photos/' + imageId).then(response => {
				this.images.push(response.data)
				this.selectImage(this.images[0])
				this.getImages()
				this.loading = false
			})
		},
		getImageFromTemplate() {
			this.loading = true
			const imageId = this.imageIdFromTemplate
			service.get('photos/' + imageId).then(response => {
				this.images.unshift(response.data)
				this.selectImage(this.images[0])
				this.loading = false
			})
		},
		getImages($state) {
			this.loading = true
			this.params.query = ''
			this.params.per_page = this.params.per_page - 1
			this.params.count = this.params.count - 1
			service.get('photos/random', {
				params: this.params
			}).then(response => {
				this.images.push(...response.data)
				this.loading = false
			})
		},
		searchImages($state) {
			this.loading = true
			this.params.per_page = 30
			this.params.count = 30
			service.get('search/photos', {
				params: this.params
			}).then(response => {
				this.images.unshift(...response.data.results)
				this.loading = false
			})
		},
		nextPage($state) {
			if (this.params.query) {
				this.searchImages($state)
			} else {
				this.getImages($state)
			}
		},
		selectImage(image) {
			this.selectedImage = image
			this.$emit('image-selected', this.selectedImage)
		},
		selectFlatColor(color) {
			this.selectedFlatColor = color
			this.$emit('flatcolor-selected', color)
		},
		handleFilterChanged(val) {
			if (val) {
				this.selectedFilter = val
				this.$emit('filter-changed', val)
			}
		},
		uploadImage() {
			this.uploadedImage = ''
			this.$refs['upload-file'].click()
		},
		onFileChange(e) {
			var files = e.target.files || e.dataTransfer.files
			if (!files.length) {
				return
			}
			this.createImage(files[0])
		},
		createImage(file) {
			const reader = new FileReader()
			reader.onload = (e) => {
				this.uploadedImage = e.target.result
				const imageData = {
					id: new Date('His'),
					url: this.uploadedImage,
					raw: file
				}
				this.images.unshift(imageData)
				this.selectImage(imageData)
			}
			reader.readAsDataURL(file)
    },
		async getImageFilterFromTemplate() {
			if (this.initFilter) {
				this.selectedFilter.label = this.initFilter
				const selectedFilter = await this.filters.find(item => {
					return item.label === this.initFilter
				})
				this.handleFilterChanged(selectedFilter)
			}
		}
	}
}
</script>

<style lang="scss">
.color-list {
	line-height: 1;
	span {
		content: '';
		height: 20px;
		width: 20px;
		display: inline-block;
		margin-right: 8px;
		margin-bottom: 6px;
		border-radius: 3px;
	}
}

.image-feeds {
	margin-left: -8px;
	margin-right: -8px;

	.wrapper-image-feeds {
		height: 320px;
		width: 100%;
		overflow-y: auto;
	}

	.row-image-feeds {
		&:after {
			display: block;
			content: '';
			clear: both;
		}
	}

	.image-thumb {
		position: relative;
		float: left;
		width: 75px;
		margin: 8px;
		height: 75px;
		border: 1px solid #ddd;
		border-radius: 4px;

		.wrapper-image-thumb {
			overflow: hidden;
			height: 100%;
			width: 100%;
		}

		.selected-image {
			position: absolute;
			width: 18px;
			height: 18px;
			border-radius: 100%;
			background: #2e5bff;
			color: #fff;
			text-align: center;
			line-height: 18px;
			bottom: -10px;
    		right: -10px;
    		font-size: 10px;
		}

		.selected-image-border {
			position: absolute;
			left: -2px;
		    top: -2px;
		    width: 76px;
		    height: 76px;
			background: transparent;
			border: 2px solid #2e5bff;
			border-radius: 8px;
			display: block;
			content: '';
		}
	}
}

.btn-upload-background {
	background: #f4f6fc;
	border-radius: 4px;
	font-size: 15px;
	color: #2e5bff;
	border: none;
}
</style>

