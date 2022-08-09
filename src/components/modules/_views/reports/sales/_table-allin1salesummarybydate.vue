<template>
  <div>
    <el-collapse v-model="activeTab">
      <el-collapse-item :title="lang.discount_summary" name="1">
        <div class="summary" v-if="data.data_discounts">
          <h5>{{ $lang[langId].summary }}</h5>
          <div v-for="(item, key) in data.data_discounts.totals" :key="key">
            {{ lang.qty_orders }} ({{ item.currency_id }}): <strong>{{ item.fcount_orders }}</strong><br/>
            {{ lang.discount_amount }} ({{ item.currency_id }}): <strong>{{ item.fdiscount_amount }}</strong>
          </div>
        </div>
        <bs-table
          v-if="data.data_discounts"
          :header="[
            lang.sales_source,
            lang.discount_code,
            lang.discount_name,
            lang.discount_amount,
            lang.qty_orders
          ]">
          <tr
            v-for="(item, key) in data.data_discounts.details"
            :key="key">
            <td>{{ item.order_source_name }}</td>
            <td>{{ item.discount_voucher_code }}</td>
            <td>{{ item.discount_voucher_name }}</td>
            <td>{{ item.fdiscount_amount }}</td>
            <td>{{ item.count_orders }}</td>
          </tr>
        </bs-table>
      </el-collapse-item>

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
          <el-table-column :label="lang.order_amount" min-width="150px" align="right" header-align="center" prop="ftotal_amount" />
          <el-table-column :label="lang.qty_orders" prop="fcount_orders" />
        </el-table>
      </el-collapse-item>

      <el-collapse-item :title="lang.top_product_groups" name="3">
        <el-table v-if="data.data_top_groups" :data="data.data_top_groups.details" border>
          <el-table-column :label="lang.name" prop="name" />
          <el-table-column :label="lang.qty" prop="ftotal_qty" />
          <el-table-column :label="lang.amount" min-width="150px" align="right" header-align="center" prop="ftotal_amount" />
        </el-table>
      </el-collapse-item>

      <el-collapse-item :title="lang.top_products" name="4">
        <el-table v-if="data.data_top_products" :data="data.data_top_products.details" border>
          <el-table-column :label="lang.name" prop="name" />
          <el-table-column :label="lang.qty" prop="ftotal_qty" />
          <el-table-column :label="lang.amount" min-width="150px" align="right" header-align="center" prop="ftotal_amount" />
        </el-table>
      </el-collapse-item>

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
          <strong>C. {{ lang.gross_profit }}</strong>
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
          <strong>E. {{ lang.stock }}</strong>
          <div v-if="data.data_profitloss && data.data_profitloss.stock" >
            <div class="flex-container ml-12 font-14">
              <div class="full-width">{{ lang.stock_out }}</div>
              <div class="full-width">{{ data.data_profitloss.stock.stock_out }}</div>
            </div>
            <div class="flex-container ml-12 font-14">
              <div class="full-width">{{ lang.stock_opname }}</div>
              <div class="full-width">{{ data.data_profitloss.stock.stock_opname }}</div>
            </div>
          </div>
        </div>

        <div v-if="data.data_profitloss" class="section-collapse">
          <strong>F. {{ lang.purchase }}</strong>
          <div v-if="data.data_profitloss && data.data_profitloss.purchases" >
            <div class="flex-container ml-12 font-14">
              <div class="full-width">{{ lang.discount }}</div>
              <div class="full-width">{{ data.data_profitloss.purchases.fpurchases_discount }}</div>
            </div>
            <div class="flex-container ml-12 font-14">
              <div class="full-width">{{ lang.shipping }}</div>
              <div class="full-width">{{ data.data_profitloss.purchases.fpurchases_shipping }}</div>
            </div>
            <div class="flex-container ml-12 font-14">
              <div class="full-width">{{ lang.tax }}</div>
              <div class="full-width">{{ data.data_profitloss.purchases.fpurchases_tax }}</div>
            </div>
          </div>
        </div>

        <div v-if="data.data_profitloss" class="section-collapse">
          <strong>G. Food Delivery</strong>
          <span class="pull-right"><strong>{{ data.data_profitloss.food_delivery_fee.fnet_amount }}</strong></span>
          <el-table :data="foodDelivery" border class="headless">
            <el-table-column :label="lang.type" prop="trans_type" />
            <el-table-column :label="lang.amount" prop="famount" />
          </el-table>
        </div>

        <div v-if="data.data_profitloss" class="section-collapse">
          <strong>H. {{ lang.nett_profit }}</strong>
          <span class="pull-right"><strong>{{ data.data_profitloss.fnett_profit }}</strong></span>
        </div>
      </el-collapse-item>
      
      <!-- product sales by category -->
      <el-collapse-item :title="lang.product_sales_by_category" name="6">
        <el-table v-if="data.data_all_groups" :data="data.data_all_groups.details" border>
          <el-table-column :label="lang.name" prop="name" />
          <el-table-column :label="lang.amount" min-width="150px" align="right" header-align="center" prop="ftotal_amount" />
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

          <el-table-column :label="lang.sales_amount" min-width="150px" align="right" header-align="center" prop="ftotal_amount" />
        </el-table>
      </el-collapse-item>

      <el-collapse-item :title="lang.cash_transactions" name="8">
        <el-table :data="[data.cash_summary]" border>
          <el-table-column :label="lang.cash_void" min-width="150px" align="right" header-align="center" prop="fcancellation_amount" />
          <el-table-column :label="lang.cash_difference" min-width="150px" align="right" header-align="center" prop="fdifference_amount" />
          <el-table-column :label="lang.cash_refund" min-width="150px" align="right" header-align="center" prop="frefund_amount" />
          <el-table-column :label="lang.revenue" min-width="150px" align="right" header-align="center" prop="frevenue_amount" />
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'TableAllin1salesummarybydate',
  props: ['data', 'lang', 'summary', 'langId'],

  mixins: [basicComputedMixin], 

  data() {
    return {
      activeTab: '1'
    }
  },

  computed: {
    incomes() {
      const data = this.data.data_profitloss
      let incomes = []
      if (data.revenuenonshippinggroups) {
        data.revenuenonshippinggroups.map(item => {
          incomes.push({
            trans_type: item.order_source,
            famount: item.famount
          })
        })
      }
      if (data.credit_payment) {
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
    },

    foodDelivery () {
      let fooddev = []
      const data = this.data.data_profitloss.food_delivery_fee
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
