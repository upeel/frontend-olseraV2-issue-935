<template>
  <div>
    <el-card v-loading="loading">
      <div slot="header" class="clearfix">
        <el-row :gutter="10">
          <el-col :md="12">
            <template v-if="!data.id">
              <h4>{{ lang.add }} {{ lang.f_a_q }}</h4>
            </template>
            <template v-else>
              <span class="size-12 oldgrey">{{ lang.edit }}:</span>
              <h4>{{data.question}}</h4>
            </template>
          </el-col>
          <el-col :md="12" class="text-right">
            <el-button
              :disabled="disabledRemove"
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
          <el-form-item :label="lang.question" :required="true">
            <el-input type="text" v-model="data.question" :placeholder="$lang[langId].please_input+lang.question">
            </el-input>
          </el-form-item>
          <el-form-item :label="lang.answer" :required="true">
            <el-input type="textarea" autosize
              v-model="data.answer" :placeholder="$lang[langId].please_input+lang.answer">
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="card-footer text-right">
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
      disabledRemove: false,
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
        if ((data.answer && data.answer !== '') && (data.question && data.question !== '')) {
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
      this.disabledRemove = true
      this.$emit('remove', {id: this.data.id})
    }
  }
}
</script>
