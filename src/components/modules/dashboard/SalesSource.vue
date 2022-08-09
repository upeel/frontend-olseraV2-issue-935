<template>
  <div
    v-if="userRole.role_id !== 'ST' && userRole.role_id !== 'SA'"
    v-loading="loading"
    class="flex-container-same-height no-flex-sm mb-16 bg-white box-shadow radius-10">
    <div class="dashboard-banner-section">
      <svg-icon icon-class="activity" style="width: 20px; height:20px; stroke:#FFFFFF;"></svg-icon>
      <span style="font-size: 18px">{{ lang.sales_source }}</span>
    </div>

    <!-- <ve-pie
      v-if="stageLevel === 'dev' || stageLevel === 'sit'"
      :data="dataChart"
      :legend-visible="false"
      :settings="option"
      :colors="data.revenue_groupings.colors">
    </ve-pie> -->

    <div class="dashboard-content-section">
      <div v-if="!showCircle" class="text-center">
        <el-progress
          type="circle"
          :percentage="0"
          :stroke-width="40"
          :width="180">
        </el-progress>
        <p>{{ $lang[langId].no_data }}</p>
      </div>

      <template v-if="showCircle && showCircleMore">
        <div
          class="text-center"
          v-for="(item, index) in data.revenue_groupings.data"
          :key="index">
          <el-progress
            type="circle"
            :percentage="item.value_percentage"
            :stroke-width="40"
            :width="180"
            :color="item.colors">
          </el-progress>
          <div class="flex-container" style="justify-content: center;">
            <i class="material-icons" style="color:#3498db" v-if="item.id === 'O'">language</i>
            <i class="material-icons" style="color:#00ccff" v-if="item.id === 'M'">smartphone</i>
            <i class="material-icons" style="color:#2ecc71" v-if="item.id === 'P'">tablet_mac</i>
            <i class="material-icons" style="color:#e74c3c" v-if="item.id === 'D'">launch</i>
            <i class="material-icons" style="color:#f39c12" v-if="item.id === 'T'">shopping_basket</i>

            <span style="color:#3498db; font-weight: bold; margin: 5px;" v-if="item.id === 'O'">{{ item.label }}</span>
            <span style="color:#00ccff; font-weight: bold; margin: 5px;" v-if="item.id === 'M'">{{ item.label }}</span>
            <span style="color:#2ecc71; font-weight: bold; margin: 5px;" v-if="item.id === 'P'">{{ item.label }}</span>
            <span style="color:#e74c3c; font-weight: bold; margin: 5px;" v-if="item.id === 'D'">{{ item.label }}</span>
            <span style="color:#f39c12; font-weight: bold; margin: 5px;" v-if="item.id === 'T'">{{ item.label }}</span>
          </div>
          <div class="flex-container" style="justify-content: center;">
            <i class="material-icons" style="color:#3498db" v-if="item.id === 'O'"><svg-icon icon-class="circle" style="margin-right: 12px;" /></i>
            <i class="material-icons" style="color:#00ccff" v-if="item.id === 'M'"><svg-icon icon-class="circle" style="margin-right: 12px;" /></i>
            <i class="material-icons" style="color:#2ecc71" v-if="item.id === 'P'"><svg-icon icon-class="circle" style="margin-right: 12px;" /></i>
            <i class="material-icons" style="color:#e74c3c" v-if="item.id === 'D'"><svg-icon icon-class="circle" style="margin-right: 12px;" /></i>
            <i class="material-icons" style="color:#f39c12" v-if="item.id === 'T'"><svg-icon icon-class="circle" style="margin-right: 12px;" /></i>

            <span style="color:#3498db; font-weight: bold; margin: 5px;" v-if="item.id === 'O'">{{ item.fvalue }}</span>
            <span style="color:#00ccff; font-weight: bold; margin: 5px;" v-if="item.id === 'M'">{{ item.fvalue }}</span>
            <span style="color:#2ecc71; font-weight: bold; margin: 5px;" v-if="item.id === 'P'">{{ item.fvalue }}</span>
            <span style="color:#e74c3c; font-weight: bold; margin: 5px;" v-if="item.id === 'D'">{{ item.fvalue }}</span>
            <span style="color:#f39c12; font-weight: bold; margin: 5px;" v-if="item.id === 'T'">{{ item.fvalue }}</span>
          </div>
        </div>
      </template>

      <el-row v-if="showCircle && showCircleMore2">
        <el-col
          v-for="(item, index) in data.revenue_groupings.data"
          :key="index"
          :sm="12"
          class="text-center mb-16">
          <el-progress
            type="circle"
            :percentage="item.value_percentage"
            :stroke-width="40"
            :width="180"
            :color="item.colors">
          </el-progress>
          <div class="flex-container" style="justify-content: center;">
            <i class="material-icons" style="color:#3498db" v-if="item.id === 'O'">language</i>
            <i class="material-icons" style="color:#00ccff" v-if="item.id === 'M'">smartphone</i>
            <i class="material-icons" style="color:#2ecc71" v-if="item.id === 'P'">tablet_mac</i>
            <i class="material-icons" style="color:#e74c3c" v-if="item.id === 'D'">launch</i>
            <i class="material-icons" style="color:#f39c12" v-if="item.id === 'T'">shopping_basket</i>

            <span style="color:#3498db; font-weight: bold; margin: 5px;" v-if="item.id === 'O'">{{ item.label }}</span>
            <span style="color:#00ccff; font-weight: bold; margin: 5px;" v-if="item.id === 'M'">{{ item.label }}</span>
            <span style="color:#2ecc71; font-weight: bold; margin: 5px;" v-if="item.id === 'P'">{{ item.label }}</span>
            <span style="color:#e74c3c; font-weight: bold; margin: 5px;" v-if="item.id === 'D'">{{ item.label }}</span>
            <span style="color:#f39c12; font-weight: bold; margin: 5px;" v-if="item.id === 'T'">{{ item.label }}</span>
            <span :style="'color:' + item.colors + '; font-weight: bold; margin: 5px;'" v-if="item.id === 'G'">{{ item.label }}</span>
          </div>
          <div class="flex-container" style="justify-content: center;">
            <i class="material-icons" style="color:#3498db" v-if="item.id === 'O'"><svg-icon icon-class="circle" style="margin-right: 12px;" /></i>
            <i class="material-icons" style="color:#00ccff" v-if="item.id === 'M'"><svg-icon icon-class="circle" style="margin-right: 12px;" /></i>
            <i class="material-icons" style="color:#2ecc71" v-if="item.id === 'P'"><svg-icon icon-class="circle" style="margin-right: 12px;" /></i>
            <i class="material-icons" style="color:#e74c3c" v-if="item.id === 'D'"><svg-icon icon-class="circle" style="margin-right: 12px;" /></i>
            <i class="material-icons" style="color:#f39c12" v-if="item.id === 'T'"><svg-icon icon-class="circle" style="margin-right: 12px;" /></i>

            <span style="color:#3498db; font-weight: bold; margin: 5px;" v-if="item.id === 'O'">{{ item.fvalue }}</span>
            <span style="color:#00ccff; font-weight: bold; margin: 5px;" v-if="item.id === 'M'">{{ item.fvalue }}</span>
            <span style="color:#2ecc71; font-weight: bold; margin: 5px;" v-if="item.id === 'P'">{{ item.fvalue }}</span>
            <span style="color:#e74c3c; font-weight: bold; margin: 5px;" v-if="item.id === 'D'">{{ item.fvalue }}</span>
            <span style="color:#f39c12; font-weight: bold; margin: 5px;" v-if="item.id === 'T'">{{ item.fvalue }}</span>
            <span :style="'color:' + item.colors + '; font-weight: bold; margin: 5px;'" v-if="item.id === 'G'">{{ item.fvalue }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  props: {
    data: {
      type: Object,
      default: null
    },
    showCircleMore: {
      type: Boolean,
      default: null
    },
    showCircle: {
      type: Boolean,
      default: null
    },
    showCircleMore2: {
      type: Boolean,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      income: 0,
      dataPie: {
        columns: ['date', 'PV', 'Order'],
        rows: [
          { 'date': '2018-05-22', 'PV': 32371, 'Order': 19810 },
          { 'date': '2018-05-23', 'PV': 12328, 'Order': 4398 },
          { 'date': '2018-05-24', 'PV': 92381, 'Order': 52910 }
        ]
      },
      option: {
        label: {
          normal: {
            show: true,
            formatter: function(d) {
              console.log('ddd', d)
                return d.name;
              }
          }
        },
        itemStyle: {
            borderColor: '#fff',
            borderWidth: 10
        },
      }
    }
  },

  computed: {
    dataChart () {
      let data = {
        columns: ['label', 'value', 'fvalue'],
        rows: []
      }
      if (this.data.revenue_groupings.data && this.data.revenue_groupings.data.length > 0) {
        this.data.revenue_groupings.data.map(i => {
          data.rows.push({
            label: i.label + '\n' + i.fvalue,
            value: i.value_percentage,
            fvalue: i.fvalue
          })
        })
      }
      return data
    },
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
    userRole() {
      const selectedStore = this.$store.getters.selectedStore
      return {
        role_id: selectedStore.role_id,
        role_name: selectedStore.role_name,
        is_pos_only: selectedStore.is_pos_only,
        is_mobile: selectedStore.is_mobile
      }
    }
  }
}
</script>
