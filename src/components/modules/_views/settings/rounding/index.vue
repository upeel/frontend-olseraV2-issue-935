<template>
  <div v-loading="loading" class="content-wrapper">
    <section class="content sales-list no-subpage">
      <div class="flex-container">
        <div class="full-width">
          <div class="font-16 font-bold">{{ rootLang.payment_rounding }}</div>
          <span class="font-12 color-info">Sementara hanya berlaku untuk POS</span>
        </div>
        <div v-loading="loadingSave">
          <el-switch
            v-model="dataRounding.enable"
            :active-value="1"
            :inactive-value="0"
            @change="updateData">
          </el-switch>
        </div>
      </div>
      <div class="mt-8">
        <template v-if="dataRounding.enable !== 1">
          <div class="no-data-wrapper no-data-settle color-info--bg p-32">
            <img src="/static/img/no-data-rounding.png" class="no-data-image">
            <div style="max-width: 360px; width: 100%">
              <span>Aktifkan pembulatan untuk Total Ditagihkan pada penjualan Anda</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="border border--grey-border p-24 radius-5">
            <div class="flex-container">
              <div class="full-width">
                <span class="font-12">Besar pembagi</span>
                <input-money v-model="dataRounding.amount_divider" :hide-currency="true" />
              </div>
              <div class="full-width ml-16">
                <span class="font-12">Mode pembulatan</span>
                <el-radio-group
                  v-model="dataRounding.rounding_mode"
                  class="full-width flex-container border border--info">
                  <el-radio-button class="lpoint-type" :label="1">
                    {{ rootLang.to_down }}
                  </el-radio-button>
                  <el-radio-button class="lpoint-type" :label="3">
                    Otomatis
                  </el-radio-button>
                  <el-radio-button class="lpoint-type" :label="2">
                    {{ $lang[langId].to_up }}
                  </el-radio-button>
                </el-radio-group>
              </div>
            </div>

            <div v-if="dataRounding.rounding_mode === 3" class="mt-24">
              <div class="font-12">Rentang pembulatan ke bawah</div>
              <slide-bar 
                v-model="dataRounding.amount_breakpoint"
                :min="0"
                :max="dataRounding.amount_divider"
                @edit="handleUpdateBreakpoint(true)">
                <!-- <template slot="tooltip" slot-scope="tooltip">
                  <div class="text-center">
                    <div class="tooltip-rounding"></div>
                    <el-button>{{ tooltip.val }}</el-button>
                  </div>
                </template> -->
              </slide-bar>
            </div>

            <div class="mt-64">
              <el-button class="btn-block" @click="visibleSimulation = true">
                <svg-icon icon-class="icon-simulasi" />
                Simulasi
              </el-button>
            </div>

            <div class="mt-24 color-info--bg p-16">
              <div class="flex-container flex-container--start">
                <div class="container-icon" style="align-items: start !important">
                  <svg-icon icon-class="information-circle" />
                </div>
                <div class="full-width">
                  <div>Sistem akan otomatis mengecek Total Ditagihkan dan menerapkan pembulatan. </div><br>
                  <div>Sitem akan membulatkan ke atas atau ke bawah berdasarkan pengaturan <span class="font-bold">mode pembulatan</span>.</div><br>
                  <div>Contoh, jika pengaturan sebagai berikut :</div>
                  <ul>
                    <li>Besar pembagi <span class="font-bold">1.000,00</span></li>
                    <li>Mode pembulatan <span class="font-bold"> Otomatis</span></li>
                    <li>Besar breakpoint <span class="font-bold">500,00</span></li>
                  </ul><br>
                  <div>
                    maka <span class="font-bold">Total ditagihkan 9.500,00 </span> akan otomatis dibulatkan ke bawah menjadi 9.000,00 dengan cara membulatkan 500,00 (sisa pembagian Total ditagihkan dengan Besar pembagi atau 9.500,00 / 1.000,00 = 500) menjadi 0,00.
                  </div>
                </div>
              </div>
            </div>

            <!-- <div class="mt-24 text-right">
              <el-button type="success" :loading="loadingSave" @click="updateData">{{ lang.save }}</el-button>
            </div> -->
          </div>
        </template>
      </div>

      

      <el-dialog 
        :visible.sync="showEditBreakpoint"
        :show-close="false"
        append-to-body>
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width font-bold font-24">
            Breakpoint
          </h4>
          <template>
            <el-button type="info" @click="showEditBreakpoint = false">{{ rootLang.cancel }}</el-button>
            <el-button type="success" @click="handleUpdateBreakpoint(false)">{{ lang.save }}</el-button>
          </template>
        </div>
        <div>
          <span class="font-12">Rentang pembulatan ke bawah</span>
          <input-money v-model="tempBreakpoint" :hide-currency="true" />
        </div>
      </el-dialog>

      <el-dialog 
        :visible.sync="showEditBreakpointSimulation"
        :show-close="false"
        append-to-body>
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width font-bold font-24">
            Breakpoint
          </h4>
          <template>
            <el-button type="info" @click="showEditBreakpoint = false">{{ rootLang.cancel }}</el-button>
            <el-button type="success" @click="handleUpdateBreakpointSimulation(false)">{{ lang.save }}</el-button>
          </template>
        </div>
        <div>
          <span class="font-12">Rentang pembulatan ke bawah</span>
          <input-money v-model="tempRounding.tempBreakpoint" :hide-currency="true" />
        </div>
      </el-dialog>

      <transition name="el-zoom-in-center">
        <div
          v-if="visibleSimulation"
          class="offscreen-right-sidebar">
          <div class="offscreen-right-sidebar--wrapper">
            <div class="offscreen-right-sidebar--header text-left">
              {{ rootLang.rounding_simulation }}
              <close-esc @close="visibleSimulation = false" />
            </div>

            <div>
              <div class="full-width">
                <span class="font-12">Total ditagihkan</span>
                <input-money v-model="tempRounding.total_payment" :hide-currency="true" />
              </div>
              <div class="mt-24">
                <span class="font-12">Besar pembagi</span>
                <input-money v-model="tempRounding.amount_divider" :hide-currency="true" />
              </div>
              <div class="mt-24 color-info--bg p-16 radius-5">
                Nominal yang akan dibulatkan : <span class="font-bold">{{ nominal_rounding }}</span>
              </div>
              <div class="mt-24">
                <span class="font-12">Mode pembulatan</span>
                <el-radio-group
                  v-model="tempRounding.rounding_mode"
                  class="full-width flex-container border border--info">
                  <el-radio-button class="lpoint-type" :label="1">
                    {{ rootLang.to_down }}
                  </el-radio-button>
                  <el-radio-button class="lpoint-type" :label="3">
                    Otomatis
                  </el-radio-button>
                  <el-radio-button class="lpoint-type" :label="2">
                    {{ $lang[langId].to_up }}
                  </el-radio-button>
                </el-radio-group>
              </div>
              <div v-if="tempRounding.rounding_mode === 3" class="mt-24">
                <div class="font-12">Rentang pembulatan ke bawah</div>
                <div class="p-8">
                  <slide-bar 
                    v-model="tempRounding.amount_breakpoint"
                    :min="0"
                    :max="tempRounding.amount_divider"
                    @edit="handleUpdateBreakpointSimulation(true)">
                  </slide-bar>
                </div>
              </div>
              <div class="mt-24">
                <span class="font-12">Hasil pembulatan</span>
                <div class="color-primary--soft--bg p-16 text-center font-bold radius-10">
                  {{ rounding_final }}
                </div>
              </div>
            </div>
          </div>

          <div class="offscreen-right-sidebar--footer flex-container">
            <!-- <el-button class="btn-block mr-4" @click="resetFilter">Reset</el-button>
            <el-button type="primary" class="btn-block ml-4" :loading="loadingFilter" @click="handleFilterCustomer" >{{ rootLang.apply }}</el-button> -->
          </div>
        </div>
      </transition>
    </section>
    <div class="floating_div" :style="computedRes">
      <floating-div :show-cancel="true" :loading="loadingSave" :disable-btn-cancel="isEdit" :disable-btn-save="isEdit" @confirm="updateData" @cancel="getData" ></floating-div>
    </div>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'

import { fetchRoundingSetting, updateRoundingSetting } from '@/api/rounding'

import InputMoney from '@/components/InputMoneyV2'
import SlideBar from '../rounding/SlideBar.vue'
import CloseEsc from '@/components/modules/CloseEsc'
import FloatingDiv from '@/components/modules/FloatingDiv'

export default {
  name: 'PaymentRounding',

  mixins: [basicComputedMixin],

  components: {
    InputMoney,
    SlideBar,
    CloseEsc,
    FloatingDiv
  },

  data() {
    return {
      loading: false,
      dataRounding: {
        amount_breakpoint: 0,
        amount_divider: 100,
        enable: 0,
        id: 0,
        rounding_mode: 1
      },
      // dataRounding: {},
      tooltipClass: 'tooltip-rounding',
      value: 50,
      showEditBreakpoint: false,
      showEditBreakpointSimulation: false,
      tempBreakpoint: 0,
      visibleSimulation: false,
      tempRounding: {
        amount_breakpoint: 0,
        amount_divider: 0,
        rounding_mode: 1,
        total_payment: 0,
        rounding_nominal: 0,
        rounding_final: 0,
        tempBreakpoint: 0
      },
      loadingSave: false,
      tempDataRounding: {},
      dataRound: {
        amount_breakpoint: 0,
        amount_divider: 1000
      }
    }
  },

  mounted () {
    this.getData()
  },

  computed: {
    nominal_rounding () {
      if (this.tempRounding.total_payment === 0 && this.tempRounding.amount_divider === 0) {
        return 0
      } else {
        let data = this.tempRounding.total_payment % this.tempRounding.amount_divider
        return data
      }
    },

    rounding_final () {
      let data = 0
      if (this.tempRounding.total_payment !== 0 && this.tempRounding.amount_divider !== 0 && this.nominal_rounding !== 0) {
        if (this.tempRounding.rounding_mode === 2) {
          // data = this.tempRounding.total_payment + this.nominal_rounding
          // data = (this.tempRounding.total_payment/this.tempRounding.amount_divider)*this.tempRounding.amount_divider
          // let rest = this.tempRounding.total_payment % this.tempRounding.amount_divider
          // data = this.tempRounding.total_payment - rest + this.tempRounding.amount_divider
          data = Math.ceil(this.tempRounding.total_payment/Math.abs(this.tempRounding.amount_divider))*Math.abs(this.tempRounding.amount_divider)
        }
        if (this.tempRounding.rounding_mode === 1) {
          // data = this.tempRounding.total_payment - (this.tempRounding.amount_divider - this.nominal_rounding)
          // data = (this.tempRounding.total_payment/(-this.tempRounding.amount_divider))*(-this.tempRounding.amount_divider)
          // let rest = this.tempRounding.total_payment % this.tempRounding.amount_divider
          // data = this.tempRounding.total_payment - rest
          data = Math.ceil(this.tempRounding.total_payment/-Math.abs(this.tempRounding.amount_divider))*-Math.abs(this.tempRounding.amount_divider)
        }
        if (this.tempRounding.rounding_mode === 3) {
          if (this.nominal_rounding <= this.tempRounding.amount_breakpoint) {
            data = this.tempRounding.total_payment - this.nominal_rounding
          }
          if (this.nominal_rounding > this.tempRounding.amount_breakpoint) {
            data = this.tempRounding.total_payment + (this.tempRounding.amount_divider - this.nominal_rounding)
          }
        }
        
        return data
      } else {
        return this.tempRounding.total_payment
      }
    },

    computedRes () {
      console.log('set', window.innerWidth)
      var w = ''
      if (document.getElementsByClassName('content-wrapper')[0]) {
        w = document.getElementsByClassName('content-wrapper')[0].offsetWidth
      } else {
        w = window.innerWidth - 260
      }
      let cls = 'max-width: ' + w + 'px; padding-right: unset !important'
      return cls
    },

    isEdit () {
      let data1 = { ...this.tempDataRounding}
      data1.amount_breakpoint = parseFloat(data1.amount_breakpoint)
      data1.amount_divider = parseFloat(data1.amount_divider)
      let data2 = { ...this.dataRounding}
      
      return JSON.stringify(data1) === JSON.stringify(data2)
    }
  },

  methods: {
    formatTooltip(val) {
      let aa = document.createElement('div')
      return aa
    },

    getData() {
      this.loading = true

      fetchRoundingSetting().then(response => {
        this.tempDataRounding = { ...response.data.data }
        if (this.tempDataRounding.amount_breakpoint === null) {
          this.tempDataRounding.amount_breakpoint = 0
        }

        // this.dataRounding = { ...response.data.data}

        if (this.tempDataRounding.amount_breakpoint === null) {
          this.dataRounding.amount_breakpoint = 0
        } else {
          this.dataRounding.amount_breakpoint = this.tempDataRounding.amount_breakpoint
        }
        this.dataRounding.amount_divider = parseFloat(this.tempDataRounding.amount_divider)
        this.dataRounding.id = this.tempDataRounding.id
        this.dataRounding.enable = this.tempDataRounding.enable
        this.dataRounding.rounding_mode = this.tempDataRounding.rounding_mode

        // this.dataRound.amount_breakpoint = response.data.data.amount_breakpoint
        // this.dataRound.amount_divider = parseFloat(response.data.data.amount_divider)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    updateData() {
      this.loadingSave = true
      this.loading = true

      updateRoundingSetting(this.dataRounding).then(response => {
        this.tempDataRounding = { ...response.data.data }
        if (this.tempDataRounding.amount_breakpoint === null) {
          this.tempDataRounding.amount_breakpoint = 0
        }
        // this.dataRounding =  { ...response.data.data }
        // if (this.dataRounding.amount_breakpoint === null) {
        //   this.dataRounding.amount_breakpoint = 0
        // }

        if (this.tempDataRounding.amount_breakpoint === null) {
          this.dataRounding.amount_breakpoint = 0
        } else {
          this.dataRounding.amount_breakpoint = this.tempDataRounding.amount_breakpoint
        }
        this.dataRounding.amount_divider = parseFloat(this.tempDataRounding.amount_divider)
        this.dataRounding.id = this.tempDataRounding.id
        this.dataRounding.enable = this.tempDataRounding.enable
        this.dataRounding.rounding_mode = this.tempDataRounding.rounding_mode

        this.loadingSave = false
        this.loading = false
      }).catch((error) => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loadingSave = false
        this.loading = false
      })
    },

    handleUpdateBreakpoint (args) {
      if (args) {
        this.tempBreakpoint = this.dataRounding.amount_breakpoint
      } else {
        this.dataRounding.amount_breakpoint = this.tempBreakpoint
      }
      this.showEditBreakpoint = args
    },

    handleUpdateBreakpointSimulation (args) {
      if (args) {
        this.tempRounding.tempBreakpoint = this.tempRounding.amount_breakpoint
      } else {
        this.tempRounding.amount_breakpoint = this.tempRounding.tempBreakpoint
      }
      this.showEditBreakpointSimulation = args
    }
  }
}
</script>