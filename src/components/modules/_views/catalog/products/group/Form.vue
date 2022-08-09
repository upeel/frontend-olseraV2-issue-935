<template>
  <el-card v-loading="loading" shadow="never">
    <div slot="header" class="table-handler-flex">
      <h4 style="flex-grow: 1;">{{ $lang[langId].add_group_or_category }}</h4>
      <div>
        <el-button
          :disabled="disabledSave"
          @click="save"
          type="primary"
          el-icon="check">
          {{ lang.save }}
        </el-button>
      </div>
    </div>

    <div class="box-body open-create-body">
      <el-form
        :model="data"
        class="form-sidebyside">
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item :label="lang.name" :required="true">
              <p>{{ lang.info_product_group }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item>
              <el-input type="text" v-model="data.name" :placeholder="$lang[langId].please_input+lang.name+' '+lang.group"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item :label="lang.classification" :required="true">
              <p>{{ lang.info_product_classification }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item>
              <el-select
                filterable
                v-model="data.category_id" :placeholder="lang.please_select">
                <el-option-group
                  v-for="group in specifications"
                  :key="group.name"
                  :label="group.name">
                  <el-option
                    v-for="item in group.children"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <hr/>
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item :label="lang.disabled">
              <p>{{ lang.info_disabled }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item>
              <el-switch v-model="data.disabled" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item :label="lang.hide_in_pos"></el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item>
              <el-switch v-model="data.pos_hidden" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="11">
            <el-form-item
              :label="$lang[langId].hide_submenu_in_menu">
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item>
              <el-switch v-model="data.ol_sub_hidden" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  props: ['saved', 'loading', 'specifications'],

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
        if (
          (data.name && data.name !== '') &&
          (data.category_id && data.category_id !== '')
        ) {
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
      console.log(this.disabledSave)
      if (!this.disabledSave) {
        this.disabledSave = true
        let data = Object.assign({}, this.data)
        this.$emit('save', data)
      }
    },

    refreshData () {
      this.data = {}
    }
  }
}
</script>
