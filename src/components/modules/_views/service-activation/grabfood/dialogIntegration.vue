<template>
  <el-dialog
    :visible="show"
    :before-close="cancel"
    :show-close="false"
    :title="rootLang.integration_grabfood"
    custom-class="mw-680">
    <div slot="title" class="flex-container">
      <h4 class="dialog-title full-width">
        {{ rootLang.integration_grabfood }}
      </h4>
      <div class="btn_save_dialog full-width text-right">
        <el-button type="info" @click="cancel()">{{ lang.cancel }}</el-button>
        <el-button
          :loading="loading"
          type="success"
          @click="handleSubmit">
          {{ rootLang.propose }}
        </el-button>
      </div>
    </div>

    <el-form
      :model="formData"
      label-position="top">
      <el-form-item
        :label="rootLang.store_name"
        prop="store_name">
        <el-input
          v-model="formData.store_name"
        />
      </el-form-item>

      <el-form-item
        :label="rootLang.email"
        prop="email">
        <el-input
          v-model="formData.email"
          type="email"
        />
      </el-form-item>

      <el-form-item
        :label="rootLang.owner_name"
        prop="owner_name">
        <el-input
          v-model="formData.owner_name"
        />
      </el-form-item>

      <el-form-item
        prop="branches">
        <div slot="label" class="flex-container">
          <div style="flex-grow: 1;">
            {{ rootLang.choose_branches }}
          </div>
          <div class="font-12">
            {{ formData.branches.length }} of {{ branches.length }}
          </div>
        </div>
        <el-checkbox-group
          v-model="formData.branches"
          class="checkbox-group-block">
          <el-checkbox
            v-for="item in branches"
            :key="item.store_id"
            :label="item.store_id">
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { create } from '@/api/thirdParty/activation'
const DEFAULT_FORMDATA = {
  thirdparty_service_item_id: 9,
  store_id: null,
  store_name: '',
  email: '',
  owner_name: '',
  branches: []
}
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    branches: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      formData: { ...DEFAULT_FORMDATA }
    }
  },

  mixins: [basicComputedMixin],

  methods: {
    cancel() {
      this.reset()
      this.$emit('cancel')
    },

    reset() {
      this.formData = { ...DEFAULT_FORMDATA }
    },

    submit() {
      this.$emit('submit', this.formData)
    },

    async handleSubmit() {
      this.loading = true
      const submitData = { ...this.formData }
      submitData.branchs = []
      this.loadingSubmit = true
      submitData.store_id = await this.$store.getters.selected_store.store_id
      await this.branches.map(item => {
        if (this.formData.branches.includes(item.store_id)) {
          submitData.branchs.push({
            store_id: item.store_id,
            open_status: 2
          })
        }
      })
      if (submitData.branchs.length === 0) {
        delete submitData.branchs
      }
      await delete submitData.branches
      await create(submitData).then(response => {
        this.$message({
          type: 'success',
          message: 'Saved'
        })
        this.loading = true
        // this.fetchGroups()
        // this.fetchStoreBranches()
        this.submit()
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
      })
      this.loadingSubmit = false
      // this.$refs['foodDelivery-' + itemId][0].reset()
    },
  }
}
</script>
