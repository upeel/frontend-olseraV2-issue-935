<template>
  <el-card v-loading="loading" shadow="never">
    <div slot="header" class="table-handler-flex">
      <h4 style="flex-grow: 1;">{{ lang.add_specification }}</h4>
      <div>
        <el-button
          @click="save"
          :disabled="disabledSave"
          type="primary"
          icon="el-icon-check">
          {{ lang.save }}
        </el-button>
      </div>
    </div>

    <div class="card-body">
      <el-form class="form-sidebyside">
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item :label="lang.name" :required="true">
              <p>{{ lang.name }} {{ lang.product_specifications }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item>
              <el-input type="text" v-model="data.name" @keyup.native.enter="save"></el-input>
            </el-form-item>
            <div style="position: relative; z-index: -10">
              <el-form-item>
                <el-input type="text" v-model="data.alamat"></el-input>
              </el-form-item>
            </div>
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
