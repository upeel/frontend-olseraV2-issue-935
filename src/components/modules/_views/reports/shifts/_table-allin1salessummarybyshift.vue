<template>
  <div>
    <el-collapse v-model="activeTab">
      <!-- top discount summary -->
      <el-collapse-item :title="lang.discount_summary" name="1">
        <div class="summary" v-if="data.data_discounts">
          <h5>{{ $lang[langId].summary }}</h5>
          <div v-for="(item, key) in data.data_discounts.totals" :key="key">
            {{ lang.qty_orders }} ({{ item.currency_id }}): <strong>{{ item.fcount_orders }}</strong><br/>
            {{ lang.discount_amount }} ({{ item.currency_id }}): <strong>{{ item.fdiscount_amount }}</strong>
          </div>
        </div>
        <el-table v-if="data.data_discounts" :data="data.data_discounts.details" border>
          <el-table-column :label="lang.sales_source" prop="order_source_name" />
          <el-table-column :label="lang.discount_code" prop="discount_voucher_code" />
          <el-table-column :label="lang.discount_name" prop="discount_voucher_name" />
          <el-table-column :label="lang.discount_amount" prop="fdiscount_amount" />
          <el-table-column :label="lang.qty_orders" prop="count_orders" />
        </el-table>
      </el-collapse-item>

      <!-- top canceled orders -->
      <el-collapse-item :title="lang.cancelled_orders" name="2">
        <div class="summary" v-if="data.data_cancellations">
          <h5>{{ $lang[langId].summary }}</h5>
          <div v-for="(item, key) in data.data_cancellations.totals" :key="key">
            {{ lang.qty_orders }} ({{ item.currency_id }}): <strong>{{ item.fcount_orders }}</strong><br/>
            {{ lang.discount_amount }} ({{ item.currency_id }}): <strong>{{ item.fdiscount_amount }}</strong>
          </div>
        </div>
        <el-table v-if="data.data_cancellations" :data="data.data_cancellations.details" border>
          <el-table-column :label="lang.sales_source" prop="order_source_name" />
          <el-table-column :label="lang.order_amount" prop="ftotal_amount" />
          <el-table-column :label="lang.qty_orders" prop="fcount_orders" />
        </el-table>
      </el-collapse-item>

      <!-- top product groups -->
      <el-collapse-item :title="lang.top_product_groups" name="3">
        <el-table v-if="data.data_top_groups" :data="data.data_top_groups.details" border>
          <el-table-column :label="lang.name" prop="name" />
          <el-table-column :label="lang.qty" prop="ftotal_qty" />
          <el-table-column :label="lang.amount" prop="ftotal_amount" />
        </el-table>
      </el-collapse-item>

      <!-- top products -->
      <el-collapse-item :title="lang.top_products" name="4">
        <el-table v-if="data.data_top_products" :data="data.data_top_products.details" border>
          <el-table-column :label="lang.name" prop="name" />
          <el-table-column :label="lang.qty" prop="ftotal_qty" />
          <el-table-column :label="lang.amount" prop="ftotal_amount" />
        </el-table>
      </el-collapse-item>
      
      <!-- profit loss -->
      <el-collapse-item :title="lang.profit_loss" name="5">
        <div v-if="data.data_profitloss" class="section-collapse">
          <strong>A. {{ lang.income }}</strong>
          <span class="pull-right"><strong>{{ data.data_profitloss.frevenue_income }}</strong></span>
          <el-table v-if="data.data_profitloss" :data="incomes" border class="headless">
            <el-table-column prop="trans_type" />
            <el-table-column prop="famount" />
          </el-table>
        </div>

        <div v-if="data.data_profitloss" class="section-collapse">
          <strong>B. {{ lang.cost_of_goods_sold }}</strong>
          <span class="pull-right"><strong>{{ data.data_profitloss.fgoods_cost_return }}</strong></span>
          <el-table v-if="data.data_profitloss" :data="goodCosts" border class="headless">
            <el-table-column :label="lang.type" prop="trans_type" />
            <el-table-column :label="lang.amount" prop="famount" />
          </el-table>
        </div>

        <div v-if="data.data_profitloss" class="section-collapse">
          <strong>C. {{ lang.gross_profit }} - ({{ $lang[langId].shipping_plus_tax }})</strong>
          <span class="pull-right"><strong>{{ data.data_profitloss.fgross_profit }}</strong></span>
        </div>

        <div v-if="data.data_profitloss" class="section-collapse">
          <strong>D. {{ lang.expenses }}</strong>
          <span class="pull-right"><strong>{{ data.data_profitloss.fexpense_amount }}</strong></span>
          <el-table v-if="data.data_profitloss" :data="data.data_profitloss.expenses" border class="headless">
            <el-table-column :label="lang.type" prop="trans_type" />
            <el-table-column :label="lang.amount" prop="famount" />
          </el-table>
        </div>

        <div v-if="data.data_profitloss" class="section-collapse">
          <strong>E. {{ lang.nett_profit }}</strong>
          <span class="pull-right"><strong>{{ data.data_profitloss.fnett_profit }}</strong></span>
        </div>
      </el-collapse-item>
      
      <!-- product sales by category -->
      <el-collapse-item :title="lang.product_sales_by_category" name="6">
        <el-table v-if="data.data_all_groups" :data="data.data_all_groups.details" border>
          <el-table-column :label="lang.name" prop="name" />
          <el-table-column :label="lang.amount" prop="ftotal_amount" />
          <el-table-column :label="lang.qty" prop="ftotal_qty" />
        </el-table>
      </el-collapse-item>

      <!-- payment by methods -->
      <el-collapse-item :title="lang.payment_by_method" name="7">
        <div class="summary" v-if="data.data_payment_modes">
          <h5>{{ $lang[langId].summary }}</h5>
          <div v-for="(item, key) in data.data_payment_modes.totals" :key="key">
            {{ lang.amount }} ({{ item.currency_id }}): <strong>{{ item.ftotal_amount }}</strong>
          </div>
        </div>

        <el-table
          v-if="data.data_payment_modes"
          :data="data.data_payment_modes.details"
          border>
          <el-table-column :label="lang.payment_modes">
            <template slot-scope="scope">
              <div v-if="scope.row.payment_mode_name">
                {{ scope.row.payment_mode_name }}
              </div>
              <div v-else>
                -
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="lang.bank_account">
            <template slot-scope="scope">
              <div v-if="scope.row.bank_name">
                {{ scope.row.bank_name }} - 
                {{ scope.row.bank_account_name }} - 
                {{ scope.row.bank_account_no }}
              </div>
              <div v-else>
                -
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="lang.sales_amount" prop="ftotal_amount" />
        </el-table>
      </el-collapse-item>

      <!-- cash transaction -->
      <el-collapse-item :title="lang.cash_transactions" name="8">
        <el-table :data="[data.cash_summary]" border>
          <el-table-column :label="lang.cash_void" prop="fcancellation_amount" />
          <el-table-column :label="lang.cash_difference" prop="fdifference_amount" />
          <el-table-column :label="lang.cash_refund" prop="frefund_amount" />
          <el-table-column :label="lang.revenue" prop="frevenue_amount" />
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'TableAllin1salessummarybyshift',
  props: ['data', 'lang', 'summary', 'langId'],
  data() {
    return {
      activeTab: '1'
    }
  },

  computed: {
    incomes() {
      const data = this.data.data_profitloss
      let incomes = []
      if (data.incomes) {
        incomes = [...data.incomes]
      }
      if (data.revenuenonshippinggroups) {
        data.revenuenonshippinggroups.map(item => {
          incomes.push({
            trans_type: item.order_source
            // famount
          })
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
          trans_type: this.lang.tax,
          famount: data.frevenue_tax
        },
        {
          trans_type: this.lang.sales_return,
          famount: data.freturn
        },
        {
          trans_type: 'Non shipping',
          famount: data.frevenue_non_shipping
        }
      )
      return incomes
    },

    goodCosts() {
      let goodCosts = []
      const data = this.data.data_profitloss
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
    }
  }
}
</script>
