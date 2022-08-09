<template>
  <div>
    <!-- <section class="content sales-list"> -->
      <el-card class="box-card" shadow="never">
        <div class="title-jurnal">
          <h4>
            <strong>{{$lang[langId].upload_sales}}</strong>
            <div style="float: right; margin-top: -9px;">
              <el-button @click="handleCommandJurnal('mapCustomer')" :type="finishMapingSales ? 'info' : 'primary'" size="small">
                {{$lang[langId].set_jurnal_sales}}
              </el-button>
              <el-button @click="handleCommandJurnal('productName')" :type="finishProductName ? 'info' : 'primary'" size="small">
                {{$lang[langId].set_account_name_product_tax_payment}}
              </el-button>
            </div>
          </h4>
        </div>
          
        <sales-to-invoice 
          ref="salesList"
          @invoicePostStatus="invoiceStatus"/>
      </el-card>

      <dialog-account-product-tax
        :show="dialogAccountProduct"
        @close="closeAccountNameProduct"
      />

      <dialog-map-customer-product
        :show="dialogMapCustomer"
        :dataProduct="dataPostProduct"
        :dataCustomer="dataPostCustomer"
        :fecthStatus="fetchStatus"
        @close="closeMapCustomer"
      />
    <!-- </section> -->
  </div>
</template>

<script>
import SalesToInvoice from './salesToInvoice.vue';
import DialogMapCustomerProduct from '../DialogMapCustomerProduct.vue';
import DialogAccountProductTax from '../DialogAccountProductTax';

export default {
  name: 'SalesToAccurate',
  components: {
    SalesToInvoice,
    DialogMapCustomerProduct,
    DialogAccountProductTax
  },
  computed: {
    lang() {
      return this.$store.state.userStores.lang
    },
    token() {
      return this.$store.state.user.token
    },
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    langId() {
      return this.$store.state.userStores.langId
    },
  },
  data(){
    return{
      dialogAccountName: false,
      finishProductName: true,
      finishMapingSales: true,
      dialogMapCustomer: false,
      dialogAccountProduct: false,
      dataPostCustomer: [],
      dataPostProduct: [],
      fetchStatus: {}
    }
  },


  methods:{
    invoiceStatus(params){
      const customer = params.productAndSupplier.customer
      const product = params.productAndSupplier.product
      this.finishProductName = params.finishMapingStatus === 1 ? true : false
      this.finishMapingSales = params.finishMapingSales === 1 ? true : false

      this.dataPostCustomer = customer.map(v => ({...v, isActive: false}))
      this.dataPostProduct = product.map(v => ({...v, isActive: false}))
      this.fetchStatus = {
        fetchProduct: params.isFecthProduct,
        fetchCustomer: params.isFecthCustomer
      }
    },

    closeMapCustomer(){
      if(this.dataPostCustomer.length === 0 && this.dataPostProduct.length === 0){
        this.$refs.salesList.changePostStatus()
      }
      this.dialogMapCustomer = false
    },

    closeAccountNameProduct(){
      this.dialogAccountProduct = false
    },

    handleCommandJurnal(command){
      if(command === 'productName'){
        this.dialogAccountProduct = true
      }else if(command === 'mapCustomer'){
        this.dialogMapCustomer = true
      }else{
        console.log('menu', command);
      }
    },

  }


}
</script>