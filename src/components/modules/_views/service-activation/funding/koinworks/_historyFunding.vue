<template>
  <div>
     <el-dialog
      :visible.sync="showHistory"
      :show-close="false"
      fullscreen
      width="80%"
      custom-class="dialog-card">
      <div slot="title" class="flex-container" style="text-align: center">
        <el-row :gutter="20"  style="width: 100%">
          <el-col :xs="3" :sm="2" :md="1" :lg="1" :xl="1" align="left">
            <label class="font-24 pointer" @click="closeDetail">
              <svg-icon icon-class="arrow-left"></svg-icon>
            </label>
          </el-col>
          <el-col :xs="21" :sm="22" :md="23" :lg="23" :xl="23" align="center">
            <h4 class="dialog-title font-24">Koinworks</h4>
          </el-col>
        </el-row>
      </div>

      <div class="col-lg-12" style="padding: 0">
        <div class="col-lg-8" style="float: none; margin: auto">
          <div class="like-table-wrapper mb-16" style="box-shadow: 0px 2px 2px 2px #0503031f;">
            <div class="like-table-wrapper--item pointer">
              <el-avatar
                :src="this.$route.query.data.photo"
                class="mr-4"
              />
              <div
                class="font-14 font-semi-bold"
                style="flex-grow: 1;">
                {{ this.$route.query.data.alias_name }}
              </div>

              <el-button class="color-koinworks--bg color-white" @click="submitAgain" :loading="loadingCheck">{{rootLang.submit_again}} <i class="el-icon-arrow-right"></i></el-button>
            </div>
          </div>

          <funding-list @koinworkId="IdKoinwork"/>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import fundingList from './_listFunding';
import basicComputedMixin from '@/mixins/basicComputedMixin';
import { storeSubmision } from '@/api/thirdParty/koinworks';
export default {
  name: 'dialogKoinworksFunding',
  mixins: [basicComputedMixin],
  components: {
    fundingList
  },
  computed: {
  },
  mounted(){
  },
  data(){
    return{
      showHistory: true,
      koinwork_id: '',
      loadingCheck: false
    }
  },
  methods: {
    handleSelectMonth(){
      
    },
    IdKoinwork(val){
      this.koinwork_id = val
    },
    submitAgain(){
      this.loadingCheck = true
      storeSubmision().then(async response => {
        this.loadingCheck = false
        let lastSubmission = response.data.data
        if(lastSubmission.submission_req[0].submission_status === 'Approved' || lastSubmission.submission_req[0].submission_status === 'Rejected'){
          this.$router.push({
            path: '/service-activation-v2/koinworks',
            query: {koinwork_id: lastSubmission.id}
          })
        }else{
          this.$message({
            type: 'error',
            message: this.rootLang.loan_on_progress
          })
        }
      }).catch(error => {
        this.loadingCheck = false
        this.$message({
          type: 'error',
          message: error.string
        })
      })
    },
    closeDetail(){
      this.$router.push({
        path: '/service-activation-v2',
      })
      this.$router.go()
    }
  }
}
</script>