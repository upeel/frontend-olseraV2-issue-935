<template>
  <el-card class="box-card">
    <div slot="header">
      <h3 class="box-title">{{ lang.order_item }}</h3>
    </div>

    <div class="card-body">
      <div class="no-product text-center" v-if="!showTable">
        <p>{{ lang.no_order }}</p>
        <img src="/static/img/no-data.svg" alt="No Data Picture">
      </div>
      <div v-else>
        <div class="table-responsive">
          <table class="table-orderitems table table-striped">
            <thead>
              <tr>
                <th width="20">No. </th>
                <th width="300" class="description">{{ lang.description }}</th>
                <th width="50">{{ lang.qty }}</th>
                <th width="100">{{ lang.price }} ({{ detailData.currency_id }})</th>
                <th width="100">{{ lang.total_price }} ({{ detailData.currency_id }})</th>
                <th width="100">  </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, key) in detailData.orderitems" :key="key">
                <td>{{ key + 1 }}</td>
                <td>
                  <div class="flex-container">
                    <el-avatar
                      v-if="item.photo_md"
                      :src="item.photo_md"
                      style="min-width: 40px;"
                    />
                    <!-- <div class="ml-8">
                      {{ item.product_name }} - {{ item.product_variant_name }}
                      <span v-if="item.product_sku">({{ item.product_sku }})</span>
                      <p v-if="item.serial_no">{{ item. serial_no }}</p>
                    </div> -->
                    <div class="ml-8">
                      <template v-if="item.product_name">{{ item.product_name }}</template>
                      <template v-if="item.product_variant_name">{{ item.product_variant_name }}</template>
                      <template v-if="item.product_combo_name">{{ item.product_combo_name }}</template>
                      <span v-if="item.product_sku">
                        ({{ item.product_sku }})
                      </span>

                      <div v-if="item.product_combo_id" class="product-comodities">
                        <strong class="size-11">{{ lang.products_inside }}</strong>
                        <ul class="list-unstyled">
                          <li v-for="productPackage in item.products" :key="productPackage.id">
                            * {{ productPackage.product_name }} ({{ productPackage.qty }})
                          </li>
                        </ul>
                      </div>
                      <div v-if="item.note" class="font-12">{{ item.note }}</div>
                    </div>
                  </div>
                </td>
                <td valign="middle" align="left">
                  <div v-if="!item.qty">-</div>
                  <div v-else> {{item.qty}} </div>
                </td>
                <td valign="middle" align="left">
                  <div v-if="!item.fprice">-</div>
                  <div v-else> {{item.fprice}} </div>
                </td>
                <td valign="middle" align="left">{{item.famount}}</td>
                <td></td>
              </tr>
              <tr>
                <td colspan="5" style="border-bottom: 1px solid #000; padding: 0 0 0 0;"></td>
                <td colspan="5" style="border-bottom: 1px solid #000; padding: 0 0 0 0;"></td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: right;">{{ lang.order_amount }}</td>
                <th>{{ detailData.total_item_qty }}</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: right;">{{ lang.subtotal }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.forder_amount }}</th>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: right;">{{ lang.discount }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.fdiscount_amount }}</th>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: right;">{{ lang.service_charge }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.fservice_charge_amount }}</th>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: right;">{{ lang.tax }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.ftax_amount }}</th>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: right;">{{ $lang[langId].rounded }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.frounded_amount }}</th>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td style="text-align: right;">{{ lang.shipping_cost }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.fshipping_cost }}</th>
                <td></td>
              </tr>
              <tr style="background-color: #fff;">
                <td></td>
                <td style="text-align: right;">{{ lang.total_due }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.ftotal_amount }}</th>
                <td></td>
              </tr>
              <tr>
                <td colspan="6" style="padding: 0 0 0 0;"></td>
              </tr>
              <tr style="background-color: #fff;">
                <td></td>
                <td style=" text-align: right;">{{ lang.payment }}</td>
                <td></td>
                <td></td>
                <th>{{ detailData.fpayment_amount }}</th>
                <td></td>
              </tr>
              <tr v-for="item in detailData.creditpayments" :key="item.id" style="background-color: #fff;">
                <td></td>
                <td class="text-right ipad-style">
                  <template v-if="item.payment_mode_name === ''">
                    {{ lang.payment }} {{ item.payment_type_name }} {{ item.fpayment_date }}
                  </template>
                  <template v-else>
                    {{ lang.payment }} {{ item.payment_mode_name }} {{ item.fpayment_date }}
                  </template>
                </td>
                <td></td>
                <td></td>
                <th>{{ item.fpayment_amount }}</th>
                <td></td>
              </tr>
              <tr v-if="parseInt(detailData.credit_outstanding_amount) !== 0">
                <td></td>
                <td class="text-right ipad-style">{{ lang.outstanding_payment }}</td>
                <td></td>
                <td></td>
                <th align="right" style="text-align: right;">{{ detailData.fcredit_outstanding_amount }}</th>
                <td v-if="showEdit">
                  <el-button size="small" type="text" icon="el-icon-plus" @click="setPayment(true)">
                    {{ lang.payment }}
                  </el-button>
                </td>
              </tr>
              <tr
                v-if="detailData.payment_type_id === 'BT'"
                style="background-color: #fff;">
                <th colspan="6">
                  <p>
                    <label>{{ lang.payment }} {{ detailData.payment_type_name }} ( {{ detailData.bt_bank_name }} - {{ detailData.bt_account_no }} )</label>
                  </p>
                  <p>
                    <label v-if="!detailData.payment_from_bank">{{ lang.payment_via_bank }} : -</label>
                    <label v-else>{{ lang.payment_via_bank }} : {{ detailData.payment_from_bank }} {{ detailData.payment_payee !== null ? '(' + detailData.payment_payee + ')' : ''}}</label>
                  </p>
                  <p>
                    <label v-if="detailData.payment_charge">{{ lang.payment_charge }} : {{ detailData.payment_charge }}</label>
                  </p>
                  <p>
                    <label v-if="!detailData.payment_ref">{{ lang.payment_ref }} : -</label>
                    <label v-else>{{ lang.payment_ref }} : {{ detailData.payment_ref }}</label>
                  </p>
                  <p>
                    <label v-if="!detailData.payment_date">{{ lang.payment_date }} : -</label>
                    <label v-else>{{ lang.payment_date }} : {{ detailData.payment_date }}</label>
                  </p>
                </th>
                <td></td>
              </tr>
              <tr
                v-else
                style="background-color: #fff;">
                <th colspan="6">
                  <p>
                    <label v-if="detailData.payment_mode_name">{{ lang.payment_mode }} : {{ detailData.payment_mode_name }}</label>
                    <label v-else>{{ lang.payment_mode }} : -</label>
                  </p>
                  <p>
                    <label v-if="detailData.payment_charge">{{ lang.payment_charge }} : {{ detailData.payment_charge }}</label>
                    <label v-else>{{ lang.payment_charge }} : -</label>
                  </p>
                  <p>
                    <label v-if="!detailData.payment_ref">{{ lang.payment_ref }} : -</label>
                    <label v-else>{{ lang.payment_ref }} : {{ detailData.payment_ref }}</label>
                  </p>
                  <p>
                    <label v-if="!detailData.payment_date">{{ lang.payment_date }} : -</label>
                    <label v-else>{{ lang.payment_date }} : {{ detailData.payment_date }}</label>
                  </p>
                </th>
                <td></td>
              </tr>
              <!-- <tr style="background-color: #fff;">
                <td style="border: none;"></td>
                <td style="border: none; text-align: right;">{{ lang.payment_methods }}</td>
                <th style="border: none; text-align: right;">
                  <p>
                    <label v-if="!detailData.payment_from_bank">{{ lang.payment_via_bank }} : -</label>
                    <label v-else>{{ lang.payment_via_bank }} : {{ detailData.payment_from_bank }}</label>
                  </p>

                  <p>
                    <label v-if="!detailData.payment_ref">{{ lang.payment_ref }} : -</label>
                    <label v-else>{{ lang.payment_ref }} : {{ detailData.payment_ref }}</label>
                  </p>

                  <p>
                    <label v-if="!detailData.payment_date">{{ lang.payment_date }} : -</label>
                    <label v-else>{{ lang.payment_date }} : {{ detailData.payment_date }}</label>
                  </p>
                </th>
                <td style="border: none;"></td>
              </tr> -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'CancelTable',
  props: {
    dataTable: {
      default: null,
      type: Object
    }
  },
  data() {
    return {
      loading: true,
      detailData: {},
      showTable: false
    }
  },

  watch: {
    dataTable() {
      this.getData()
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
    },
    rootLang() {
      return this.$lang[this.$store.state.userStores.langId]
    }
  },

  methods: {
    getData() {
      this.detailData = Object.assign({}, this.dataTable)
      this.refreshTable()
    },
    refreshTable() {
      this.loading = true
      if (this.detailData.orderitems.length > 0) {
        this.loading = false
        this.showTable = true
      } else {
        this.loading = false
        this.showTable = false
      }
    }
  }
}
</script>
