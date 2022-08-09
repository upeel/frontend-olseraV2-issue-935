<template>
    <el-row>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="submission-left-side color-bfi--bg">
          <div class="font-24">{{$lang[langId].requirement_document}}</div>
          <ul class="list-unstyled" v-if="type === 1">
            <li v-for="(list, key) in motorDoc" :key="key" class="flex-container--desktop pt-8 pb-8 px-24 font-14">
              <svg-icon class="font-20" style="min-width: 20px;" :icon-class="list.logo"></svg-icon>
                <span class="ml-8 word-break">{{list.label}}</span>
                <span v-if="list.optional" class="ml-4">({{$lang[langId].optional}})</span>
            </li>
          </ul>
          <ul class="list-unstyled" v-else-if="type === 2">
            <li v-for="(list, key) in carDoc" :key="key" class="flex-container--desktop pt-8 pb-8 px-24 font-14">
              <svg-icon class="font-20" style="min-width: 20px;" :icon-class="list.logo"></svg-icon>
                <span class="ml-8 word-break">{{list.label}}</span>
                <span v-if="list.optional" class="ml-4">({{$lang[langId].optional}})</span>
            </li>
          </ul>
          <ul class="list-unstyled" v-else-if="type === 3">
            <li v-for="(list, key) in houseDoc" :key="key" class="flex-container--desktop pt-8 pb-8 px-24 font-14">
              <svg-icon class="font-20" style="min-width: 20px;" :icon-class="list.logo"></svg-icon>
                <span class="ml-8 word-break">{{list.label}}</span>
                <span v-if="list.optional" class="ml-4">({{$lang[langId].optional}})</span>
            </li>
          </ul>
          <ul class="list-unstyled" v-else-if="type === 4">
            <li v-for="(list, key) in capitalDoc" :key="key" class="flex-container--desktop pt-8 pb-8 px-24 font-14">
              <svg-icon class="font-20" style="min-width: 20px;" :icon-class="list.logo"></svg-icon>
                <span class="ml-8 word-break">{{list.label}}</span>
                <span v-if="list.optional" class="ml-4">({{$lang[langId].optional}})</span>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="submission-right-side">
          <div class="font-24 mb-10">{{$lang[langId].submit_as}}</div>
          <div v-for="(typeSubmit, key) in types" :key="key" class="mt-10">
            <el-radio v-model="type" @change="(value) => handleSelect(value, typeSubmit)" :label="typeSubmit.id" border style="width: 100%">
              <svg-icon :icon-class="typeSubmit.logo"></svg-icon>
              {{typeSubmit.name}}
            </el-radio>
          </div>
          <el-button @click="handleSubmitNow" class="visible-lg visible-md visible-sm color-bfi--bg color-bfi--border" type="primary" style="width: 46%">
            {{$lang[langId].submit_now}}
          </el-button>
          <el-button @click="handleSubmitNow" class="visible-xs color-bfi--bg color-bfi--border" type="primary" style="width: 82%">
            {{$lang[langId].submit_now}}
          </el-button>
        </div>
      </el-col>
    </el-row>
</template>

<script>
export default {
  name: 'SubmisionType',
  data(){
    return{
      types: [
        {
          id: 1, logo: 'motorcycle', 
          name: this.$lang[this.$store.state.userStores.langId].motorcycle_guaranteed,
          message: this.$lang[this.$store.state.userStores.langId].motorcycle_guaranteed_msg,
          minAmount: 10000000, maxAmount: 50000000, minPlafond: 6, maxPlafond: 18
        },
        {
          id: 2, logo: 'car', 
          name: this.$lang[this.$store.state.userStores.langId].car_guaranteed,
          message: this.$lang[this.$store.state.userStores.langId].car_guaranteed_msg,
          minAmount: 10000000, maxAmount: 2000000000, minPlafond: 6, maxPlafond: 36
        },
        {
          id: 3, logo: 'house', 
          name: this.$lang[this.$store.state.userStores.langId].house_guaranteed,
          message: this.$lang[this.$store.state.userStores.langId].house_guaranteed_msg,
          minAmount: 10000000, maxAmount: 2000000000, minPlafond: 6, maxPlafond: 60
        },
        {
          id: 4, logo: 'user-man', 
          name: this.$lang[this.$store.state.userStores.langId].capital_without_guaranteed,
          message: this.$lang[this.$store.state.userStores.langId].capital_without_guaranteed_msg,
          minAmount: 10000000, maxAmount: 25000000, minPlafond: 3, maxPlafond: 12
        }
      ],
      motorDoc: [
        {name: 'idCard', label: this.$lang[this.$store.state.userStores.langId].photo_id_card_borrower, logo: 'id-card-white', optional: false},
        {name: 'idCardCouple', label: this.$lang[this.$store.state.userStores.langId].photo_id_card_couple, logo: 'id-card-white', optional: true},
        {name: 'familyRegister', label: this.$lang[this.$store.state.userStores.langId].family_register,logo: 'id-card-white', optional: false},
        {name: 'statement', label: this.$lang[this.$store.state.userStores.langId].statement_last_3_month, logo: 'file-white', optional: false},
        {name: 'NPWP', label: this.$lang[this.$store.state.userStores.langId].photo_taxpayer_number, logo: 'file-white', optional: false},
        {name: 'BPKB', label: this.$lang[this.$store.state.userStores.langId].photo_motorcycle_doc, logo: 'file-white', optional: false},
        {name: 'houseOwnership', label: this.$lang[this.$store.state.userStores.langId].house_ownership, logo: 'home', optional: false}
      ],
      carDoc: [
        {name: 'idCard', label: this.$lang[this.$store.state.userStores.langId].photo_id_card_borrower, logo: 'id-card-white', optional: false},
        {name: 'idCardCouple', label: this.$lang[this.$store.state.userStores.langId].photo_id_card_couple, logo: 'id-card-white', optional: true},
        {name: 'familyRegister', label: this.$lang[this.$store.state.userStores.langId].family_register, logo: 'id-card-white', optional: false},
        {name: 'statement', label: this.$lang[this.$store.state.userStores.langId].statement_last_3_month, logo: 'file-white', optional: false},
        {name: 'NPWP', label: this.$lang[this.$store.state.userStores.langId].photo_taxpayer_number, logo: 'file-white', optional: false},
        {name: 'BPKB', label: this.$lang[this.$store.state.userStores.langId].photo_car_doc, logo: 'file-white', optional: false},
        {name: 'houseOwnership', label: this.$lang[this.$store.state.userStores.langId].house_ownership, logo: 'home', optional: false}
      ],
      houseDoc: [
        {name: 'idCard', label: this.$lang[this.$store.state.userStores.langId].photo_id_card_borrower, logo: 'id-card-white', optional: false},
        {name: 'idCardCouple', label: this.$lang[this.$store.state.userStores.langId].photo_id_card_couple, logo: 'id-card-white', optional: true},
        {name: 'familyRegister', label: this.$lang[this.$store.state.userStores.langId].family_register, logo: 'id-card-white', optional: false},
        {name: 'statement', label: this.$lang[this.$store.state.userStores.langId].statement_last_3_month, logo: 'file-white', optional: false},
        {name: 'NPWP', label: this.$lang[this.$store.state.userStores.langId].photo_taxpayer_number, logo: 'file-white', optional: false},
        {name: 'sertifikat', label: this.$lang[this.$store.state.userStores.langId].photo_house_doc, logo: 'file-white', optional: false},
        {name: 'houseOwnership', label: this.$lang[this.$store.state.userStores.langId].house_ownership, logo: 'home', optional: false}
      ],
      capitalDoc: [
        {name: 'idCard', label: this.$lang[this.$store.state.userStores.langId].photo_id_card_borrower, logo: 'id-card-white', optional: false},
        {name: 'familyRegister', label: this.$lang[this.$store.state.userStores.langId].family_register,logo: 'id-card-white', optional: false},
        {name: 'NPWP', label: this.$lang[this.$store.state.userStores.langId].photo_taxpayer_number, logo: 'file-white', optional: false},
        {name: 'statement', label: this.$lang[this.$store.state.userStores.langId].statement_last_3_month, logo: 'file-white', optional: false},
        {name: 'coverTabungan', label: this.$lang[this.$store.state.userStores.langId].photo_saving_cover_book, logo: 'file-white', optional: false},
        {name: 'selfi', label: this.$lang[this.$store.state.userStores.langId].photo_house_selfie, logo: 'icon-camera-white', optional: false},
        {name: 'olseraProfile', label: this.$lang[this.$store.state.userStores.langId].olsera_profile_ss, logo: 'icon-image-white', optional: false}
      ],
      type: 1,
      typeSelected: {
        id: 1, logo: 'motorcycle', 
        name: this.$lang[this.$store.state.userStores.langId].motorcycle_guaranteed,
        message: this.$lang[this.$store.state.userStores.langId].motorcycle_guaranteed_msg,
        minAmount: 10000000, maxAmount: 50000000, maxPlafond: 18
      }
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

  methods: {
    handleSelect(val, submitType){
      this.typeSelected = submitType
    },

    handleSubmitNow(){
      this.$emit('onSubmit', this.type, this.typeSelected)      
    },
  }
}
</script>