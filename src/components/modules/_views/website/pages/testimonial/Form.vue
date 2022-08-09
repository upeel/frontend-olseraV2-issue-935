<template>
  <div>
    <el-card v-loading="loading">
      <div slot="header" class="clearfix">
        <el-row :gutter="10">
          <el-col :md="12">
            <h4>{{lang.add}} {{ lang.testimonial }}</h4>
          </el-col>
          <el-col :md="12" class="text-right">
            <el-button
              size="small"
              @click="cancel"
              type="info">
              {{ lang.cancel }}
            </el-button>
            <el-button
              :disabled="disabledSave"
              size="small"
              @click="save"
              type="success"
              icon="el-icon-check">
              {{ lang.save }}
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div class="card-body">
        <el-form v-model="data" label-width="120px">
          <el-form-item :label="lang.name" :required="true">
            <el-input type="text" v-model="data.name" :placeholder="this.$lang[langId].please_input+lang.name">
            </el-input>
          </el-form-item>
          <el-form-item :label="lang.message" :required="true">
            <el-input type="textarea" autosize
              v-model="data.message" :placeholder="this.$lang[langId].please_input+lang.message">
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="formData.id" class="card-footer text-right">
        <el-button
          size="small"
          @click="remove"
          type="danger"
          icon="el-icon-delete">
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['saved', 'loading', 'formData'],

  data() {
    return {
      disabledSave: true,
      data: {}
    }
  },

  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  watch: {
    data: {
      handler(data) {
        if ((data.name && data.name !== '') && (data.message && data.message !== '')) {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true
    },
    saved: {
      handler(bool) {
        if (bool === true) {
          this.data = {}
          this.disabledSave = true
        }
      },
      deep: true
    },
    formData: {
      handler(data) {
        this.data = {...data}
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    cancel() {
      this.data = {}
      this.control = {}
      this.$emit('cancel')
    },
    save() {
      this.disabledSave = true
      let data = Object.assign({}, this.data)
      this.$emit('save', data)
    },
    remove() {
      this.$emit('remove', {id: this.data.id})
    }
  }
}
</script>
