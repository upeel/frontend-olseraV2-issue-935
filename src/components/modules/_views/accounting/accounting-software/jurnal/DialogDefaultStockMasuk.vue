<template>
  <div>
    <el-dialog
      :visible.sync="show"
      :show-close="false"
      @close="handleClose"
      width="70%"
      center 
      custom-class="dialog-card-jurnal">
        <div slot="title" class="flex-container">
          <el-row :gutter="20"  style="width: 100%">
            <el-col :span="14">
              <h4 class="dialog-title" align="left"><strong>{{$lang[langId].set_stock_incoming}}</strong></h4>
            </el-col>
            <el-col :span="10" align="right">
              <div class="btn_save_dialog">
                <el-button type="info" @click="handleClose">{{ lang.close }}</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <cash-bank-vendor />
    </el-dialog>
  </div>
</template>

<script>
import CashBankVendor from 'components/modules/_views/accounting/accounting-software/jurnal/mapping/stockInCashBank.vue';

export default {
  props: ['show'],
  name: "DialogJurnalStockIn",
  components: {
		CashBankVendor,
  },
  
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  data() {
    return {

		}
  },

  methods:{
    handleClose(){
      // this.show = false;
      this.$emit('close')
    }
  }
}
</script>
