<template>
	<div class="card mb-16">
		<div class="card-body">
			<div class="form-content">
				<h5 class="card-title">Nama Promosi</h5>
				<hr />
				<div class="row">
					<!-- <div class="col-8">
						<h6 class="card-subtitle text-muted">Header Text</h6>
					</div> -->
					<div class="col-4">
						<!-- <toggle-button
							:value="useHeaderText"
							color="#33ac2e"
							@change="changeUseHeaderText"
						/> -->
					</div>
				</div>

				<textarea class="form-control" v-model="localHeaderText"/>
			</div>

			<!-- <div class="form-content">
				<div class="row">
					<div class="col-8">
						<h6 class="card-subtitle text-muted">Body Text</h6>
					</div>

					<div class="col-4">
						<toggle-button
							:value="useBodyText"
							color="#33ac2e"
							@change="changeUseBodyText"
						/>
					</div>
				</div>

				<textarea class="form-control" v-model="localBodyText" />
			</div>

			<div class="form-content">
				<div class="row">
					<div class="col-8">
						<h6 class="card-subtitle text-muted">Caption</h6>
					</div>

					<div class="col-4">
						<toggle-button
							:value="useCaption"
							color="#33ac2e"
							@change="changeUseCaption"
						/>
					</div>
				</div>

				<textarea class="form-control" v-model="localCaption" />
			</div> -->

			<hr />

			<!-- <div class="form-content">
				<vue-dropzone
					ref="myVueDropzone"
					id="dropzone"
					:options="dropzoneOptions"
					:useCustomSlot="true"
					@vdropzone-success="dropzoneSuccess"
					@vdropzone-removed-file="dropzoneRemoveFile"
				>
					<div class="dropzone-custom-content">
						<i class="fontello-picture"></i>
					<div class="subtitle">
						Upload or Drag Logo Here
					</div>
				</div>
				</vue-dropzone>
			</div> -->
		</div>
	</div>
</template>

<script>
export default {
	props: ['headerText', 'bodyText', 'captionText'],

	data() {
		return {
			useHeaderText: true,
			useBodyText: true,
			useCaption: true,
			localHeaderText: this.headerText,
			localBodyText: this.bodyText,
			localCaption: this.captionText,
			logo: '',
			dropzoneOptions: {
				url: '/api/upload',
				thumbnailWidth: 150,
				maxFilesize: 0.5,
				headers: {
					'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
				},
				maxFilesize: 4,
				maxFiles: 1,
				addRemoveLinks: true,
				thumbnailWidth: 230,
				thumbnailHeight: 230
			}
		}
	},

	watch: {
		localHeaderText: {
			handler(data) {
				this.$emit('change-header-text', data)
			},
			immediate: true
		},
		localBodyText: {
			handler(data) {
				this.$emit('change-body-text', data)
			},
			immediate: true
		},
		localCaption: {
			handler(data) {
				this.$emit('change-caption', data)
			},
			immediate: true
		},
		headerText: {
			handler(data) {
				this.localHeaderText = data
			},
			immediate: true
		},
		bodyText: {
			handler(data) {
				this.localBodyText = data
			},
			immediate: true
		},
		captionText: {
			handler(data) {
				this.localCaption = data
			},
			immediate: true
		}
	},

	methods: {
		changeUseHeaderText(data) {
			this.useHeaderText = data.value
			this.$emit('use-header-text', data.value)
		},

		changeUseBodyText(data) {
			this.useBodyText = data.value
			this.$emit('use-body-text', data.value)
		},

		changeUseCaption(data) {
			this.useBodyText = data.value
			this.$emit('use-caption', data.value)
		},

		dropzoneSuccess(file, response) {
			this.logo = response.file
			this.$emit('logo-uploaded', this.logo)
		},

		dropzoneRemoveFile() {
			this.logo = ''
			this.$emit('logo-removed')
		}
	}
}
</script>

<style lang="scss">
.form-content {
	margin-bottom: 22px;
}

.vue-dropzone {
	height: auto;
  	border-radius: 5px;
  	border: dashed 1px #e0e7ff;
  	min-height: auto;
    padding: 0 0 0 0;

    .dz-message {
    	margin: 15px 0;
	}
}

.dropzone .dz-preview .dz-image img {
	max-width: 100%;
	width: 100%;
	height: auto;
}
</style>
