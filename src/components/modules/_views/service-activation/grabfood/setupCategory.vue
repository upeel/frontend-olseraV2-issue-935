<template>
  <div class="flex-container no-flex-sm">
    <div class="wizard-desc">
      <h3>{{ rootLang.category }}</h3>
      <p>Kategori adalah kelompok item dalam suatu section. Anda dapat menambah beberapa kategori pada Ubah Menu nanti, sekarang buat satu dahulu. Contoh: Limited Time Offer, Burgers.</p>
      <div class="text-center mb-12">
        <img src="/static/img/service-activation/grabfood-2.png">
      </div>
    </div>
    <div class="wizard-content">
      <el-form
        :model="formData"
        label-position="top">
        <el-form-item
          prop="name"
          :label="rootLang.category">
          <select-product-category
            v-model="selectedCategory"
            :allow-create="true"
            class="full-width"
            @change="handleChangeSelectCategory"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            :loading="loading"
            type="success"
            class="btn-block"
            @click="submit">
            {{ rootLang.next }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import SelectProductCategory from 'components/SelectProductCategory'
import { savePartial } from '@/api/thirdParty/grabfood'
const moment = require('moment')

export default {
  components: {
    CloseEsc,
    SelectProductCategory
  },

  mixins: [basicComputedMixin],

  props: {
    setupData: {
      type: Object,
      default: null
    },
    grabfoodData: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      loading: false,
      selectedCategory: null,
      formData: {
        category: {
          id: null,
          is_alias: 0,
          name: ''
        },
      }
    }
  },

  methods: {
    async submit() {
      this.loading = true
      const submitData = {
        store_grabfood_id: this.grabfoodData.id,
        name: this.setupData.name,
        // days: [],
        category: { ...this.formData.category },
        periods: [ ...this.setupData.periods]
      }
      // await this.setupData.days.map(day => {
      //   // if (this.setupData.selected_days.includes(day.day_id)) {
      //     submitData.days.push(day)
      //   // }
      // })
      await savePartial(submitData).then(response => {
        this.loading = false
        this.formData.group_menu = response.data.data.group_menu
        this.$emit('submit', this.formData)
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.loading = false
      })
    },

    handleChangeSelectCategory(val) {
      if (val.id) {
        this.formData.category.id = parseInt(val.id)
        this.formData.category.name = val.name
        this.formData.category.is_alias = 0
      } else {
        this.formData.category.id = null
        this.formData.category.name = val
        this.formData.category.is_alias = 1
      }
    }
  }
}
</script>
