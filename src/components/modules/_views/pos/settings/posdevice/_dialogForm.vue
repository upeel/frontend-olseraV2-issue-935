<template>
  <el-dialog
    :visible.sync="show"
    :before-close="beforeClose"
    :show-close="false"
    append-to-body>
    <div slot="title" class="flex-container">
      <h4 style="flex-grow: 1;">{{ lang.add }} {{ lang.pos_device }}</h4>
      <div>
        <el-button
          type="info"
          @click="beforeClose">
          {{ lang.cancel }}
        </el-button>
        <el-button
          :loading="loading"
          @click="save"
          type="success"
          icon="el-icon-check">
          {{ lang.save }}
        </el-button>
      </div>
    </div>

    <el-form v-model="data" label-width="120px">
      <div style="margin-bottom: 20px;">
        <el-alert
          :title="lang.info_pos_device_registration"
          type="info"
          show-icon>
        </el-alert>
      </div>
      <el-form-item :label="lang.serial_no" :required="true">
        <el-input type="text" v-model="data.serial"></el-input>
        <p class="size-12 input-desc oldgrey cursor-pointer clickable" @click="dialogVisible = true">
          {{ rootLang.how_to_get_serial }}
        </p>
      </el-form-item>
      <el-form-item :label="lang.name">
        <el-input type="text" v-model="data.remark"></el-input>
        <p class="size-12 input-desc oldgrey">
          {{ lang.info_pos_remark }}
        </p>
      </el-form-item>
    </el-form>

    <el-dialog
      :visible.sync="dialogVisible"
      title="Tips"
      width="420px"
      append-to-body
      modal-append-to-body>
      <div class="dialog-body">
        <p>{{ lang.info_find_pos_device_serial }}</p>
        <img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/help_device_serial.png" />
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
export default {
  props: ['saved', 'loading', 'formData', 'show'],

  data() {
    return {
      data: {},
      dialogVisible: false,
    }
  },

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    rootLang() {
      return this.$lang[this.langId]
    }
  },

  watch: {
  },

  methods: {
    beforeClose() {
      this.$emit('close')
    },
    save() {
      let data = Object.assign({}, this.data)
      this.$emit('save', data)
    },
    remove() {
      this.$emit('remove', {id: this.data.id})
    }
  }
}
</script>
