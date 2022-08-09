<template>
  <div>
    <div class="flex-container radius-2 mb-12">
      <div class="font-24 font-semi-bold">
        Badan Perpajakan
      </div>
    </div>

    <div class="like-table-wrapper">
      <div
        v-for="item in dataItem"
        :key="item.id"
        :class="checkIntegration(item)"
        @click="getToken(item)">
        <el-avatar
          src="/static/img/badan_perpajakan.png"
          class="mr-4"
        />
        <div
          class="font-14 font-semi-bold"
          style="flex-grow: 1;">
          {{ item.alias_name }}
        </div>

        <el-button
          v-if="item.taxation.tax_submission === 0 && item.taxation.tax_activated === 0"
          class="color-pajak--bg color-white"
          @click="visibleTaxationBeforeIntegration = true">
          {{ rootLang.propose }} <i class="el-icon-arrow-right"></i>
        </el-button>

        <el-button
          v-else-if="item.taxation.tax_submission === 1 && item.taxation.tax_activated === 0"
          :loading="loading"
          type="info"
          @click="showOnProgress = true">
          <svg-icon icon-class="clock" class="font-16"/>
          {{ rootLang.on_progress }}
        </el-button>

        <!-- <el-button
          v-else-if="item.taxation.tax_submission === 1 && item.taxation.tax_activated === 1"
          :loading="loading"
          type="info"
          @click="visibleSetupToken = true">
          <svg-icon icon-class="clock" class="font-16"/>
          {{ rootLang.on_progress }}
        </el-button> -->
        <div
          v-else-if="item.taxation.tax_submission === 1 && item.taxation.tax_activated === 1"
          :loading="loading"
          class="pointer"
          @click="visibleSetupToken = true">
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>

    <badan-pajak-dialog-before-integration
      :show="visibleTaxationBeforeIntegration"
      :loading-submit="loadingSubmit"
      @cancel="visibleTaxationBeforeIntegration = false"
      @submit="submitTaxation"
    />

    <setup-token-pajak
      :show="visibleSetupToken"
      :data-taxation="tempTaxation"
      @cancel="handleClose"
    />

    <el-dialog
    :visible.sync="showOnProgress"
    title="Status Pengajuan"
    :show-close="false"
    append-to-body
    custom-class="without-padding">
    <div class="text-center p-32">
      <div class="mr-8 mb-24">
        <svg-icon icon-class="icon-clock-black" class="font-56 color-grey--icon"/>
      </div>
      <span class="font-18">Sedang diproses</span>
      <div class="font-12">Tunggu ya... Waktu proses paling lama 1-3 hari kerja</div>
    </div>
  </el-dialog>

    <!-- <grabfood-dialog-integration
      ref="dialogIntegration"
      :data="foodDeliveryData"
      :show="visibleGrabfoodDialogIntegration"
      :branches="branches"
      :loading="loading"
      @cancel="visibleGrabfoodDialogIntegration = false"
      @submit="submit"
    /> -->
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import BadanPajakDialogBeforeIntegration from './badanperpajakan/dialogBeforeIntegration'
import SetupTokenPajak from './badanperpajakan/setupTokenPajak'

import { taxationSubmission } from '@/api/thirdParty/taxation'

export default {
  name: 'GenerateTokenPajak',
  props: {
    dataItem: {
      type: Array,
      default: null
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

  components: {
    BadanPajakDialogBeforeIntegration,
    SetupTokenPajak
  },

  mixins: [basicComputedMixin],

  watch: {
    dataItem(data) {
      if (data && data.length) {
        this.data = { ...data[0] }
      }
    }
  },

  data() {
    return {
      visibleTaxationBeforeIntegration: false,
      visibleGrabfoodDialogIntegration: false,
      visibleSetupToken: false,
      showOnProgress: false,
      data: {},
      loadingSubmit: false,
      tempTaxation: {}
    }
  },

  methods: {
    submitTaxation () {
      this.loadingSubmit = true
      taxationSubmission().then(async response => {
        this.loadingSubmit = false
        this.visibleTaxationBeforeIntegration = false
        this.$emit('refresh')
      }).catch(error => {
        this.loadingSubmit = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },

    checkIntegration (item) {
      let classInfo = ''
      classInfo = item.taxation.tax_submission === 1 && item.taxation.tax_activated === 1 ? 'like-table-wrapper--item pointer' : 'like-table-wrapper--item'
      return classInfo
    },

    getToken (item) {
      if (item.taxation.tax_submission === 1 && item.taxation.tax_activated === 1) {
        this.visibleSetupToken = true
        this.tempTaxation = { ...item}
      }
    },

    handleClose () {
      this.visibleSetupToken = false
      this.tempTaxation = {}
    }
  }
}
</script>