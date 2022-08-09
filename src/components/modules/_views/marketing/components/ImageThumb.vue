<template>
  <el-avatar
    v-loading="loading"
    :src="imageSrc"
  />
</template>

<script>
import service from '@/api/unsplash'
export default {
  props: {
    imageId: ''
  },

  data() {
    return {
      loading: false,
      imageSrc: ''
    }
  },

  watch: {
    imageId: {
      immediate: true,
      handler(payload) {
        this.getImage()
      }
    }
  },

  methods: {
    getImage() {
      this.loading = true
      if (this.imageId) {
        service.get('photos/' + this.imageId).then(response => {
          this.imageSrc = response.data.urls.thumb
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>
