<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div class="title-jurnal">
        <h4>
          <strong>{{$lang[langId].upload + ' ' + $lang[langId].salesreturn2}}</strong>
          <div style="float: right; margin-top: -9px;">
            
          </div>
        </h4>
      </div>
      <return-to-invoice />

    </el-card>
  </div>
</template>

<script>
import ReturnToInvoice from './returnToInvoice.vue';

export default {
  name: 'ReturnToAccurate',
  components: {
    ReturnToInvoice
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

    }
  },

  methods:{

  }
}
</script>