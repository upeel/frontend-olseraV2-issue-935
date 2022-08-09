<template>
  <div>
    <el-dialog
      class="dialog-append-to-body"
      :visible.sync="show"
      width="60%"
      >
      <el-row :gutter="20" class="mx-null">
        <el-col class="visible-lg visible-md visible-sm" :lg="12" :md="12" :sm="12" :xs="24" style="min-height: 600px; background-color: #6FCFEE;">
          <div class="grid-content">
            <div style="position: absolute;
              top: 50%;
              left: 25%;
              transform: translate(-50%, -50%);">
              <img src="/static/img/accounting-third/jurnal-check.png"
              style="max-height: 250px;"
              >
            </div>
          </div>
        </el-col>
        <el-col :lg="12" :md="12" :sm="12" :xs="24" class="py-16">
          <div class="grid-content">
            <div v-html="$lang[langId].jurnal_flow_desc">

            </div>
            <el-button class="absolute-bottom" type="primary" @click="handleOke" style="width: 47%;">
              Oke
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';

export default {
  props: ['show'],
  name: "DialogInfoJurnal",

  components: {
    Loading
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
  
  
  methods:{
    handleOke(){
      this.$emit('okClick')
    }
  }
}
</script>