<template>
  <div class="innerpage-fullscreen">
    <div class="innerpage-fullscreen--header">
      <el-button
        class="innerpage-fullscreen--back"
        type="text"
        @click="$router.push({
          path: '/service-activation-v2'
        })">
        <svg-icon icon-class="arrow-left" />
      </el-button>
      <h4 class="innerpage-fullscreen--title">Grabfood</h4>
    </div>
    <div class="innerpage-fullscreen--container mw-1056">
      <el-card
        v-loading="loadingSetupData"
        class="box-card text-center border border--info">
        <div class="font-56 color-success">
          <svg-icon icon-class="grabfood-success-activation" />
        </div>
        <div class="font-24 font-semi-bold">
          Pengajuan Diterima
        </div>
        <div class="font-20">
          Kenali strukturnya, atur daftar menu GrabFood-mu sekarang!
        </div>
        <el-button
          type="success"
          @click="aturDaftarMenu">
          Atur daftar menu
        </el-button>
      </el-card>
    </div>

    <dialog-setup
      ref="dialogSetupV2"
      :show="visibleDialogSetup"
      :data-periods="dataPeriods"
      :setup-data="setupData"
      :grabfoodData="grabfoodData"
      @getperiod="getDataPeriod()"
    />

    <dialog-setup-old
      :show="visibleDialogSetupOld"
      :setup-data="setupData"
      :grabfoodData="grabfoodData"
    />
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { fetchAllGroupByStore,
  fetchByStore as fetchGrabfoodStore, 
  getGrabPeriodStore } from '@/api/thirdParty/grabfood'
import dialogSetup from './dialogSetup'
import dialogSetupOld from './dialogSetupOld'
import moment from 'moment'
export default {
  components: {
    dialogSetup,
    dialogSetupOld
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loadingSetupData: false,
      visibleDialogSetup: false,
      visibleDialogSetupOld: false,
      setupData: {
        group_menu: []
      },
      grabfoodData: {},
      dataPeriods: []
    }
  },

  mounted() {
    this.fetchAllGroupByStore()
    this.handleGetGrabfoodStore()
  },

  computed: {
    grabAcces() {
      return ['setdemo1', 
      'allinolsera2', 
      'cabangsupport3', 
      'testdaftar41', 
      'demo6', 
      'olserapos', 
      'bdgdemoresto', 
      'bdgdemoretail',
      'cobagrab',
      'devtesttwa',
      'cobagrab2',
      'cobagrab3',
      'cobagrab4',
      'okgrab']
    }
  },

  methods: {
    aturDaftarMenu() {
      // if (this.grabAcces.includes(this.selectedStore.url_id)) {
        this.getDataPeriod()
        this.visibleDialogSetup = true
      // } else {
      //   this.visibleDialogSetupOld = true
      // }
    },

    fetchAllGroupByStore() {
      this.loadingSetupData = true
      fetchAllGroupByStore().then(response => {
        this.setupData = response.data.data
        // console.log('setupData', this.setupData)
        this.loadingSetupData = false
        this.$router.push({
          path: '/service-activation-v2/grabfood/manage'
        })
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.string
        })
        this.setupData = {
          id: this.$route.params.id,
          group_menu: []
        }
        this.loadingSetupData = false
      })
    },

    handleGetGrabfoodStore() {
      this.loading = true
      fetchGrabfoodStore().then(response => {
        this.grabfoodData = response.data.data
        this.editData = this.grabfoodData.group_menu
        this.data = this.grabfoodData.group_menu
        this.data.map(m => {
          m.categories.map(i => {
            i.menus.map(j => {
              j.category = {
                is_alias: i.is_alias,
                id: i.id,
                name: i.name
              }
              j.group_id = m.id
            })
          })
        })
        this.loading = false
      }).catch(() => {
        this.grabfoodData = {}
        this.loading = false
      })
    },

    async getDataPeriod () {
      this.loadingDialog = true
      let date = moment().format('YYYY-MM-DD')
      let dayNow = moment().format('YYYY MM DD')
      await getGrabPeriodStore().then(response => {
        this.$refs.dialogSetupV2.setUpdate()
        this.dataPeriods = response.data.data
        this.dataPeriods.map(i => {
          if (i.times.length) {
            let tmn = []
            i.times.map(j => {
              // j.start_time = moment(date + ' ' + j.start_time).format('HH:mm')
              // j.end_time = moment(date + ' ' + j.end_time).format('HH:mm')
              tmn.push({
                time_id: j.time_id,
                start_time: moment(date + ' ' + j.start_time).format('HH:mm'),
                end_time: moment(date + ' ' + j.end_time).format('HH:mm'),
                fstart_time: j.fstart_time,
                fend_time: j.fend_time,
                checked: j.checked,
                timer: [moment(dayNow + ' ' + j.start_time), moment(dayNow + ' ' + j.end_time)]
              })
            })
            i.times = [ ...tmn]
          }
          i.checked = false
          if (i.period_type === 1) {
            i.checked = true
          }
        })
        this.loadingDialog = false
      }).catch(error => {
        // this.$message({
        //   type: 'error',
        //   message: error.string
        // })
        this.loadingDialog = false
      })
    },
  }
}
</script>
