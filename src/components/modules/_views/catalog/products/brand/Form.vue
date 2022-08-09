<template>
  <el-card v-loading="loading" shadow="never">
    <div slot="header" class="table-handler-flex">
      <h4 style="flex-grow: 1;">{{ lang.add_brand }}</h4>
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
              <p>{{ lang.info_brand_name }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item>
              <el-input type="text" v-model="data.name" @keyup.enter.native="save"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item :label="$lang[langId].comission">
              <p>{{ $lang[langId].commission_for_employees }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item>
              <el-input
                v-model="data.comission_pct"
                :placeholder="lang.desc_price_cut_for_reseller"
                type="number"
                min="0.01"
                @keyup.enter.native="save">
                <template slot="append">%</template>
              </el-input>
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
    },
    handleCurrency(value) {
      if (value < 0) {
        this.data.comission_pct = 0
      }
    }
  }
}
</script>
