<template>
  <div>
    <div class="section-collapse">
      <strong>A. {{ lang.income }}</strong>
      <span class="pull-right"><strong>{{ data.frevenue_income }}</strong></span>
      <el-table :data="incomes" border class="headless">
        <el-table-column prop="trans_type" />
        <el-table-column prop="famount" />
      </el-table>
    </div>

    <div class="section-collapse">
      <strong>B. {{ lang.cost_of_goods_sold }}</strong>
      <span class="pull-right"><strong>{{ data.fgoods_cost_return }}</strong></span>
      <el-table :data="goodCosts" border class="headless">
        <el-table-column :label="lang.type" prop="trans_type" />
        <el-table-column :label="lang.amount" prop="famount" />
      </el-table>
    </div>

    <div class="section-collapse">
      <strong>C. {{ lang.gross_profit }} - ({{ $lang[langId].shipping_plus_tax }})</strong>
      <span class="pull-right"><strong>{{ data.fgross_profit }}</strong></span>
    </div>

    <div class="section-collapse">
      <strong>D. {{ lang.expenses }}</strong>
      <span class="pull-right"><strong>{{ data.fexpense_amount }}</strong></span>
      <el-table :data="data.expenses" border class="headless">
        <el-table-column :label="lang.type" prop="trans_type" />
        <el-table-column :label="lang.amount" prop="famount" />
      </el-table>
    </div>

    <div class="section-collapse">
      <strong>E. {{ this.$lang[this.$store.state.userStores.langId].stock_difference, }}</strong>

      <el-table :data="dataStock" border class="headless">
        <el-table-column :label="lang.type" prop="trans_type" />
        <el-table-column :label="lang.amount" prop="famount" />
      </el-table>
    </div>

    <div class="section-collapse">
      <strong>F. {{ lang.purchase }}</strong>
      <span class="pull-right"><strong>{{ data.purchases.fpurchases_gross }}</strong></span>
      <el-table :data="dataPurchase" border class="headless">
        <el-table-column :label="lang.type" prop="trans_type" />
        <el-table-column :label="lang.amount" prop="famount" />
      </el-table>
    </div>

    <div class="section-collapse">
      <strong>G. Food Delivery</strong>
      <span class="pull-right"><strong>{{ data.food_delivery_fee.forder_amount }}</strong></span>
      <el-table :data="foodDelivery" border class="headless">
        <el-table-column :label="lang.type" prop="trans_type" />
        <el-table-column :label="lang.amount" prop="famount" />
      </el-table>
    </div>

    <div class="section-collapse">
      <strong>H. {{ lang.nett_profit }}</strong>
      <span class="pull-right"><strong>{{ data.fnett_profit }}</strong></span>
    </div>

    <div class="section-collapse">
      <strong>I. {{ lang.product_stock_info }}</strong>
      <el-table :data="stockInfo" border class="headless">
        <el-table-column :label="lang.type" prop="trans_type" />
        <el-table-column :label="lang.amount" prop="famount" />
      </el-table>
    </div>

  </div>
</template>

<script>
import MixinReport from '../MixinReport'
export default {
  name: 'TableSalesdetails',
  props: ['data', 'lang', 'summary', 'langId'],

  mixins: [MixinReport],

  computed: {
    incomes() {
      const data = this.data
      let incomes = []
      if (data.revenuenonshippinggroups) {
        data.revenuenonshippinggroups.map(item => {
          incomes.push({
            trans_type: item.order_source,
            famount: item.famount
          })
        })
      }
      if (data.has_credit_payment === 1) {
        incomes.push({
          trans_type: this.lang.credit_payments,
          famount: data.fcredit_payment
        })
      }
      if (data.has_shipping === 1) {
        incomes.push({
          trans_type: this.lang.deliveries,
          famount: data.frevenue_shipping
        })
      }
      if (data.has_service_charge === 1) {
        incomes.push({
          trans_type: this.lang.service_charge,
          famount: data.frevenue_service_charge
        })
      }
      incomes.push(
        {
          trans_type: this.lang.tax + ' (exclude)',
          famount: data.frevenue_tax
        },
        {
          trans_type: this.lang.tax + ' (include)',
          famount: data.frevenue_tax_include
        },
        {
          trans_type: this.lang.sales_return,
          famount: data.freturn
        }
      )
      if (data.incomes) {
        incomes.push(...data.incomes)
      }
      return incomes
    },

    goodCosts() {
      let goodCosts = []
      const data = this.data
      if (data) {
        goodCosts.push(
          {
            trans_type: this.lang.total_sales_cost_price,
            famount: data.fgoods_cost
          },
          {
            trans_type: this.lang.total_return_cost_price,
            famount: data.freturn_cost
          }
        )
      }
      return goodCosts
    },

    stockInfo() {
      let stockInfo = []
      const data = this.data
      if (data) {
        stockInfo.push(
          {
            trans_type: this.lang.incoming_stock,
            famount: data.fincoming_stock
          },
          {
            trans_type: this.lang.product_stock_balance_as_now,
            famount: data.fbalance_stock
          }
        )
      }
      return stockInfo
    },

    dataPurchase () {
      let purchase = []
      const data = this.data
      if (data) {
        purchase.push(
          {
            trans_type: this.lang.discount,
            famount: data.purchases.fpurchases_discount
          },
          {
            trans_type: this.lang.shipping,
            famount: data.purchases.fpurchases_shipping
          },
          {
            trans_type: this.lang.tax,
            famount: data.purchases.fpurchases_tax
          },
        )
      }
      if (this.selectedStore.url_id === 'suksessport') { purchase.splice(0, 1) }
      return purchase
    },
    dataStock () {
      let stock = []
      const data = this.data
      if (data) {
        stock.push(

          {
            trans_type: this.$lang[this.$store.state.userStores.langId].stock_out,
            famount: data.stock.stock_out
          },
          {
            trans_type: this.$lang[this.$store.state.userStores.langId].stock_opname,
            famount: data.stock.stock_opname
          },
        )
      }
      if (this.selectedStore.url_id === 'suksessport') { stock.splice(0, 1) }
      return stock
    },

    foodDelivery () {
      let fooddev = []
      const data = this.data.food_delivery_fee
      if (data.detail) {
        data.detail.map(i => {
          fooddev.push(
            {
              trans_type: i.order_source,
              famount: i.fnet_amount
            }
          )
        })
      }
      return fooddev
    }
  }
}
</script>
