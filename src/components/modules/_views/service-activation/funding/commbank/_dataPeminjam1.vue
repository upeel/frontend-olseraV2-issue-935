<template>
  <div class="form-wizard--content__wrapper">
    
    <!-- data kerabat -->
    <div class="wizard-content" style="background-color: #FAFAFA;">
      <h3 style="margin-top: 0;" class="mb-24">{{rootLang.borrower_relative}} ({{rootLang.optional}})</h3>
      <div class="flex-grow-1">
        <el-form
          :model="formDataKerabat"
          label-position="top">
          <el-form-item
            :label="rootLang.name_based_idcard"
            prop="nama">
            <el-input v-model="formDataKerabat.nama" />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item
                :label="rootLang.place_of_birth"
                prop="tempat_lahir">
                <el-input v-model="formDataKerabat.tempat_lahir" />
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item
                :label="lang.date_of_birth"
                prop="tanggal_lahir">
                <el-date-picker 
                   v-model="formDataKerabat.tanggal_lahir"
                  type="date" 
                  :placeholder="this.$lang[langId].pick_a_day" 
                  format="dd MMMM yyyy" 
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerDateOptions"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="nama_ibu_kandung">
            <el-form-item
              :label="rootLang.mother_name"
              prop="nama_ibu_kandung">
              <el-input v-model="formDataKerabat.nama_ibu_kandung" />
            </el-form-item>
          </el-form-item>
          <el-form-item prop="phone">
            <el-form-item
              :label="rootLang.phone_number"
              prop="phone">
              <phone-number-input
                :format-national="true"
                ref="inputPhoneKerabat"
                v-model="phone_number_kerabat"
                autocomplete="off"
                :translations="{
                  countrySelectorLabel: '',
                  countrySelectorError: '',
                  phoneNumberLabel: '',
                  example: ''
                }"
                :no-validator-state="true"
                :only-countries="['ID']"
                default-country-code="ID"
                @update="(event) => getPhone(event, 'kerabat')"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item prop="status">
            <el-form-item
              :label="rootLang.relative_status"
              prop="status">
              <el-input
                v-model="formDataKerabat.status"
                :placeholder="rootLang.relative_example"
              />
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- data peminjam -->
    <div class="wizard-content">
      <h3 style="margin-top: 0;" class="mb-24">{{rootLang.borrower_data}}</h3>
      <div class="flex-grow-1">
        <el-form
          :model="formData"
          :rules="rulesForm"
          label-position="top">
          <el-form-item
            :label="rootLang.full_name_based_idcard"
            prop="nama">
            <el-input v-model="formData.nama" />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item
                :label="rootLang.id_card_number"
                prop="ktp">
                <el-input v-model="formData.ktp" :maxlength="16" onkeydown="return ( event.ctrlKey || event.altKey 
                      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                      || (95<event.keyCode && event.keyCode<106)
                      || (event.keyCode==8) || (event.keyCode==9) 
                      || (event.keyCode>34 && event.keyCode<40) 
                      || (event.keyCode==46) )"/>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item
                :label="rootLang.taxpayer_number"
                prop="npwp">
                <el-input v-model="formData.npwp" :maxlength="20" onkeydown="return ( event.ctrlKey || event.altKey 
                      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                      || (95<event.keyCode && event.keyCode<106)
                      || (event.keyCode==8) || (event.keyCode==9) 
                      || (event.keyCode>34 && event.keyCode<40) 
                      || (event.keyCode==46) )"
                      v-mask="'##.###.###.#-###.###'"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            :label="rootLang.gender"
            prop="amount">
            <el-radio-group
              v-model="formData.gender"
              class="el-radio-group__flex">
              <el-radio-button
                v-for="(item, key) in genderOptions"
                :key="key"
                :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item
                :label="rootLang.place_of_birth"
                prop="tempat_lahir">
                <el-input v-model="formData.tempat_lahir" />
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item
                :label="lang.date_of_birth"
                prop="tanggal_lahir">
                <el-date-picker 
                   v-model="formData.tanggal_lahir"
                  type="date" 
                  :placeholder="this.$lang[langId].pick_a_day" 
                  format="dd MMMM yyyy" 
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerDateOptions"
                  @change="checkAge"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="nama_ibu_kandung">
            <el-form-item
              :label="rootLang.mother_name"
              prop="nama_ibu_kandung">
              <el-input v-model="formData.nama_ibu_kandung" />
            </el-form-item>
          </el-form-item>
          <el-form-item
            :label="rootLang.marital_status"
            prop="marital_status">
            <el-radio-group
              v-model="formData.marital_status"
              class="el-radio-group__flex">
              <el-radio-button
                v-for="(item, key) in maritalOptions"
                :key="key"
                :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item
                :label="rootLang.phone_number"
                prop="phone">
                <phone-number-input
                  ref="inputPhone"
                  v-model="phone_number"
                  autocomplete="off"
                  :translations="{
                    countrySelectorLabel: '',
                    countrySelectorError: '',
                    phoneNumberLabel: '',
                    example: ''
                  }"
                  :only-countries="['ID']"
                  :no-validator-state="true"
                  default-country-code="ID"
                  @update="(event) => getPhone(event, 'phone')"
                />
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item
                :label="rootLang.other_phone_number"
                prop="phone_other">
                <phone-number-input
                  ref="inputPhone"
                  v-model="phone_number_other"
                  autocomplete="off"
                  :translations="{
                    countrySelectorLabel: '',
                    countrySelectorError: '',
                    phoneNumberLabel: '',
                    example: ''
                  }"
                  :only-countries="['ID']"
                  :no-validator-state="true"
                  default-country-code="ID"
                  @update="(event) => getPhone(event, 'other')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="email">
            <el-form-item
              label="Email"
              prop="email">
              <el-input
                v-model="formData.email"
                type="email"
              />
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'


export default {
  mixins: [basicComputedMixin],
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser
    },
  },
  data() {
    let emailMatchCheck = (rule, value, callback) => { 
      if (this.$store.getters.loggedInUser.email !== this.formData.email) {
        return callback(new Error(this.$lang[this.$store.state.userStores.langId].email_must_match));
      }else{
        callback()
      }
    }

    return {
      phone_number: null,
      phone_number_other: null,
      phone_number_kerabat: null,
      formData: {
        nama: '',
        gender: 'M',
        marital_status: 1
      },
      formDataKerabat: {},
      rulesForm: {
        nama: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        ktp: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true,
          },
          {
            message: this.$lang[this.$store.state.userStores.langId].length_should_be_16,
            min: 16, max: 16,
            trigger: 'blur'
          }
        ],
        npwp: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        tanggal_lahir: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        nama_ibu_kandung: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        tempat_lahir: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        phone: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          }
        ],
        phone_other: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          },{
            min: 6, max: 6,
            message: this.$lang[this.$store.state.userStores.langId].length_should_be_6,
            trigger: 'blur'
          }
        ],
        email: [
          {
            message: this.$store.state.userStores.lang.required,
            trigger: 'blur',
            required: true
          },
          {
            message: this.$lang[this.$store.state.userStores.langId].input_email,
            trigger: 'blur',
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            required: true
          },
          { validator: emailMatchCheck, trigger: 'blur' }
        ],
      },
      pickerDateOptions: {
        disabledDate: this.disabledDate
      },
    }
  },

  computed: {
    genderOptions() {
      return [
        {
          value: 'M',
          label: this.$lang[this.$store.state.userStores.langId].male
        },
        {
          value: 'F',
          label: this.$lang[this.$store.state.userStores.langId].female
        }
      ]
    },
    maritalOptions() {
      return [
        {
          value: 1,
          label: this.$lang[this.$store.state.userStores.langId].single
        },
        {
          value: 2,
          label: this.$lang[this.$store.state.userStores.langId].married
        },
        {
          value: 3,
          label: this.$lang[this.$store.state.userStores.langId].widow
        }
      ]
    }
  },

  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', [{data_peminjam: data},'peminjam'])
      }
    },
    formDataKerabat: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('change', [{data_kerabat: data}, 'kerabat'])
      }
    }
  },

  mounted(){
  },

  methods: {


    handleInput(e) {
      // const inputWrapper = this.$refs.inputPhone.$children[1].$el
      // const inputTag = inputWrapper.getElementsByTagName('input')[0]
      // inputTag.style.borderColor = 'transparent !important'
    },

    disabledDate(time){
      return time.getTime() > Date.now(); 
    },

    checkAge(value){
      let dateSelected = new Date(value);
      var diff_ms = Date.now() - dateSelected.getTime();
      var age_dt = new Date(diff_ms); 
    
      let userAge = Math.abs(age_dt.getUTCFullYear() - 1970);

      if(userAge < 21 || userAge > 65){
        this.formData.tanggal_lahir = ''
        this.$notify({
          type: 'error',
          message: this.rootLang.age_21_65
        })
      }
    },

    getPhone(e, input){
      if(input === 'kerabat'){
        this.formDataKerabat.phone = e.formattedNumber
      } else if(input === 'other'){
        this.formData.phone_other = e.formattedNumber
      }else{
        this.formData.phone = e.formattedNumber
      }
    },
  }
}
</script>
