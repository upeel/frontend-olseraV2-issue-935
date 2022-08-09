<template>
  <div>
    <store-trial
      :selected-store="selectedStore"
      :selected-plan="selectedPlan"
      @show-upgrade="showUpgrade(1)"
    />

    <div v-loading="loading" class="flex-container-same-height flex-container--desktop">
      <whatsnew />
      <div class="no-flex-sm mb-16 bg-white box-shadow full-width">
        <div class="dashboard-content-section">
          <div
            v-if="userRole && userRole.role_id === 'OW'"
            class="flex-container mb-16">
            <div class="flex-grow-1">
              <el-button type="text" @click="$emit('billing')">
                <svg-icon icon-class="Icon-tagihan" style="width:18px; height:18px;"></svg-icon>
                Tagihan Saya
              </el-button>
            </div>
            <div
              class="text-right">
              <el-button
                v-if="selectedStore.plan_type_id !== 'F'"
                @click="showUpgradeNotTrial">
                Upgrade
              </el-button>
              <el-button
                v-if="selectedStore.plan_type_id !== 'L'"
                icon="el-icon-plus"
                type="primary"
                @click="showExtend">
                Perpanjang
              </el-button>
              <el-button
                v-if="selectedStore.plan_type_id !== 'P'"
                icon="el-icon-plus"
                type="primary"
                @click="showUpgradeNotTrial">
                Upgrade
              </el-button>
            </div>
          </div>

          <el-divider v-if="selectedStore.plan_type_id !== 'L' && userRole && userRole.role_id === 'OW'" />

          <div
            v-if="selectedStore.is_pos"
            class="flex-container">
            <img
              :src="'/static/img/store-types/icon-plan-'+ selectedStore.plan_type_id +'.png'"
              width="32">
            <div class="ml-8" style="flex-grow: 3;">
              <div class="size-14 semi-bold color-body">
                {{ selectedStore.plan_type_name }}
              </div>
              <div class="size-12 color-info">
                <span v-if="selectedStore.plan_type_id !== 'L'">{{ $lang[langId].ends_at }} {{ dataStore.pos_expiry }}</span>
              </div>
            </div>
            <div
              v-if="selectedStore.plan_type_id !== 'L'"
              class="warning-dashboard semi-bold flex-container"
              style="justify-content: right; flex-grow: 2;">
              <plan-type-chip
                v-if="selectedStore.is_store_can_upgrade_trial"
                :plan-type-id="getOtherPlanTypes(selectedStore.plan_type_id)[0]"
                class="pointer"
                @click.native="showUpgrade(1)">
                Coba gratis
              </plan-type-chip>
              <plan-type-chip
                :plan-type-id="selectedStore.plan_type_id"
                :class="selectedStore.pos_left_label">
                {{ selectedStore.pos_left }}
              </plan-type-chip>
            </div>
            <div v-else-if="selectedStore.plan_type_id === 'L'">
              <plan-type-chip
                v-if="selectedStore.is_store_can_upgrade_trial"
                plan-type-id="B"
                class="pointer"
                @click.native="showUpgrade(1)">
                Coba gratis
              </plan-type-chip>
            </div>
            <div v-if="selectedStore.pos_free_web_catalog === 1">
              <plan-type-chip
                plan-type-id="free_catalog">
                Free Catalog
              </plan-type-chip>
            </div>
          </div>

          <el-divider v-if="selectedStore.is_pos" />

          <div
            v-if="selectedStore.is_onlineshop && selectedStore.pos_free_web_catalog !== 1"
            class="flex-container">
            <svg-icon icon-class="online_store_gradien" style="color: red; width:24px; height:24px;"></svg-icon>
            <div class="ml-8" style="flex-grow: 3;">
              <div class="size-14 semi-bold color-body">
                {{ rootLang.online_store }}
              </div>
              <div v-if="selectedStore.store_left_label !== 'danger'" class="size-12 color-info">
                {{ $lang[langId].ends_at }} {{ selectedStore.fexpiry_date }}
              </div>
            </div>
            <div class="warning-dashboard semi-bold" style="text-align: right; flex-grow: 2;">
              <div class="chip chip--warning" v-if="selectedStore.store_left_label === 'danger'" style="color:#F44336;">{{ selectedStore.store_left }}</div>
              <div class="chip chip--ol" v-else>{{ selectedStore.store_left }}</div>
            </div>
          </div>
          <el-divider v-if="selectedStore.is_onlineshop && selectedStore.pos_free_web_catalog !== 1" />

          <div
            v-if="selectedStore.is_mobile"
            class="flex-container">
            <svg-icon icon-class="android_ico" style="color: red; width:24px; height:24px;"></svg-icon>
            <div class="ml-8" style="flex-grow: 3;">
              <div class="size-14 semi-bold color-body">
                {{ rootLang.android_store }}
              </div>
              <div class="size-12 color-info">
                {{ $lang[langId].ends_at }} {{ selectedStore.fmobile_expiry_android }}
              </div>
            </div>
            <div class="warning-dashboard semi-bold" style="text-align: right; flex-grow: 2;">
              <div class="chip chip--warning" v-if="selectedStore.android_left_label === 'danger'" style="color:#F44336;">{{ selectedStore.android_left }}</div>
              <div class="chip chip--android" v-else>{{ selectedStore.android_left }}</div>
            </div>
          </div>
          <el-divider v-if="selectedStore.is_mobile" />

          <div
            v-if="selectedStore.is_mobile"
            class="flex-container">
            <svg-icon icon-class="ios_ico" style="color: red; width:24px; height:24px;"></svg-icon>
            <div class="ml-8" style="flex-grow: 3;">
              <div class="size-14 semi-bold color-body">
                {{ rootLang.ios_store }}
              </div>
              <div class="size-12 color-info">
                {{ $lang[langId].ends_at }} {{ selectedStore.fmobile_expiry_ios }}
              </div>
            </div>
            <div class="warning-dashboard semi-bold" style="text-align: right; flex-grow: 2;">
              <div class="chip chip--warning" v-if="selectedStore.ios_left_label === 'danger'" style="color:#F44336;">{{ selectedStore.ios_left }}</div>
              <div class="chip chip--default" v-else>{{ selectedStore.ios_left }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <dialog-upgrade-store
      :show="visibleDialogUpgrade"
      :plan-type="selectedPlan"
      :active-store="selectedStore"
      @close="visibleDialogUpgrade = false"
      @done="handleDoneUpgrade"
    />
    <dialog-detail-payment
      :data="detailPayment"
      :show="visibleDialogDetailPayment"
      @cancel-upgrade="cancelUpgradeDetail"
      @close="visibleDialogDetailPayment = false"
    />
  </div>
</template>

<script>
import Whatsnew from './Whatsnew'
import DialogUpgradeStore from '@/components/modules/extendStore/DialogUpgradeStore'
import DialogDetailPayment from '@/components/modules/extendStore/DialogDetailPayment'
import PlanTypeChip from '@/components/modules/planType/PlanTypeChip'
import StoreTrial from './StoreTrial'
import { getOtherPlanTypes } from '@/utils/hiddenFeaturesByPlanType'

export default {
  components: {
    Whatsnew,
    DialogUpgradeStore,
    DialogDetailPayment,
    PlanTypeChip,
    StoreTrial
  },

  props: {
    dataStore: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    selectedPlan: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      visibleDialogUpgrade: false,
      visibleDialogDetailPayment: false,
      detailPayment: {
        payment_mode: {
          bt_bank_name: ''
        }
      },
      getOtherPlanTypes
    }
  },

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    rootLang() {
      return this.$lang[this.langId]
    },
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    }
  },

  methods: {
    showExtend() {
      this.visibleDialogUpgrade = true
    },
    updateTrial() {
      this.$emit('updatetrial')
    },
    showUpgrade(isTrialUpgrade = 1) {
      if (this.userRole.role_id === 'OW') {
        this.$router.push({
          path: '/extendstore',
          query: {
            path: this.selectedStore.store_id,
            redirect_to: this.$route.path,
            trial_upgrade: isTrialUpgrade
          }
        })
      } else {
        const h = this.$createElement;
        this.$notify({
          type: 'warning',
          message: h('i', { class: 'color-warning font-16' }, 'Hanya untuk pemilik'),
          customClass: 'color-warning--soft--bg notif-extend'
        })
      }
    },
    handleDoneUpgrade(payload) {
      this.detailPayment = { ...payload }
      this.visibleDialogUpgrade = false
      this.visibleDialogDetailPayment = true
    },
    cancelUpgradeDetail (data) {
      this.$notify({
        type: 'warning',
        message: 'Tagihan dengan no ' + data.billing_no + ' berhasil dibatalkan',
        customClass: 'color-warning--soft--bg notif-extend'
      })
      this.visibleDialogDetailPayment = false
    },
    showUpgradeNotTrial () {
      this.showUpgrade(0)
    }
  }
}
</script>
