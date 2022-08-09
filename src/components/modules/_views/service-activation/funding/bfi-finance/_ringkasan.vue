<template>
  <div class="branch">
    <div class="row equal-cols">
      <div class="visible-lg visible-md visible-sm col-sm-6 pr-null">
        <div class="branch-left-side color-bfi--bg" style="min-height: 800px;">
        <img
          class="image-digipayment"
          src="/static/img/checklist-image.svg"> 
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 pl-null">
        <div v-if="ringkasan" style="background-color: #FFFFFF; padding: 20px;">
          <template>
            <div class="font-18 mb-8 font-semi-bold">
              {{rootLang.requirement_document}}
            </div>
            <div class="like-table-wrapper bd-grey-thin mb-24">
              <div class="like-table-wrapper--item py-8">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 300px;" class="lh-2">{{rootLang.photo_id_card_borrower}}</div>
                  <div class="text-right" v-if="ringkasan.fileIdCard !== null">
                    <img :src="ringkasan.fileIdCard.photo_md" style="max-height: 30px;"/>
                  </div>
                </div>
              </div>
              <div class="like-table-wrapper--item py-8">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 300px;" class="lh-2">{{rootLang.family_register}}</div>
                  <div class="text-right" v-if="ringkasan.fileFamilyRegister !== null">
                    <img :src="ringkasan.fileFamilyRegister.photo_md" style="max-height: 30px;"/>
                  </div>
                </div>
              </div>
              <div class="like-table-wrapper--item py-8">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 300px;" class="lh-2">{{rootLang.photo_taxpayer_number}}</div>
                  <div class="text-right" v-if="ringkasan.fileNpwp !== null">
                    <img :src="ringkasan.fileNpwp.photo_md" style="max-height: 30px;"/>
                  </div>
                </div>
              </div>
              <div v-if="type.id === 1">
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.photo_id_card_couple}}</div>
                    <div class="text-right" v-if="ringkasan.fileIdCouple !== null">
                      <img :src="ringkasan.fileIdCouple.photo_md" style="max-height: 30px;"/>
                    </div>
                  </div>
                </div>
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.statement_last_3_month}}</div>
                    <div class="text-right" v-if="ringkasan.fileBank !== null">
                      <div v-for="(bankFile, keyFile) in ringkasan.fileBank" :key="keyFile">
                        <img :src="bankFile.photo_md" style="max-height: 30px;"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.photo_motorcycle_doc}}</div>
                    <div class="text-right" v-if="ringkasan.motorBPKB !== null">
                      <img :src="ringkasan.motorBPKB.photo_md" style="max-height: 30px;"/>
                    </div>
                  </div>
                </div>
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.house_ownership}}</div>
                    <div class="text-right" v-if="ringkasan.houseOwn !== null">
                      <img :src="ringkasan.houseOwn.photo_md" style="max-height: 30px;"/>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="type.id === 2">
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.photo_id_card_couple}}</div>
                    <div class="text-right" v-if="ringkasan.fileIdCouple !== null">
                      <img :src="ringkasan.fileIdCouple.photo_md" style="max-height: 30px;"/>
                    </div>
                  </div>
                </div>
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.statement_last_3_month}}</div>
                    <div class="text-right" v-if="ringkasan.fileBank !== null">
                      <div v-for="(bankFile, keyFile) in ringkasan.fileBank" :key="keyFile">
                        <img :src="bankFile.photo_md" style="max-height: 30px;"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.photo_car_doc}}</div>
                    <div class="text-right" v-if="ringkasan.mobilBPKB !== null">
                      <img :src="ringkasan.mobilBPKB.photo_md" style="max-height: 30px;"/>
                    </div>
                  </div>
                </div>
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.house_ownership}}</div>
                    <div class="text-right" v-if="ringkasan.houseOwn !== null">
                      <img :src="ringkasan.houseOwn.photo_md" style="max-height: 30px;"/>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="type.id === 3">
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.photo_id_card_couple}}</div>
                    <div class="text-right" v-if="ringkasan.fileIdCouple !== null">
                      <img :src="ringkasan.fileIdCouple.photo_md" style="max-height: 30px;"/>
                    </div>
                  </div>
                </div>
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.statement_last_3_month}}</div>
                    <div class="text-right" v-if="ringkasan.fileBank !== null">
                      <div v-for="(bankFile, keyFile) in ringkasan.fileBank" :key="keyFile">
                        <img :src="bankFile.photo_md" style="max-height: 30px;"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.photo_house_doc}}</div>
                    <div class="text-right" v-if="ringkasan.houseDoc !== null">
                      <img :src="ringkasan.houseDoc.photo_md" style="max-height: 30px;"/>
                    </div>
                  </div>
                </div>
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.house_ownership}}</div>
                    <div class="text-right" v-if="ringkasan.houseOwn !== null">
                      <img :src="ringkasan.houseOwn.photo_md" style="max-height: 30px;"/>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="type.id === 4">
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.statement_last_3_month}}</div>
                    <div class="text-right" v-if="ringkasan.fileBank !== null">
                      <div v-for="(bankFile, keyFile) in ringkasan.fileBank" :key="keyFile">
                        <img :src="bankFile.photo_md" style="max-height: 30px;"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.photo_saving_cover_book}}</div>
                    <div class="text-right" v-if="ringkasan.savingBook !== null">
                      <img :src="ringkasan.savingBook.photo_md" style="max-height: 30px;"/>
                    </div>
                  </div>
                </div>
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.photo_house_selfie}}</div>
                    <div class="text-right" v-if="ringkasan.houseSelfie !== null">
                      <img :src="ringkasan.houseSelfie.photo_md" style="max-height: 30px;"/>
                    </div>
                  </div>
                </div>
                <div class="like-table-wrapper--item py-8">
                  <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                    <div style="width: 300px;" class="lh-2">{{rootLang.olsera_profile_ss}}</div>
                    <div class="text-right" v-if="ringkasan.olseraProfile !== null">
                      <img :src="ringkasan.olseraProfile.photo_md" style="max-height: 30px;"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="font-18 mb-8 font-semi-bold">
              {{rootLang.jumlah_pinjaman}}
            </div>
            <div class="like-table-wrapper bd-grey-thin mb-24">
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{ rootLang.jumlah_pinjaman }}</div>
                  <div class="text-right">{{ formatPrice(ringkasan.amount) }}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{ rootLang.plafond }}</div>
                  <div class="text-right">{{ ringkasan.plafond }} {{rootLang.months}}</div>
                </div>
              </div>
              <div class="like-table-wrapper--item">
                <div class="flex-container flex-container--start flex-container--content-space-between w-fit">
                  <div style="width: 120px;">{{ rootLang.loan_purpose }}</div>
                  <div class="text-right">{{ $lang[langId].addition_capital }}</div>
                </div>
              </div>
            </div>
            <el-button
              type="success"
              class="visible-lg visible-md visible-sm absolute-bottom btn-block color-bfi--bg color-bfi--border color-white"
              style="width: 88%"
              @click="confirmSubmit"
              >
                {{ rootLang.ok_apply_now }}
            </el-button>

             <el-button
              type="success"
              class="visible-xs absolute-bottom btn-block color-bfi--bg color-bfi--border color-white"
              style="width: 88%"
              @click="confirmSubmit"
              >
                {{ rootLang.ok_apply_now }}
            </el-button>
          </template>
        </div>
        
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
      },
    },    
    type: {
      type: Object,
      default: null
    },
    stillSubmit: {
      type: Boolean,
      default: false
    }
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
