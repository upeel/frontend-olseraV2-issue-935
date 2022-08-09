<template>
  <div class="summary">
    <div class="row p-20">
      <div class="col-xs-12 col-sm-6">
        <div v-if="ringkasan && ringkasan.owner" class="flex-grow-1">
          <template>
            <div class="font-18 mb-8 font-semi-bold">
              {{rootLang.borrower_data}}
            </div>
            <div class="like-table-wrapper bd-grey-thin mb-24">
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.name_based_idcard}}</div>
                  <div class="text-right">{{ ringkasan.owner.name }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.id_card_number}}</div>
                  <div class="text-right">{{ ringkasan.owner.id_card_number }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.gender}}</div>
                  <div class="text-right">{{ ringkasan.owner.gender === 'M' ? 'Laki-Laki' : 'Perempuan'}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">Email</div>
                  <div class="text-right">{{ ringkasan.owner.email }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.phone_number}}</div>
                  <div class="text-right">{{ ringkasan.owner.phone_number }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{lang.address}}</div>
                  <div class="text-right">{{ ringkasan.owner.address }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div v-if="ringkasan && ringkasan.amount" class="flex-grow-1">
          <!-- jumlah pinjaman -->
          <template>
            <div class="font-18 mb-8 font-semi-bold">
              {{ rootLang.jumlah_pinjaman }}
            </div>
            <div class="like-table-wrapper bd-grey-thin mb-24">
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{ rootLang.jumlah_pinjaman }}</div>
                  <div class="text-right">{{ formatPrice(ringkasan.amount.amount) }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{ rootLang.plafond }}</div>
                  <div class="text-right">{{ ringkasan.amount.plafond }} {{rootLang.months}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{ rootLang.loan_purpose }}</div>
                  <div class="text-right">{{ rootLang.addition_capital }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div v-if="ringkasan && ringkasan.bank" class="flex-grow-1">
          <template>
            <div class="font-18 mb-8 font-semi-bold">
              {{rootLang.bank_account}}
            </div>
            <div class="like-table-wrapper bd-grey-thin mb-24">
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.bank_name}}</div>
                  <div class="text-right">{{ ringkasan.bank.bank_name }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.branch}}</div>
                  <div class="text-right">{{ ringkasan.bank.branch }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.bank_account_owner}}</div>
                  <div class="text-right">{{ ringkasan.bank.bank_owner_name }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.account_number_bank}}</div>
                  <div class="text-right">{{ ringkasan.bank.bank_account_number  }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6">
        <div v-if="ringkasan && ringkasan.data_usaha">
          <template>
            <div class="font-18 mb-8 font-semi-bold">
              {{rootLang.data_business}}
            </div>
            <div class="like-table-wrapper bd-grey-thin mb-24">
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.business_name}}</div>
                  <div class="text-right">{{ ringkasan.data_usaha.name }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.business_email}}</div>
                  <div class="text-right">{{ ringkasan.data_usaha.email }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.business_phone_number}}</div>
                  <div class="text-right">{{ ringkasan.data_usaha.phone_number }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.business_age}}</div>
                  <div class="text-right">{{ ringkasan.data_usaha.business_age }} {{rootLang.months}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.bussiness_address}}</div>
                  <div class="text-right">{{ ringkasan.data_usaha.address }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.ig_business_link}}</div>
                  <div class="text-right">{{ ringkasan.data_usaha.instagram_link }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{rootLang.web_business_link}}</div>
                  <div class="text-right">{{ ringkasan.data_usaha.website_link }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">Merchant ID</div>
                  <div class="text-right">{{ ringkasan.data_usaha.merchant_id }}</div>
                </div>
              </div>
            </div>

          </template>
        </div>
        <div v-if="ringkasan">
          <template>
            <div class="font-18 mb-8 font-semi-bold">
              {{rootLang.requirement_document}}
            </div>
            <div class="like-table-wrapper bd-grey-thin mb-24">
              <div class="like-table-wrapper--item py-8">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 300px;" class="lh-2">{{rootLang.photo_id_card}}</div>
                  <div class="text-right" v-if="ringkasan.owner.fileIdCard">
                    <img :src="ringkasan.owner.fileIdCard.photo_md" style="max-height: 30px;"/>
                  </div>
                </div>
              </div>
              <div class="like-table-wrapper--item py-8">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 300px;" class="lh-2">{{rootLang.photo_id_card_couple}}</div>
                  <div class="text-right" v-if="ringkasan.owner.fileIdCouple">
                    <img :src="ringkasan.owner.fileIdCouple.photo_md" style="max-height: 30px;"/>
                  </div>
                </div>
              </div>
              <div class="like-table-wrapper--item py-8">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 300px;" class="lh-2">{{rootLang.photo_family_register}}</div>
                  <div class="text-right" v-if="ringkasan.owner.fileFamilyRegister" >
                    <img :src="ringkasan.owner.fileFamilyRegister.photo_md" style="max-height: 30px;"/>
                  </div>
                </div>
              </div>
              <div class="like-table-wrapper--item py-8">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 300px;" class="lh-2">{{rootLang.photo_taxpayer_number}}</div>
                  <div class="text-right" v-if="ringkasan.owner.fileNpwp">
                    <img :src="ringkasan.owner.fileNpwp.photo_md" style="max-height: 30px;"/>
                  </div>
                </div>
              </div>
              <div class="like-table-wrapper--item py-8">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 300px;" class="lh-2">{{rootLang.statement_last_3_month}}</div>
                  <div class="text-right" v-if="ringkasan.data_usaha.fileBank">
                    <div v-for="(bankFile, keyFile) in ringkasan.data_usaha.fileBank" :key="keyFile">
                      <img :src="bankFile.photo_md" style="max-height: 30px;"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12">
        <el-button
          type="success"
          class="btn-block w-fit color-koinworks--bg color-koinworks--border color-white"
          @click="confirmSubmit"
          :disabled="stillSubmit"
          >
          <loading
            v-if="stillSubmit"
            :active="true"
            color= '#1bb4e6'
            loader="dots"
            :width="28"
            :height="10"
            backgroundColor='#ffffff'>
          </loading>
          <span v-else>
            {{ rootLang.ok_apply_now }}
          </span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import basicComputedMixin from '@/mixins/basicComputedMixin'
import mixinAccounting from '@/mixins/mixinAccounting'
export default {
  components: {Loading},
  mixins: [basicComputedMixin, mixinAccounting],

  props: {
    ringkasan: {
      type: Object,
      default: () => {
        return {}
      }
    },

    stillSubmit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {

    }
  },

  mounted(){
  },

  methods: {
    confirmSubmit(){
      this.$emit('next', 4)
    },
  }
}
</script>
