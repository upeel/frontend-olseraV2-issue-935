<template>
  <el-dialog
    :visible.sync="show"
    :show-close="false"
    append-to-body >
    <div slot="title" class="flex-container">
      <div class="full-width font-24">
        {{ rootLang.copy_product }}
        <!-- <close-esc @close="$emit('cancel')" /> -->
      </div>
      <div class="full-width text-right">
        <!-- <close-esc :hideEsc="true" @close="handleClose" /> -->
        <el-button
          type="info"
          @click="handleClose">
          {{ lang.cancel }}
        </el-button>
        <el-button type="success" :loading="loadingCopy" @click="handleSave">
          {{ lang.copy }}
        </el-button>
      </div>
    </div>
    <div>
      <div class="font-14 mb-16">Copy produk dari Ojek Online lain</div>
      <el-radio-group v-model="dataSelected" class="full-width like-table-wrapper border border--table-border">
        <div v-for="ojek in fetchDataMaster" :key="ojek.ojek_online_food_id" class="flex-container mr-8 p-8 radio-custom--no-shadow like-table-wrapper--item" @click="handleSetMaster(ojek.ojek_online_food_id)">
          <div class="full-width flex-container pointer">
            <el-image
              :src="ojek.photo"
              class="container-icon"
            />
            <div class="ml-8">
              <div class="font-16 font-bold">{{ ojek.ojek_online_food_name }}</div>
              <div class="font-12">{{ ojek.total_item }} {{ lang.product }}</div>
            </div>
          </div>
          <el-radio :label="ojek.ojek_online_food_id" :class="dataSelected === ojek.ojek_online_food_id ? 'radio-custom-normal radio-custom-normal--is-checked--no-background' : 'radio-custom-normal'">
            <span></span>
          </el-radio>
        </div>
      </el-radio-group>
      <div class="mt-24 flex-container">
        <div class="font-16 font-bold full-width">Ikutkan Harga Ojek Online</div>
        <div>
          <el-checkbox v-model="includePrice" class="checkbox-add-addon"></el-checkbox>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'dialogCopyProduct',
  mixins: [basicComputedMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    selectedMaster: {
      type: Object,
      default: {}
    },
    dataMaster: {
      type: Array,
      default: []
    },
    loadingCopy: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataSelected: null,
      includePrice: false
    }
  },
  computed: {
    fetchDataMaster () {
      let data = []
      this.dataMaster.map(i => {
        if (i.ojek_online_food_id !== this.selectedMaster.ojek_online_food_id) {
          data.push(i)
        }
      })
      return data
    }
  },
  methods: {
    handleClose () {
      this.dataSelected = null
      this.includePrice = false
      this.$emit('close')
    },
    handleSetMaster (idMaster) {
      this.dataSelected = idMaster
    },
    handleSave () {
      let data = {
        from_ojek_online_food_id: this.dataSelected,
        to_ojek_online_food_id: this.selectedMaster.ojek_online_food_id,
        with_marking_preset: this.includePrice ? 1 : 0
      }
      this.$emit('copy', data)
    }
  }
}
</script>