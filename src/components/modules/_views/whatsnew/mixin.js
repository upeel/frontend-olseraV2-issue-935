import LazyImage from '@/components/LazyImage'
const moment = require('moment')
const mixin = {
  components: {
    LazyImage
  },
  props: ['data'],
  computed: {
    computedData() {
      if (this.data) {
        const data = { ...this.data }
        if (data.feature_image_2) {
          data.single_image = data.feature_image_2
        } else {
          data.single_image = data.feature_image
        }
        data.date = moment(data.date).format('D MMMM YYYY')
        return data
      } else {
        return {
          setting: {}
        }
      }
    }
  }
}

export default mixin
