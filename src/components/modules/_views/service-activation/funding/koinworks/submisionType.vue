<template>
    <el-row>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="submission-left-side color-koinworks--bg">
          <div class="font-24">{{$lang[langId].requirement_document}}</div>
          <ul class="list-unstyled" v-if="type === 1">
            <li v-for="(list, key) in individualDoc" :key="key" class="flex-container--desktop pt-8 pb-8 px-24 font-14">
              <svg-icon class="font-20" style="min-width: 20px;" :icon-class="list.logo"></svg-icon>
                <span class="ml-8 word-break">{{list.label}}</span>
                <span v-if="list.optional" class="ml-4">({{$lang[langId].optional}})</span>
            </li>
          </ul>

          <ul class="list-unstyled" v-else>
            <li v-for="(list, key) in businessDoc" :key="key" class="flex-container--desktop pt-8 pb-8 px-24 font-14">
              <svg-icon class="font-20" style="min-width: 20px;" :icon-class="list.logo"></svg-icon>
                <span class="ml-8 word-break">{{list.label}}</span>
                <span v-if="list.optional" class="ml-4">({{$lang[langId].optional}})</span>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="submission-right-side">
          <div class="font-24">{{$lang[langId].submit_as}}</div>
          <div class="mt-20">
            <el-radio v-model="type" :label="1" border style="width: 100%">
              <svg-icon icon-class="user-man"></svg-icon>
              {{$lang[langId].individual}}
            </el-radio>
          </div>
          <div class="mt-10">
            <el-radio v-model="type" :label="2" border style="width: 100%">
              <svg-icon icon-class="building"></svg-icon>
              {{$lang[langId].company}} (CV/PT)
            </el-radio>
          </div>
          <el-button @click="handleSubmitNow" class="visible-lg visible-md visible-sm color-koinworks--bg color-koinworks--border" type="primary" style="width: 46%">
            {{$lang[langId].submit_now}}
          </el-button>
          <el-button @click="handleSubmitNow" class="visible-xs color-koinworks--bg color-koinworks--border" type="primary" style="width: 82%">
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
      individualDoc: [
        {
          name: 'idCard',
          label: this.$lang[this.$store.state.userStores.langId].photo_id_card_borrower,
          logo: 'id-card-white',
          optional: false
        },
        {
          name: 'idCardCouple',
          label: this.$lang[this.$store.state.userStores.langId].photo_id_card_couple,
          logo: 'id-card-white',
          optional: true
        },
        {
          name: 'familyRegister',
          label: this.$lang[this.$store.state.userStores.langId].family_register,
          logo: 'file-white',
          optional: false
        },
        {
          name: 'NPWP',
          label: this.$lang[this.$store.state.userStores.langId].photo_taxpayer_number,
          logo: 'file-white',
          optional: false
        },
        {
          name: 'statement',
          label: this.$lang[this.$store.state.userStores.langId].statement_last_3_month,
          logo: 'file-white',
          optional: false
        }
      ],
      businessDoc: [
        {
          name: 'idCard',
          label: this.$lang[this.$store.state.userStores.langId].photo_id_card_borrower,
          logo: 'id-card-white',
          optional: false
        },
        {
          name: 'idCardCouple',
          label: this.$lang[this.$store.state.userStores.langId].photo_id_card_couple,
          logo: 'id-card-white',
          optional: true
        },
        {
          name: 'familyRegister',
          label: this.$lang[this.$store.state.userStores.langId].family_register,
          logo: 'id-card-white',
          optional: false
        },
        {
          name: 'deeds',
          label: this.$lang[this.$store.state.userStores.langId].deed_of_establishment + ', ' +
           this.$lang[this.$store.state.userStores.langId].deed_of_change + ', SK Menkumham',
          logo: 'file-white',
          optional: false
        },
        {
          name: 'siup',
          label: this.$lang[this.$store.state.userStores.langId].trade_business_licensing,
          logo: 'file-white',
          optional: false
        },
        {
          name: 'NPWP',
          label: this.$lang[this.$store.state.userStores.langId].photo_company_taxpayer_number,
          logo: 'file-white',
          optional: false
        },
        {
          name: 'statement',
          label: this.$lang[this.$store.state.userStores.langId].statement_last_3_month,
          logo: 'file-white',
          optional: false
        }
      ],
      type: 1,
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
    handleSubmitNow(){
      this.$emit('onSubmit', this.type)      
    },
  }
}
</script>