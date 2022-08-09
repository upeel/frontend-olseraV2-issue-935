<template>
  <el-drawer
    :visible.sync="show"
    :before-close="beforeClose"
    append-to-body
    title="Konfirmasi Pembayaran"
    width="480px"
    class="drawer">
    <div class="p-16">
      <el-form
        label-position="top">
        <el-form-item label="Transfer pembayaran melalui Bank">
          <el-input v-model="tempConfirm.payment_from_bank" />
        </el-form-item>
        <el-form-item label="Nama Pemilik Rekening">
          <el-input v-model="tempConfirm.payment_payee"></el-input>
        </el-form-item>
        <el-form-item label="Tanggal pembayaran">
          <el-date-picker
            v-model="tempConfirm.payment_date"
            value-format="yyyy-MM-dd"
            type="date"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="No. Resi Pembayaran">
          <el-input v-model="tempConfirm.payment_ref"></el-input>
        </el-form-item>
        <el-form-item label="Jumlah yang dibayar">
          <el-input v-model="tempConfirm.payment_amount" disabled>
            <template slot="prepend">
              {{ tempConfirm.currency_id }}
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button
        :disabled="computedDisableConfirm"
        :loading="loadingConfirm"
        type="primary"
        class="btn-block"
        @click="setPaymentConfirm">
        Konfirmasi
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
import CloseEsc from '@/components/modules/CloseEsc'
import { HTTP } from '@/http-common'
const moment = require('moment')

const defaultFORMDATA = {
  currency_id: '',
  billing_id: '',
  payment_amount: '',
  payment_ref: '',
  payment_payee: '',
  payment_date: moment().format('YYYY-MM-DD'),
  payment_from_bank: ''
}

export default {
  components: {
    CloseEsc
  },
  props: ['data', 'show', 'loading'],

  data() {
    return {
      tempConfirm: { ...defaultFORMDATA },
      loadingConfirm: false
    }
  },

  computed: {
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    rootLang() {
      return this.$lang[this.langId]
    },
    loggedInUser() {
      return this.$store.state.loggedInUser
    },
    computedDisableConfirm() {
      if (
        !this.tempConfirm.billing_id ||
        !this.tempConfirm.payment_amount ||
        !this.tempConfirm.payment_ref ||
        !this.tempConfirm.payment_payee ||
        !this.tempConfirm.payment_date ||
        !this.tempConfirm.payment_from_bank
      ) {
        return true
      } else {
        return false
      }
    }
  },

  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(data) {
        // console.log(data)
        this.tempConfirm = {
          currency_id: data.currency_id,
          billing_id: data.id,
          payment_amount: data.total_amount,
          payment_ref: '',
          payment_payee: '',
          payment_date: moment().format('YYYY-MM-DD'),
          payment_from_bank: ''
        }
      }
    }
  },

  methods: {
    setPaymentConfirm() {
      this.loadingConfirm = true
      let paramsRequest = {
        headers: {
          'Authorization': 'Bearer ' + this.token.access_token
        }
      }
      const data = { ...this.tempConfirm }
      HTTP.post('api/admin/v1/id/billings/order/paymentconfirmation', data, paramsRequest).then(response => {
        this.$message({
          type: 'success',
          message: 'Success'
        })
        this.$emit('update', response.data.data)
        this.loadingConfirm = false
        this.beforeClose()
      }).catch(() => {
        // this.btnCreate = false
        this.$message({
          type: 'warning',
          message: error.message
        })
        this.loadingConfirm = false
      })
    },

    beforeClose() {
      this.$emit('hide', false)
    }
  }
}
</script>
