<template>
  <el-card v-loading="loading" shadow="never">
    <div slot="header" class="table-handler-flex">
      <h4 style="flex-grow: 1;">{{ lang.add }} {{ lang.collection }}</h4>
      <el-button
        :disabled="disabledSave"
        type="primary"
        icon="el-icon-check"
        @click="save">
        {{ lang.save }}
      </el-button>
    </div>

    <div class="card-body">
      <el-form
        class="form-sidebyside"
        @submit.native.prevent="save">
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item :label="lang.name" :required="true">
              <p>{{ lang.info_collection }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item>
              <el-input type="text" v-model="data.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

  </el-card>
</template>

<script>
export default {
  props: ['saved', 'loading'],

  data() {
    return {
      disabledSave: true,
      data: {}
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
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
        if (data.name && data.name !== '') {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true
    },
    saved: {
      handler(bool) {
        console.log(bool)
        if (bool === true) {
          this.data = {}
          this.disabledSave = true
        }
      },
      deep: true
    }
  },

  methods: {
    save() {
      this.disabledSave = true
      let data = Object.assign({}, this.data)
      this.$emit('save', data)
    }
  }
}
</script>
