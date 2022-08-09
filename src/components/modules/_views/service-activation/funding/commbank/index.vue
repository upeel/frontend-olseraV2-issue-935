<template>
  <div>
    <el-dialog
      :visible.sync="show"
      :before-close="closeForm"
      :show-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="$lang[langId].commbank_loan_title"
      custom-class="commbank-bizloan without-padding mw-1020">
      <el-dialog
        width="30%"
        :title="$lang[langId].unsaved_title"
        :visible.sync="dialogWarningClose"
        :show-close="false"
        append-to-body
        center>
        <div align="center">
          <span class="mb-24">{{$lang[langId].unsaved_message}}</span>
          <span class="pt-24 d-block">
            <el-button class="mb-8" type="danger" style="width: 100%;" @click="handleClose">{{$lang[langId].close}}</el-button><br/>
            <el-button type="info" style="width: 100%;" plain @click="dialogWarningClose = false">{{$lang[langId].back}}</el-button>
          </span>
        </div>
      </el-dialog>
      <div class="form-wizard">
        <div class="form-wizard--step">
          <div
            v-for="(item, key) in steps"
            :key="key"
            :class="[
              completeSteps.includes(key) ? 'active' : '',
              key === completeSteps[completeSteps.length - 1] ? 'current' : ''
            ]"
            class="form-wizard--step--item"
            @click="handleClickStep(item.id, key)">
            {{ item.id }}. {{ item.name }}
          </div>
        </div>

        <div class="form-wizard--content">
          <syarat v-show="activeStep === 1" @next="handleNext" />
          <jumlah-pinjaman v-show="activeStep === 2" @next="handleNext" />
          <data-peminjam v-show="activeStep === 3" @next="handleNext" />
          <data-usaha v-show="activeStep === 4" @next="handleNext" />
          <ringkasan v-show="activeStep === 5" :ringkasan="formData" :stillSubmit="loadingSubmit" @next="handleNext" />
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showPrivacy"
      :before-close="closePrivacy"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      class="dialog-mdr">
      <div slot="title" class="flex-container">
        <h4 class="dialog-title full-width">
          {{$lang[langId].commbank_privacy_title}}
        </h4>
        <div class="btn_save_dialog text-right full-width">
          <el-button type="info" @click="closePrivacy">{{ $lang[langId].disagree }}</el-button>
          <el-button type="primary" :disabled="disableAgree" :loading="loadingSubmit" @click="acceptTermCondition">{{ $lang[langId].agree }}</el-button>
        </div>
      </div>
      <perfect-scrollbar @ps-y-reach-end="handleScrollTerm" class="scrollterm">
        <h4><b>Customer Consent / Pernyataan Nasabah</b></h4>
        <small>Diperbarui : 16 April 2021</small><br><br>
        <p style="word-break: break-word;">Dengan menandai Ketentuan Privasi Data ini, Anda sebagai Pemohon menyatakan 
          bahwa Anda telah membaca, memahami dan menyetujui Ketentuan Privasi Data CommBank Bizloan yang berlaku dari 
          PT Bank Commonwealth (“Bank”) melalui situs web atau aplikasi milik PT Olsera Indonesia Pratama (“Mitra Bank”).
        </p>
        <span class="word-break list-term-commonwealth">
          <b>Ketentuan Privasi Data Commbank Bizloan PT Bank Commonwealth<br>
            <div class="pt-8">Ketentuan Privasi Commbank Bizloan:</div>
          </b>
          <ol class="pl-20">
            <li>CommBank Bizloan adalah failitas kredit tanpa agunan, ditujukan untuk pedagang/merchant</li>
            <li>Atas pengajuan permohonan CommBank Bizloan melalui Situs web atau aplikasi ini, maka Anda 
              (selanjutnya disebut "Pemohon") wajib mematuhi, tunduk serta menyetujui hal-hal sebagai berikut:
              <ol type="a" class="pl-20">
                <li>
                  Pemohon akan memberikan data dan informasi untuk pengajuan permohonan CommBank Bizloan dan menjamin 
                  kebenaran data dan informasi tersebut yang mana telah menggambarkan keadaan yang sebenarnya.
                </li>
                <li>
                  Pemohon telah setuju untuk memberikan ijin kepada Mitra Bank dan Bank serta Pihak terafiliasi Bank yang termasuk 
                  namun tidak terbatas pada Commonwealth Bank Australia dan Notaris rekanan Bank, untuk meneruskan, mengutamakan dan 
                  / atau menyerahkan segala data dan informasi pribadi yang diserahkan oleh Pemohon dengan tujuan:
                  <ul class="pl-20">
                    <li>
                      Mengungkapkan seluruh informasi yang berkaitan dengan pinjaman Pemohon ke dalam Sistem Layanan Informasi Keuangan (SLIK)
                      atau sistem informasi lainnya sesuai dengan ketentuan yang ditetapkan oleh Otoritas Jasa Keuangan (OJK) dan instansi terkait 
                      lainnya dari waktu ke waktu
                    </li>
                    <li>
                      Mencatatkan data dan informasi yang ada di sistem bank dan Sistem Laporan Informasi Keuangan (SLIK), untuk kepentingan 
                      permohonan Commbank Bizloan, produk Bank lainnya serta keperluan internal Bank, verifikasi pihak ketiga dan/atau pihak 
                      yang terafiliasi dengan Bank.
                    </li>
                  </ul>
                </li>
                <li>
                  Pemohon dengan ini memberikan kuasa kepada Bank (dengan hak subtitusi) untuk dapat melakukan pemeriksaan
                  sewaktu-waktu serta mencari dan mendapatkan informasi kepada/di/dari lembaga, perseroan, maupun pihak manapun 
                  atas data/identitas Pemohon serta seluruh data dan informasi yang Pemohon berikan telah sesuai dengan ketentuan Bank.
                </li>
                <li>
                  Pemohon dengan ini bertanggung jawab sepenuhnya atas segala resiko dan akibat hukum di kemudian hari yang diakibatkan 
                  oleh kelalaian Pemohon dan membebaskan Mitra Bank dan Bank dasari segala tuntutan berdasarkan kuasa, kewenangan dan tindakan 
                  yang Pemohon berikan dalam pengajuan Commbank Bizloan melalui situs web dan/atau aplikasi ini.
                </li>
                <li>
                  Pemohon dengan ini tunduk pada hukum yang berlaku di indonesia, termasuk namun tidak terbatas pada Undang-undang dan Peraturan 
                  terkait dengan Perbankan, Informasi dan Transaksi Elektronik, kejahatan finansial, dan/atau tindak pidana pencucian uang/korupsi, 
                  maupun aturan hukum internasional terkait.
                </li>
                <li>
                  Bank memiliki kewenangan dan kebijakan sendiri untuk memutuskan pemberian atau penolakan pengajuan permohonan CommBank BizLoan.
                </li>
                <li>
                  Syarat dan Ketentuan lain yang belum diatur dalam Syarat dan Ketentuan mengenai pengajuan CommBank Bizloan ini, akan mengacu pada 
                  Syarat dan Ketentuan yang berlaku di Bank.
                </li>
                <li>
                  Syarat dan Ketentuan ini tunduk pada Hukum yang berlaku di Indonesia.
                </li>
              </ol>
            </li>
            <li>
              Bank sewaktu-waktu dapat mengubah Ketentuan Privasi Data Commbank Bizloan dengan permberitahuan kepada Nasabah paling lambat 30 (tiga puluh) 
              hari kerja sebelum tanggal efektif diberlakukan perubahan melalui situs web dan/atau aplikasi, email atau media komunikasi yang dianggap layak 
              oleh Bank.
            </li>
            <li>
              Ketentuan Privasi Data ini telah disesuakan dengan ketentuan peraturan perundang-undangan termasuk ketentuan peraturan Otoritas Jasa Keuangan (OJK).
            </li>
          </ol>
          Bank adalah Lembaga yang terdaftar dan diawasi oleh Otoritas Jasa Keuangan (OJK).
        </span>
      </perfect-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import { submitSubmission } from '@/api/thirdParty/commbank'
import basicComputedMixin from '@/mixins/basicComputedMixin'
import Syarat from './_syarat'
import JumlahPinjaman from './_jumlahPinjaman'
import DataPeminjam from './_dataPeminjam'
import DataUsaha from './_dataUsaha'
import Ringkasan from './_ringkasan'
export default {
  components: {
    Syarat,
    JumlahPinjaman,
    DataPeminjam,
    DataUsaha,
    Ringkasan
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      show: true,
      showPrivacy: false,
      disableAgree: true,
      loadingSubmit: false,
      dialogWarningClose: false,
      activeStep: 1,
      steps: [
        {id: 1, name: this.$lang[this.$store.state.userStores.langId].terms},
        {id: 2, name: this.$lang[this.$store.state.userStores.langId].jumlah_pinjaman},
        {id: 3, name: this.$lang[this.$store.state.userStores.langId].borrower_data},
        {id: 4, name: this.$lang[this.$store.state.userStores.langId].data_business},
        {id: 5, name: this.$lang[this.$store.state.userStores.langId].summary}],
      completeSteps: [0],
      formData: {}
    }
  },

  methods: {
    closeForm() {
      if(this.completeSteps[this.completeSteps.length - 1] !== 0){
        this.dialogWarningClose = true
      }else{
        this.handleClose()
      }

    },
    handleClose(){
      this.dialogWarningClose = false
      this.$router.push({
        path: '/service-activation-v2'
      })
    },
    closePrivacy(){
      this.showPrivacy = false
      this.loadingSubmit = false
      this.show = true
    },
    acceptTermCondition(){
      this.loadingSubmit = true
      let allData = this.formData
      let martialStatus = 1
      var allBank = []
      var i;

      for (i = 0; i < 3; i++) {
        if("bank_" + i in this.formData){
          if(this.formData["bank_"+i].bank_id.length !== 0 && this.formData["bank_"+i].bank_account_number.length !== 0){
            let bank = {}
            delete this.formData["bank_"+i].bank_name
            bank.bank_id = this.formData["bank_"+i].bank_id
            bank.bank_owner_name = this.formData["bank_"+i].bank_owner_name
            bank.bank_account_number = this.formData["bank_"+i].bank_account_number
            allBank.push(bank)
          }
        }
      }
      
      var submitData = {
        //jumlah_pinjaman
        loan_amount: allData.jumlah_pinjaman.amount,
        loan_tenor: allData.jumlah_pinjaman.plafond,
        loan_purpose: allData.jumlah_pinjaman.purpose,

        //data_peminjam
        merchant_name: allData.data_peminjam.nama,
        merchant_ktp: allData.data_peminjam.ktp,
        merchant_npwp: allData.data_peminjam.npwp.replace(/\./g, '').replace('-',''),
        merchant_gender: allData.data_peminjam.gender,
        merchant_place_of_birth: allData.data_peminjam.tempat_lahir,
        merchant_date_of_birth: allData.data_peminjam.tanggal_lahir,
        merchant_marital_status: allData.data_peminjam.marital_status,
        merchant_biological_mothers_name: allData.data_peminjam.nama_ibu_kandung,
        merchant_email: allData.data_peminjam.email,
        merchant_mobile: allData.data_peminjam.phone,
        merchant_mobile2: allData.data_peminjam.phone_other,

        //data_kerabat
        relatives_name: allData.data_kerabat.nama,
        relatives_place_of_birth: allData.data_kerabat.tempat_lahir,
        relatives_date_of_birth: allData.data_kerabat.tanggal_lahir,
        relatives_biological_mothers_name: allData.data_kerabat.nama_ibu_kandung,
        relatives_mobile: allData.data_kerabat.phone,
        relatives_status: allData.data_kerabat.status,

        //alamat_ktp
        merchant_ktp_address: allData.alamat_ktp.address,
        merchant_ktp_province_id: allData.alamat_ktp.provinsi,
        merchant_ktp_city_id: allData.alamat_ktp.kabupaten,
        merchant_ktp_districts_id: allData.alamat_ktp.kecamatan,
        merchant_ktp_postal_code: allData.alamat_ktp.kode_pos,
        merchant_ktp_rt: allData.alamat_ktp.rt,
        merchant_ktp_rw: allData.alamat_ktp.rw,
        merchant_ktp_address_ownership: allData.alamat_ktp.kepemilikan,
        merchant_ktp_address_long_stay: allData.alamat_ktp.lama_menetap,

        //alamat_domisili
        merchant_domicile_address: allData.alamat_domisili.address,
        merchant_domicile_province_id: allData.alamat_domisili.provinsi,
        merchant_domicile_city_id: allData.alamat_domisili.kabupaten,
        merchant_domicile_districts_id: allData.alamat_domisili.kecamatan,
        merchant_domicile_postal_code: allData.alamat_domisili.kode_pos,
        merchant_domicile_rt: allData.alamat_domisili.rt,
        merchant_domicile_rw: allData.alamat_domisili.rw,
        merchant_domicile_address_ownership: allData.alamat_domisili.kepemilikan,
        merchant_domicile_address_long_stay: allData.alamat_domisili.lama_menetap,

        //data_usaha
        business_type_id: allData.data_usaha.sektor_usaha,
        economic_sector: allData.data_usaha.sektor_ekonomi,
        type_of_business: allData.data_usaha.jenis_usaha,
        business_address: allData.data_usaha.address,
        business_province_id: allData.data_usaha.provinsi,
        business_city_id: allData.data_usaha.kabupaten,
        business_districts_id: allData.data_usaha.kecamatan,
        business_postal_code: allData.data_usaha.kode_pos,
        business_rt: allData.data_usaha.rt,
        business_rw: allData.data_usaha.rw,

        //pinjaman_lain
        other_loan_information: allData.pinjaman_lain.pinjaman_lain,
        total_other_loan_amount: allData.pinjaman_lain.total_cicilan_pinjaman_lain,
        total_other_loan_installments_monthly: allData.pinjaman_lain.total_nominal_sisa_pinjaman_lain,
        total_other_loan_remaining_amount: allData.pinjaman_lain.total_pinjaman_lain,

        //data_bank
        merchant_bank: allBank
      }

      submitSubmission(submitData).then(response => {
        this.loadingSubmit = false
        this.show = false
        this.showPrivacy = false
        this.activeStep = 1
        this.completeSteps = [0]
        this.formData = {}
        this.$message({
          type: 'success',
          message: this.$lang[this.langId].success_apply_loan
        })
        this.$emit('refresh')
      }).catch(error => {
        this.loadingSubmit = false
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
    handleNext(item, data) {
      if(this.completeSteps.indexOf(item+1) === -1){
        this.completeSteps.push(item+1)
      }
      if(item < 4){
        this.activeStep = this.steps[item+1].id
      }

      this.handleFormData(item, data)
    },
    handleFormData(item, data) {
      this.formData = { ...this.formData, ...data }
      if(item === 4){
        this.showPrivacy = true
      }
    },
    handleClickStep(item, key) {
      if(key in this.completeSteps){
        this.activeStep = item
        // this.steps.map((stepItem, stepKey) => {
        //   if (stepItem.id <= item) {
        //     this.completeSteps.push(step)
        //   }
        // })
      }
    },
    handleScrollTerm () {
      this.disableAgree = false
    },
  }
}
</script>
