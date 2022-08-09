<template>
  <div>
    <el-popover
    v-if="!tokopedia"
    placement="top"
    width="160"
    v-model="visible">
    <p class="word-break text-left">Add-On akan {{ data.is_available === 1 ? '"Tersedia"' : '"Tidak tersedia"' }} untuk seluruh item yang menggunakan Add-On ini</p>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="info" class="btn-block" @click="cancel">{{ lang.cancel }}</el-button>
      <el-button type="primary" size="mini" class="btn-block" @click="confirm">Ya, Lanjutkan</el-button>
    </div>
    <el-switch
      slot="reference"
      v-model="data.is_available"
      :active-value="1"
      :inactive-value="0"
      class="mr-8 ml-8"
      @change="visible = true">
    </el-switch>
    <el-switch
      v-if="tokopedia"
      slot="reference"
      v-model="data"
      :active-value="1"
      :inactive-value="0"
      class="mr-8 ml-8"
      @change="visible = true">
    </el-switch>
    <!-- <el-button v-if="!block" slot="reference" icon="el-icon-delete" />
    <el-button v-else :loading="loading" class="btn-block color-danger" slot="reference" icon="el-icon-delete" > {{ rootLang.delete }} </el-button> -->
  </el-popover>
  <el-popover
    v-if="tokopedia"
    placement="top"
    width="160"
    v-model="visibleShow">
    <p v-if="!message" class="word-break text-left">Product akan {{ data === 1 ? '"Tersedia"' : '"Tidak tersedia"' }} di Tokopedia</p>
    <p v-else class="word-break text-left">{{ message }}</p>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="info" class="btn-block" @click="cancel">{{ lang.cancel }}</el-button>
      <el-button type="primary" size="mini" class="btn-block" @click="confirm">Ya, Lanjutkan</el-button>
    </div>
    <el-switch
      v-if="tokopedia"
      slot="reference"
      v-model="data"
      :active-value="1"
      :inactive-value="0"
      class="mr-8 ml-8"
      @change="changeVisibility">
    </el-switch>
  </el-popover>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  props: ['visible', 'data', 'loading', 'tokopedia', 'message'],
  mixins: [basicComputedMixin],
  data() {
    return {
      visible: false,
      visibleShow: false
    }
  },

  computed: {
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  methods: {
    confirm() {
      this.tokopedia ? this.$emit('confirm', this.data) : this.$emit('confirm')
      this.tokopedia ? this.visibleShow = false : this.visible = false
    },
    cancel() {
      this.$emit('cancel')
      this.tokopedia ? this.visibleShow = false : this.visible = false
      if (this.tokopedia) {
        this.data === 0 ? this.data = 1 : this.data = 0
      }
    },
    changeVisibility (data) {
      console.log('data', data)
      // this.visibleShow = true
    }
  }
}
</script>
