<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div class="title-jurnal">
        <h4>
          <strong>{{$lang[langId].upload_purchase}}</strong>
          <div style="float: right; margin-top: -9px;">
            <el-button @click="handleCommandJurnal('mapSupplier')" :type="finishMapingPurchase ? 'info' : 'primary'" size="small">
              {{$lang[langId].set_jurnal_purchase}}
            </el-button>
            <el-button @click="handleCommandJurnal('productName')" :type="finishProductName ? 'info' : 'primary'" size="small">
              {{$lang[langId].set_account_name_product_tax_payment}}
            </el-button>
          </div>
        </h4>
      </div>

      <purchase-to-invoice 
        ref="purchaseList"
        @invoicePostStatus="invoiceStatus"/>
    </el-card>

    <dialog-account-product-tax
      :show="dialogAccountProduct"
      @close="closeAccountNameProduct"
    />

    <dialog-map-supplier-product
      :show="dialogMapSupplier"
      :dataProduct="dataPostProduct"
      :dataSupplier="dataPostSupplier"
      :fecthStatus="fetchStatus"
      @close="closeMapSupplier"
    />
  </div>
</template>

<script>
import PurchaseToInvoice from './purchaseToInvoice.vue';
import DialogMapSupplierProduct from '../DialogMapSupplierProduct.vue';
import DialogAccountProductTax from '../DialogAccountProductTax';

export default {
  name: 'PurchaseToAccurate',
  components: {
    PurchaseToInvoice,
    DialogMapSupplierProduct,
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
      finishMapingPurchase: false,
      dialogMapSupplier: false,
      dialogAccountProduct: false,
      dataPostSupplier: [],
      dataPostProduct: [],
      fetchStatus: {}
    }
  },

  methods:{
    invoiceStatus(params){
      const supplier = params.productAndSupplier.supplier
      const product = params.productAndSupplier.product
      this.finishProductName = params.finishMapingStatus === 1 ? true : false
      this.finishMapingPurchase = params.finishMapingPurchase === 1 ? true : false

      this.dataPostSupplier = supplier.map(v => ({...v, isActive: false}))
      this.dataPostProduct = product.map(v => ({...v, isActive: false}))
      this.fetchStatus = {
        fetchProduct: params.isFecthProduct,
        fetchSupplier: params.isFecthSupplier
      }
    },

    closeMapSupplier(){
      if(this.dataPostSupplier.length === 0 && this.dataPostProduct.length === 0){
        this.$refs.purchaseList.changePostStatus()
      }
      this.dialogMapSupplier = false
    },

    closeAccountNameProduct(){
      this.dialogAccountProduct = false
    },

    handleCommandJurnal(command){
      if(command === 'productName'){
        this.dialogAccountProduct = true
      }else if(command === 'mapSupplier'){
        this.dialogMapSupplier = true
      }else{
        console.log('menu', command);
      }
    },

  }


}
</script>