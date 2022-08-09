<template>
  <div class="summary">
    <el-form
      :model="form"
      label-position="top"
      ref="data"
      @submit.native.prevent="handleNext">
      <div class="row equal-cols">
        <div class="col-xs-12 col-sm-6">
          <div class="summary-left-side">
            <div class="font-18 pb-16">{{rootLang.mdr_fee}}</div>
            <el-table
              :data="listPayment"
              stripe
              :show-header="false"
              class="border border--grey box-shadow-1">
              <el-table-column prop="id" width="30" class-name="text-center">
                <template slot-scope="scope">
                  <el-checkbox v-if="checkSelection(scope.row)" @change="handleSelectPayment(scope.row.id)">
                  </el-checkbox>
                  <svg-icon v-else icon-class="check-square"></svg-icon>
                </template>
              </el-table-column>
              <el-table-column
                prop="logo"
                width="50"
                align="center">
                <template slot-scope="scope">
                  <img :src="'/static/img/' + scope.row.logo"/>
                </template>
              </el-table-column>
              <el-table-column
                prop="name">
              </el-table-column>
              <el-table-column
                prop="fee">
              </el-table-column>
            </el-table>
            <el-tag class="my-24" size="large"
              type="success" style="color: #606266; width: 100%; word-break: break-word;">
              <el-row :gutter="10">
                <el-col :md="2" style="padding: 4% 0 0 1%;">
                  <svg-icon icon-class="information-circle" color="#6EBE46" style="font-size: x-large"></svg-icon>
                </el-col>
                <el-col :md="22" align="left">
                  <p class="lh-2 pt-8" v-html="rootLang.summary_submission_info"></p>
                </el-col>
              </el-row>
            </el-tag>

            <template>
              <div class="like-table-wrapper bd-grey-thin mb-24">
                <div class="like-table-wrapper--item">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div class="font-18 font-semi-bold">{{rootLang.bank_account}}</div>
                    <div class="text-right" style="width: 20px;">
                      <svg-icon v-if="form.bank.bank_id && form.bank.branch &&
                        form.bank.bank_owner_name && form.bank.bank_account_number
                      " icon-class="status_icon"></svg-icon>
                      <span v-else
                        class="tag-info-circle"  style="
                        font-size: 4px;
                        padding: 9px 5px;
                        margin-left: unset;
                        top: auto;
                        position: inherit;">
                        <svg-icon icon-class="info"></svg-icon>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="like-table-wrapper--item">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 120px;">{{rootLang.bank_name}}</div>
                    <div class="text-right">{{ form.bank.bank_name }}</div>
                  </div>
                </div>
                <div class="like-table-wrapper--item">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 120px;">{{rootLang.branch}}</div>
                    <div class="text-right">{{ form.bank.branch }}</div>
                  </div>
                </div>
                <div class="like-table-wrapper--item">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 120px;">{{rootLang.bank_account_owner}}</div>
                    <div class="text-right">{{ form.bank.bank_owner_name }}</div>
                  </div>
                </div>
                <div class="like-table-wrapper--item">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 120px;">{{rootLang.account_number_bank}}</div>
                    <div class="text-right">{{ form.bank.bank_account_number  }}</div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="summary-right-side">
            <div class="font-18 pb-16">{{rootLang.summary_submission}}</div>
            <div class="like-table-wrapper mb-24">
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div class="font-18 font-semi-bold">{{capitalEachWord(form.applicant.name)}}</div>
                  <div class="text-right" style="width: 20px;">
                    <svg-icon v-if="form.applicant.name && form.applicant.phone &&
                      form.applicant.email && form.applicant.no_ktp &&
                      form.applicant.address && form.applicant.thumbnail_ktp !== null
                    " icon-class="status_icon"></svg-icon>
                    <span v-else
                      class="tag-info-circle"  style="
                      font-size: 4px;
                      padding: 9px 5px;
                      margin-left: unset;
                      top: auto;
                      position: inherit;">
                      <svg-icon icon-class="info"></svg-icon>
                    </span>
                  </div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">Email</div>
                  <div class="text-right" style="max-width: 300px;">{{form.applicant.email}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.phone_number}}</div>
                  <div class="text-right" style="max-width: 300px;">{{form.applicant.phone}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.id_card_number}}</div>
                  <div class="text-right" style="max-width: 300px;">{{form.applicant.no_ktp}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.taxpayer_number}}</div>
                  <div class="text-right" style="max-width: 300px;">{{form.applicant.no_npwp}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{lang.address}}</div>
                  <div class="text-right word-break" style="max-width: 300px;">{{form.applicant.address}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.npwp_address}}</div>
                  <div class="text-right word-break" style="max-width: 300px;">{{form.applicant.npwp_address}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{lang.subdistrict}}</div>
                  <div class="text-right" style="max-width: 300px;">{{capitalize(form.applicant.sub_district)}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.urban_village}}</div>
                  <div class="text-right" style="max-width: 300px;">{{capitalize(form.applicant.village)}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.neighbourhood}}/{{rootLang.hamlet}}</div>
                  <div class="text-right" style="max-width: 300px;">{{form.applicant.rt +'/'+ form.applicant.rw}}</div>
                </div>
              </div>
            </div>

            <div class="like-table-wrapper mb-24">
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div class="font-18 font-semi-bold">{{capitalEachWord(form.dataUsaha.name)}}</div>
                  <div class="text-right" style="width: 20px;">
                    <svg-icon v-if="form.dataUsaha.status_location_business && form.dataUsaha.business_type && form.dataUsaha.address && form.dataUsaha.logo_ewallet" icon-class="status_icon"></svg-icon>
                    <span v-else
                      class="tag-info-circle"  style="
                      font-size: 4px;
                      padding: 9px 5px;
                      margin-left: unset;
                      top: auto;
                      position: inherit;">
                      <svg-icon icon-class="info"></svg-icon>
                    </span>
                  </div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 200px;">{{rootLang.business_form}}</div>
                  <div class="text-right" style="max-width: 300px;">{{rootLang.individual}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 200px;">{{rootLang.business_type}}</div>
                  <div class="text-right" style="max-width: 300px;">{{form.dataUsaha.business_type_name}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 200px;">{{rootLang.url_id}}</div>
                  <div class="text-right" style="max-width: 300px;">{{form.dataUsaha.url_id}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 200px;">{{rootLang.store_location}}</div>
                  <div class="text-right word-break" style="max-width: 300px;">{{form.dataUsaha.address}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 200px;" class="lh-2">{{rootLang.company_logo}}</div>
                  <div class="text-right" v-if="form.dataUsaha.logo_ewallet">
                    <img :src="form.dataUsaha.logo_ewallet" style="max-height: 30px;"/>
                  </div>
                </div>
              </div>
            </div>

            <el-button @click="handleApplySubmission" type="primary" style="width: 100%">
              {{rootLang.ok_apply_now}}
            </el-button>
          </div>

        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { listPayment } from '../dataPayment.js'
import basicComputedMixin from '@/mixins/basicComputedMixin';
import { baseApi } from 'src/http-common.js';
import axios from 'axios';

export default {
  name: 'individualSummary',
  mixins: [basicComputedMixin],

  props: {
    form: {
      type: Object,
      default: null
    },
    dataForm: {
      type: Object,
      default: null
    }
  },

  computed: {
    listPayment() {
      return listPayment;
    }
  },

  mounted(){
    this.getRingkasan()
  },

  data(){
    return{
      selectedPayment: [],
      payments: [],
    }
  },

  methods: {
    getRingkasan(){
       let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      let urlSite = 'activation/service/digital-payment?store_id='+this.dataForm.store_id+'&submit_as=1&submission=4'

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, urlSite ),
        headers: headers
      }).then(response => {
        this.payments = response.data.data[0].thirdPartyServiceItem.map(a => a.id)
      }).catch(error => {
        this.loadingSubmission = false
        if(typeof error.response.data.error.error === 'object'){
          let errorKey = Object.keys(error.response.data.error.error)[0];
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error[errorKey][0]
          })
        } else {
          this.$notify({
            tipe: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    handleSelectPayment(val) {
      if (this.selectedPayment.includes(val) === true) {
        const index = this.selectedPayment.indexOf(val);
        if (index > -1) {
          this.selectedPayment.splice(index, 1);
        }
      }else{
        this.selectedPayment.push(val)
      }
    },

    checkSelection(row){
      let disable = true;
      if(this.payments.includes(row.id) === true){
        disable = false;
      }
      return disable;
    },

    handleApplySubmission() {
      this.$emit('next', {listPayment: this.selectedPayment});
    },

    capitalize(value){
      let capitalize= '';
      if(value){
        capitalize = value[0].toUpperCase() + value.slice(1);
      }
      return capitalize;
    },

    capitalEachWord(value){
      let result = ""

      if(value && typeof value !== 'object'){
        var kata2 = ""
        kata2 = value.split(" ")
        for (let i = 0; i < kata2.length; i++) {
          kata2[i] = kata2[i][0].toUpperCase() + kata2[i].substr(1);
        }
        result = kata2.join(" ")
      }

      return result;
    },
  }
}
</script>