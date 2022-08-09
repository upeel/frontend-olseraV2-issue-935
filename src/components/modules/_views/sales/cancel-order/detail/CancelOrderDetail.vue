<template>
    <div v-loading="loading" class="sales-detail">
      <section class="order-detail">
        <el-card class="box-card with-back-button">
          <div class="card-body">
            <el-button icon="el-icon-arrow-left" class="back-button" @click="back"/>

            <div class="flex-container flex-container--wrap">
              <div style="flex-grow: 1;">
                <h4 v-if="!cancelOrderData.order_no">-</h4>
                <h4 v-else>{{ cancelOrderData.order_no }}</h4>
                <p>{{ lang.sales_by }} {{ cancelOrderData.created_by }}</p>
              </div>

              <div>
                <el-button class="el-dropdown-link mb-4" icon="el-icon-printer" @click="download('pdf')" />
                <el-date-picker
                  v-model="cancelOrderData.order_date"
                  :placeholder="this.$lang[langId].pick_a_day"
                  format="dd-MM-yyyy"
                  type="date"
                  disabled
                  class="mb-4"
                />
              </div>
            </div>
          </div>
        </el-card>

        <div class="row">
          <div class="col-md-4">
            <el-card class="box-card">
              <div slot="header">
                <h3 class="box-title">{{ lang.customer }}</h3>
              </div>
              <div class="card-body">
                <ul class="list-unstyled">
                  <li>
                    <p>{{ lang.name }}</p>
                    <div>
                      <h5 v-if="!cancelOrderData.customer_name">-</h5>
                      <h5 v-else>{{ cancelOrderData.customer_name }}</h5>
                    </div>
                  </li>
                  <li>
                    <p>{{ lang.email }}</p>
                    <div>
                      <h5 v-if="!cancelOrderData.customer_email">-</h5>
                      <h5 v-else>{{ cancelOrderData.customer_email }}</h5>
                    </div>
                  </li>
                </ul>
              </div>
            </el-card>
          </div>
          <div class="col-md-4">
            <el-card class="box-card">
              <div slot="header">
                <h3 class="box-title">{{ lang.shipping_to }}</h3>
              </div>
              <div class="card-body">
                <ul class="list-unstyled">
                  <li>
                    <p>{{ lang.name }}</p>
                    <div>
                      <h5 v-if="!cancelOrderData.shipping_to">-</h5>
                      <h5 v-else>{{ cancelOrderData.shipping_to }}</h5>
                    </div>
                  </li>
                  <li>
                    <p>{{ lang.address }}</p>
                    <div>
                      <h5 v-if="!cancelOrderData.shipping_address">-</h5>
                      <h5 v-else>{{ cancelOrderData.shipping_address }}</h5>
                    </div>
                  </li>
                  <li>
                    <p>{{ lang.phone }}</p>
                    <div>
                      <h5 v-if="!cancelOrderData.shipping_phone">-</h5>
                      <h5 v-else>{{ cancelOrderData.shipping_phone }}</h5>
                    </div>
                  </li>
                </ul>
              </div>
            </el-card>
          </div>
          <div class="col-md-4">
            <el-card class="box-card">
              <div slot="header">
                <h3 class="box-title">{{ lang.shipping_courier }}</h3>
              </div>
              <div class="card-body">
                <ul class="list-unstyled">
                  <li>
                    <p>{{ lang.courier }}</p>
                    <div>
                      <h5 v-if="!cancelOrderData.shipping_courier_name">-</h5>
                      <h5 v-else>{{ cancelOrderData.shipping_courier_name }}</h5>
                    </div>
                  </li>
                  <li>
                    <p>{{ lang.tracking_no }}</p>
                    <div>
                      <h5 v-if="!cancelOrderData.shipping_track_no">-</h5>
                      <h5 v-else>{{ cancelOrderData.shipping_track_no }}</h5>
                    </div>
                  </li>
                </ul>
              </div>
            </el-card>
          </div>
        </div>

        <cancel-table :data-table="cancelOrderData"></cancel-table>

        <div class="row">
          <div class="col-md-12">
            <el-card class="box-card">
              <div slot="header">
                <h3 class="box-title">{{ lang.deal_detail }}</h3>
              </div>
              <div class="card-body">
                <div style="margin-bottom: 22px;">
                  <h5>{{ lang.created_time }}</h5>
                  <label>{{ cancelOrderData.created_by }}, {{ cancelOrderData.order_time }}</label>
                </div>
                <div>
                  <h5>{{ lang.last_modified }}</h5>
                  <label>{{ cancelOrderData.modified_by }}, {{ cancelOrderData.modified_time }}</label>
                </div>
              </div>
            </el-card>
          </div>
        </div>

      </section>
    </div>
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import CancelTable from './CancelOrderTable'
import { checkCustomPermission } from '@/mixins/checkCustomPermission'

export default {
  name: 'CancelReturnDetail',
  components: {
    CancelTable
  },
  mixins: [checkCustomPermission],
  data() {
    return {
      loading: true,
      loadingElement: false,
      cancelOrderData: {},
      downloadValue: null,
      downloadSelect: [
        {
          value: '',
          label: this.$store.state.userStores.lang.download_pdf
        },
        {
          value: '1',
          label: this.$store.state.userStores.lang.invoice
        },
        {
          value: '2',
          label: this.$store.state.userStores.lang.packing_label
        },
        {
          value: '3',
          label: this.$lang[this.$store.state.userStores.langId].packing_label_1_or_2
        },
        {
          value: '4',
          label: this.$lang[this.$store.state.userStores.langId].packing_label_weight
        }
      ]
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
    }
  },

  methods: {
    getDetailData(store) {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }
      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, 'cancelledorder/' + this.$route.params.id),
        headers: headers
      })
        .then(response => {
          this.cancelOrderData = response.data.data
          this.splitDate(this.cancelOrderData.order_date)
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          console.log(error)
          this.$notify({
            type: 'warning',
            message: error
          })
        })
    },
    splitDate(val) {
      let date = val
      let dateSplit = date.split(' ')
      let cancelDate = dateSplit[0]
      this.cancelOrderData.order_date = cancelDate
    },
    download(file = 'pdf') {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        url: baseApi(this.selectedStore.url_id, this.langId, 'closeorder/' + file),
        method: 'GET',
        headers,
        responseType: 'blob',
        params: {
          id: this.cancelOrderData.id
        }
      }).then((response) => {
        const fileName = this.cancelOrderData.order_no + '_' + file + '.pdf'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.statusText
        })
      })
    },
    back() {
      this.$router.push('/sales/cancelorder/')
    }
  },
  beforeMount() {
    this.handleCustomPermissionSinglePage('sales/cancelledorders', 'show')
  },
  mounted() {
    // console.log(this.selectedStore)
    this.getDetailData(this.selectedStore)
  }
}
</script>
