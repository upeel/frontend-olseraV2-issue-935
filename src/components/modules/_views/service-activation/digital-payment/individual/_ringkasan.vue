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
          </div>
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="summary-right-side">
            <div class="font-18 pb-16">{{rootLang.summary_submission}}</div>
            <div class="like-table-wrapper mb-24">
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div class="font-18 font-semi-bold">{{capitalEachWord(form.owner.name)}}</div>
                  <div class="text-right" style="width: 20px;">
                    <svg-icon v-if="form.owner.name && form.owner.phone_number &&
                      form.owner.email && form.owner.id_card_number &&
                      form.owner.address && Object.keys(form.owner.fileIdCard).length !== 0
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
                  <div class="text-right" style="max-width: 300px;">{{form.owner.email}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.phone_number}}</div>
                  <div class="text-right" style="max-width: 300px;">{{form.owner.phone_number}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.id_card_number}}</div>
                  <div class="text-right" style="max-width: 300px;">{{form.owner.id_card_number}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.taxpayer_number}}</div>
                  <div class="text-right" style="max-width: 300px;">{{form.owner.npwp}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{lang.address}}</div>
                  <div class="text-right word-break" style="max-width: 300px;">{{form.owner.address}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.npwp_address}}</div>
                  <div class="text-right word-break" style="max-width: 300px;">{{form.owner.npwp_address}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{lang.subdistrict}}</div>
                  <div class="text-right" style="max-width: 300px;">{{capitalize(form.owner.sub_district)}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.urban_village}}</div>
                  <div class="text-right" style="max-width: 300px;">{{capitalize(form.owner.village)}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.neighbourhood}}/{{rootLang.hamlet}}</div>
                  <div class="text-right" style="max-width: 300px;">{{form.owner.rt +'/'+ form.owner.rw}}</div>
                </div>
              </div>
            </div>

            <div class="like-table-wrapper mb-24" v-for="(branch, key) in form.branchs" :key="key">
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div class="font-18 font-semi-bold">{{capitalEachWord(branch.name)}}</div>
                  <div class="text-right" style="width: 20px;">
                    <svg-icon v-if="branch.status_location_business && branch.business_type && branch.address && branch.logo_ewallet" icon-class="status_icon"></svg-icon>
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
                  <div class="text-right" style="max-width: 300px;">{{branch.business_type_name}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 200px;">{{rootLang.url_id}}</div>
                  <div class="text-right" style="max-width: 300px;">{{branch.url_id}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 200px;">{{rootLang.store_location}}</div>
                  <div class="text-right word-break" style="max-width: 300px;">{{branch.address}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 200px;" class="lh-2">{{rootLang.company_logo}}</div>
                  <div class="text-right" v-if="branch.logo_ewallet">
                    <img :src="branch.logo_ewallet.photo_md" style="max-height: 30px;"/>
                  </div>
                </div>
              </div>

              <div class="like-table-wrapper--item">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 120px;">{{rootLang.bank_name}}</div>
                    <div class="text-right">{{ form.bank[key].bank_name }}</div>
                  </div>
                </div>
                <div class="like-table-wrapper--item">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 120px;">{{rootLang.branch}}</div>
                    <div class="text-right">{{ form.bank[key].branch }}</div>
                  </div>
                </div>
                <div class="like-table-wrapper--item">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 120px;">{{rootLang.bank_account_owner}}</div>
                    <div class="text-right">{{ form.bank[key].bank_owner_name }}</div>
                  </div>
                </div>
                <div class="like-table-wrapper--item">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 120px;">{{rootLang.account_number_bank}}</div>
                    <div class="text-right">{{ form.bank[key].bank_account_number  }}</div>
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

export default {
  name: 'individualSummary',
  mixins: [basicComputedMixin],

  props: {
    form: {
      type: Object,
      default: null
    }
  },

  computed: {
    listPayment() {
      return listPayment;
    },

  },

  data(){
    return{

    }
  },

  methods: {
    handleApplySubmission() {
      this.$emit('next');
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