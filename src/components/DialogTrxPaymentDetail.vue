<template>
  <el-dialog
    :visible.sync="show"
    :before-close="beforeClose"
    :show-close="false"
    append-to-body
    custom-class="mw-980">
    <div class="text-left" slot="title">
      <div class="font-24 flex-container">
        <div class="full-width">{{ rootLang.bill_detail }}</div>
        <div class="float-right" style="display: flex">
          <el-button
            type="info"
            class="mr-8"
            @click="getPDF">
            <svg-icon icon-class="download" /> {{ rootLang.download }}
          </el-button>
          <el-button type="info" @click="beforeClose">
            {{ lang.close }}
          </el-button>
        </div>
      </div>
    </div>

    <div>
      <div class="font-24 font-bold">#{{ detailBilling.billing_no }}</div>

      <hr>

      <el-row :gutter="24" class="mb-16">
        <el-col :sm="12">
          <span>Olsera Indonesia Pratama</span>
          <div class="d-flex-column" style="margin-top: 12px">
            <span>Ruko Trikarsa Ekualta Blok N No. 12. Jl. Pasir Putih. </span>
            <span>Batam Center, Batam Island</span> 
            <span>Kepulauan Riau - Indonesia</span>
          </div>
        </el-col>
        <el-col :sm="12">
          <span>Kepada</span>
          <div class="d-flex-column" style="margin-top: 12px">
            <span class="font-bold"> {{ detailBilling.user_name }} ({{ detailBilling.user_email }}) </span>
          </div>
        </el-col>
      </el-row>

      <div class="d-flex-column mb-16">
        <span>{{ rootLang.billing_no }} <span class="font-bold"> #{{ detailBilling.billing_no }} </span></span>
        <span>{{ rootLang.date }} <span class="font-bold">{{ detailBilling.billing_date }}</span></span>
        <span v-if="detailBilling.status === 'P'">Status <span class="font-bold" style="color: #FF931E">{{ detailBilling.fstatus }}</span></span>
        <span v-if="detailBilling.status === 'X'">Status <span class="font-bold" style="color: #F44336">{{ detailBilling.fstatus }}</span></span>
        <span v-if="detailBilling.status === 'Z'">Status <span class="font-bold" style="color: #767676">{{ detailBilling.fstatus }}</span></span>
      </div>

      <el-table
        :data="detailBilling.detail"
        border
        align="center">
        <el-table-column :label="rootLang.descriptions" prop="store_name" min-width="180px" >
          <template slot-scope="scope">
            <div class="d-flex-column">
              <span class="font-bold">Toko : {{ scope.row.store_name }}</span>
              <span>{{ scope.row.billing_package_option_name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="qty" prop="qty" >
          <template slot-scope="scope">
            <div class="text-center">
              {{ scope.row.qty }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="rootLang.price" prop="fprice" >
          <template slot-scope="scope">
            <div class="text-right">
              {{ scope.row.fprice }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="rootLang.total" prop="famount" >
          <template slot-scope="scope">
            <div class="text-right">
              {{ scope.row.famount }}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-if="tableTax && tableTax.length && parseInt(tableTax[0].tax_amount) !== 0"
        :data="tableTax"
        border
        :show-header="false">
        <el-table-column :label="lang.tax" min-width="180px">
          <template>
            <div class="text-left font-bold">
              {{ lang.tax }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="rootLang.total" prop="total_qty" >
          <!-- <template slot-scope="scope">
            <div class="text-center">
              {{ scope.row.total_qty }}
            </div>
          </template> -->
        </el-table-column>
        <el-table-column :label="rootLang.total" prop="fprice" />
        <el-table-column :label="rootLang.total" prop="ftotal_amount" >
          <template slot-scope="scope">
            <div class="text-right">
              {{ scope.row.ftax_amount }}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        :data="tableTotal"
        border
        :show-header="false"
        class="mb-16">
        <el-table-column :label="rootLang.total" min-width="180px">
          <template>
            <div class="text-left font-bold">
              {{ rootLang.total }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="rootLang.total" prop="total_qty" >
          <template slot-scope="scope">
            <div class="text-center">
              {{ scope.row.total_qty }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="rootLang.total" prop="fprice" />
        <el-table-column :label="rootLang.total" prop="ftotal_amount" >
          <template slot-scope="scope">
            <div class="text-right">
              {{ scope.row.ftotal_amount }}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div
        v-if="detailBilling.payment_mode"
        class="border border--grey mb-16 p-16">
        <div class="font-bold" style="text-decoration: underline"> {{ detailBilling.payment_status }} </div>
        <div>{{ detailBilling.payment_mode.name }}</div>
        <div> {{ detailBilling.payment_mode.bt_bank_name }}</div>
        <div>{{ detailBilling.payment_mode.bt_account_name }}</div>
      </div>
    </div>

    <div v-if="detailBilling.payment_date" class="mb-16">
      <span class="font-bold">{{ rootLang.confirm_payment }}</span>
      <div class="d-flex-column" style="margin-top: 16px; background: #E4F8FF; padding: 16px; border-radius: 10px;">
        <span>{{ rootLang.payment_date }} <span class="font-bold">{{ detailBilling.payment_date }}</span> </span>
        <span>{{ rootLang.payment_via }} <span class="font-bold">{{ detailBilling.payment_from_bank }}</span></span>
        <span>{{ rootLang.payment_by }} <span class="font-bold">{{ detailBilling.payment_payee }}</span></span>
        <span>{{ rootLang.payment_ref }} <span class="font-bold">{{ detailBilling.payment_ref }}</span></span>
      </div>
    </div>

    <div v-if="detailBilling.status === 'P'" class="text-center">
      <el-button
        type="primary"
        @click="visibleDialogConfirm = true">
        {{ rootLang.confirm_payment }}
      </el-button>
      <el-button
        type="danger"
        @click="showBtnCancel = true">
        {{ rootLang.canceled }}
      </el-button>
    </div>

    <el-button
      v-if="detailBilling.status === 'Z'"
      class="full-width mt-16"
      style="background: #F5F5F5"
      @click="gotoExtend">
      {{ rootLang.reorder }}
    </el-button>

    <dialog-confirm
      :show="visibleDialogConfirm"
      :data="detailBilling"
      :loading="loadingConfirm"
      @update="handleUpdate"
      @hide="visibleDialogConfirm = false"
    />

    <!-- dialog cancel -->
    <el-dialog
      :visible.sync="showBtnCancel"
      :modal="false"
      custom-class="mw-348">
      <div class="text-center">
        <span>Apakah Anda yakin membatalkan transaksi?</span>
        <div style="margin-top: 24px">
          <el-button
            type="danger"
            class="btn-block mb-8"
            @click="cancelUpgrade">
            {{ rootLang.canceled }}
          </el-button>
          <el-button
            class="btn-block mb-8"
            @click="showBtnCancel = false">
            {{ rootLang.back }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!--       -->
  </el-dialog>
</template>

<script>
import DialogConfirm from './DialogConfirm'
import axios from 'axios'
import {HTTP, BASE_URL} from '../http-common'
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  props: ['show', 'detailBilling', 'tableTotal', 'tableTax'],

  components: {
    DialogConfirm
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      visibleDialogConfirm: false,
      loadingConfirm: false,
      showBtnCancel: false
    }
  },

  methods: {
    beforeClose() {
      this.visibleDialogConfirm = false
      this.$emit('close')
    },

    gotoExtend () {
      this.$router.push('/extendstore')
    },

    handleUpdate (data) {
      this.detailBilling = data
    },

    cancelUpgrade() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'PUT',
        url: BASE_URL + 'api/admin/v1/id/billings/order/cancelled/' + this.detailBilling.id,
        headers: headers
      }).then(response => {
        this.detailBilling = response.data.data
        this.showBtnCancel = false
        this.loading = false
        // this.$emit('cancel-upgrade', response.data.data)
      }).catch((error) => {
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
        this.loading = false
        this.showBtnCancel = false
      })
    },

    getPDF(path) {
      let url = BASE_URL + 'api/admin/v1/id/billings/order/pdf/' + this.detailBilling.id
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        url: url,
        method: 'GET',
        responseType: 'blob',
        headers
      }).then((response) => {
        const fileName = 'Detail_Billing_' + this.detailBilling.billing_no + '.pdf'
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      })
    },
  }
}
</script>
