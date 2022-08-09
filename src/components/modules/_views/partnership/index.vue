<template>
  <div class="content-wrapper">
    <!-- <home /> -->
    <section class="content" >
      <div class="banner-partner radius-10">
        <div class="banner-icon">
          <div class="color-white">
            <span class="title font-32 font-bold">Gabung Partner</span>
            <div class="font-20">Rekan untung, Anda untung</div>
          </div>
        </div>
      </div>

      <div
        v-loading="loading"
        class="flex-container--same-height flex-container--desktop mt-24">
        <div class="full-width border border--grey-border radius-10 p-24 mr-12 color-white--bg" style="flex: 1">
          <div class="flex-container full-width">
            <div class="container-icon">
              <el-avatar
                :size="32"
                :src="loggedInUser.photo"
                shape="circle"
              />
            </div>
            <div class="full-width font-20 ml-8">{{ loggedInUser.name }}</div>
            <el-popover
              placement="bottom"
              title="Title"
              width="200"
              trigger="hover">
              <el-button slot="reference" circle type="text">
                <div class="container-icon">
                  <svg-icon icon-class="information-circle" />
                </div>
              </el-button>
              <div>
                <div>✔️ Dapatkan komisi hingga 350rb untuk setiap rekanmu yang berhasil mendaftar dan berlangganan Olsera 1 tahun. <br>✔️ Rekanmu juga akan mendapatkan benefit berupa voucher 218rb untuk tambahan masa aktif langganan.</div>
              </div>
            </el-popover>
          </div>
          <div class="mt-16 font-14">Bagikan link partner Anda ke rekan wirausaha kamu untuk bergabung bersama Olsera</div>
          <div class="color-primary--soft--bg radius-10 p-16">
            <div class="flex-container">
              <div id="partner_code" class="font-20 font-bold word-break px-8">{{ masterPartner.url_partner }}</div>
              <div class="flex-grow-1"></div>
              <div>
                <div class="flex-container color-primary pointer" @click="copyText('partner_code')">
                  <div class="container-icon pointer" slot="append" >
                    <svg-icon icon-class="feather-copy" stroke="#67C23A"></svg-icon>
                  </div>
                  <span class="font-16 font-bold">Copy</span>
                </div>
                <div class="flex-container color-primary ml-8">
                  <el-dropdown
                    trigger="click">
                    <span class="el-dropdown-link font-18 color-primary">
                      <svg-icon icon-class="share-2" stroke="#67C23A"></svg-icon>
                      <span class="font-16 font-bold">Share</span>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="network in networkShare"
                        :key="network.network"
                        command="edit">
                        <ShareNetwork
                          :network="network.network"
                          :url="masterPartner.url_partner ? masterPartner.url_partner : ''"
                          title=""
                          description="Hi! Ayo gabung bersama saya menggunakan Olsera. Premium, Kaya Fitur, Memuaskan. Aplikasi Kasir dengan fitur Delivery, Take Away plus Website yang benar-benar membantu. Murah mulai Rp 140.000/bulan. Eishh, juga tersedia plan Gratis untuk usaha yang baru rintis loh. Daftar di link ini untuk mendapatkan GRATIS coba dan Voucher Rp 218.000 untuk aktivasi tambahan. Masih tersedia, buruan! "
                          quote="Hi! Ayo gabung bersama saya menggunakan Olsera. Premium, Kaya Fitur, Memuaskan! Aplikasi Kasir dengan fitur Delivery, Take Away plus Website yang benar-benar membantu. Murah mulai Rp 140.000/bulan. Eishh, juga tersedia plan Gratis untuk usaha yang baru rintis loh. Daftar di link ini untuk mendapatkan GRATIS coba dan Voucher Rp 218.000 untuk aktivasi tambahan. Masih tersedia, buruan! "
                          hashtags="olsera" >
                          <div class="full-width" style="text-transform: capitalize">{{ network.network }}</div>
                        </ShareNetwork>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-16 color-primary--soft--bg radius-10 p-16">
            <div class="flex-container">
              <div class="full-width word-break">
                <span>Atau bagikan kepada tim Olsera calon pengguna yang Anda kenal berupa 
                  <span class="font-bold">Nama, No Contact</span> dan <span class="font-bold">Kebutuhan.</span> Tim kami akan menghubungi mereka dan mendaftarkannya ke dalam akun partner Anda. *Santai saja. Biarkan kami yang melakukan follow up kepada pelanggan agar mereka berlangganan setelah 14 hari trial.</span>
              </div>
              <div class="px-8 pointer" style="display: flex; width: 30%" @click="openWa">
                <div class="container-icon" slot="append" >
                  <svg-icon icon-class="ico-whatsapp" stroke="#67C23A"></svg-icon>
                </div>
                <div class="ml-8 font-16 font-bold" style="color: #67C23A">Share ke Olsera</div>
              </div>
            </div>
          </div>
        </div>
        <div class="full-width border border--grey-border radius-10 p-24 ml-12 color-white--bg" style="flex: 1">
          <div class="flex-container full-width">
            <div class="container-icon">
              <svg-icon icon-class="icon-money" class="color-primary" />
            </div>
            <div class="full-width font-20">Total Komisi Dicairkan</div>
          </div>
          <div class="mt-16 font-14">Sediakan akun bank untuk pencairan komisi dari program Gabung Partner</div>
          <div class="color-info--bg radius-10 p-16">
            <div class="flex-container">
              <div class="full-width text-center">
                <div class="font-20 font-bold word-break px-8 color-info" >{{ masterPartner.ftotal_comission }}</div>
              </div>
            </div>
          </div>
          <div class="font-14 color-info">Komisi otomatis dicairkan Olsera</div>
          <div class="mt-16 color-green--soft--bg radius-10 p-16">
            <div v-if="!masterPartner.bt_account_no" class="flex-container">
              <div class="container-icon">
                <svg-icon icon-class="icon-bank" class="color-primary" />
              </div>
              <div class="full-width">Belum ada akun Bank</div>
              <div>
                <el-button type="success" @click="dialogEditBank = true">{{ rootLang.add }}</el-button>
              </div>
            </div>
            <div v-else class="flex-container">
              <div class="container-icon">
                <svg-icon icon-class="icon-bank" class="color-primary" />
              </div>
              <div class="full-width">{{ masterPartner.bt_bank }}</div>
              <div class="container-icon pointer" @click="handleEditBank">
                <svg-icon icon-class="edit-2" class="color-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-container mt-24">
        <div class="full-width font-20">{{ rootLang.registered_partner }}</div>
        <div class="table-handler-flex full-width text-right px-24" style="display: contents">
          <el-input class="inline-form input-search full-width" clearable :placeholder="lang.search" prefix-icon="el-icon-search" v-model="params.search" @change="handleSearch" size="small"></el-input>
        </div>
        <!-- <div class="flex-container">
          <el-button @click="showData('all')" 
            type="info-addon" 
            :class="visibleItem[0] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'">
              Semua
          </el-button>
          <el-button @click="showData('not_saved')" 
            type="info-addon" 
            :class="visibleItem[1] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'">
              Belum Dicairkan
          </el-button>
          <el-button @click="showData('saved')" 
            type="info-addon" 
            :class="visibleItem[1] ? 'active tag-button-tokped box-shadow-null' : 'tag-button-tokped box-shadow-null'">
              Dicairkan
          </el-button>
        </div> -->
      </div>

      <div class="like-table-wrapper mt-16 mb-24">
        <el-table
          v-loading="loadingPartner"
          class="with-empty-data"
          :data="dataPartner"
          @row-click="getDetailPartner">
          <div slot="append" v-if="dataPartner.length === 0" class="card_close_date box-card">
            <div class="no-data-wrapper no-data-settle">
              <img src="/static/img/no-data-partner.svg" class="no-data-image">
              <div style="max-width: 360px; width: 100%">
                <span>Belum ada rekan terdaftar, Yuk! Ajak teman-temanmu gabung olsera dan dapatkan keuntungannya</span>
              </div>
            </div>
          </div>
          <el-table-column :label="lang.store_name" prop="fcreated_time" >
            <template slot-scope="scope">
              <div class="flex-container">
                <el-avatar
                  :size="32"
                  :src="scope.row.logo"
                  shape="circle"
                  :style="'border: 1px solid;'"
                />
                <div class="ml-8">{{ scope.row.name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="rootLang.join_date" prop="fcreated_time" ></el-table-column>
          <el-table-column :label="rootLang.date_withdraw" prop="flast_date_withdraw" ></el-table-column>
          <el-table-column :label="lang.total + ' ' + rootLang.comission" prop="fcommission" ></el-table-column>
        </el-table>

        <div v-if="meta.total> meta.page_size" class="mt-12 border border--grey-border table-handler-bottom text-center">
          <el-pagination
            :total="meta.total"
            :page-sizes="[1, 15, 50, 100]"
            :page-size="meta.page_size"
            :current-page.sync="meta.currentPage"
            style="margin-bottom: 20px"
            background
            layout="sizes, prev, pager, next"
            @current-change="handleChangePage"
            @size-change="handleChangeSizePage"
          />
        </div>
      </div>

      <transition name="el-zoom-in-center">
        <div
          v-if="showDetail"
          class="offscreen-right-sidebar">
          <div class="offscreen-right-sidebar--wrapper">
            <div class="offscreen-right-sidebar--header text-left">
              <div class="full-width font-20">{{ rootLang.detail_partner }}</div>
              <close-esc @close="handleClose" />
            </div>
            <div>
              <div class="flex-container">
                <el-avatar
                  :size="32"
                  :src="tempPartner.logo"
                  shape="circle"
                  :style="'border: 1px solid;'"
                />
                <div class="ml-12">
                  <div class="font-20 font-bold text-capitalize">{{ tempPartner.name }}</div>
                  <span class="font-12 color-info">{{ rootLang.registered_on }} {{ tempPartner.fcreated_time }}</span>
                </div>
              </div>
              <div class="mt-20 flex-container">
                <div class="full-width font-20 font-bold">{{ lang.total }} {{ rootLang.comission }}</div>
                <div class="full-width font-20 font-bold text-right">{{ tempPartner.fcommission }}</div>
              </div>
              <div class="mt-16 border border--grey border--with-shadow radius-5">
                <div v-for="item in tempPartner.billing" :key="item.id" class="like-table-wrapper--item flex-container">
                  <div class="full-width">
                    <div>{{ item.billing_package_option_name }}</div>
                    <div class="font-12 color-info">{{ item.fbilling_date }}</div>
                    <el-tag v-if="item.comission_is_paid === 0" type="info" effect="plain">{{ rootLang.pending }}</el-tag>
                    <el-tag v-else type="success" effect="plain">Sudah dicairkan</el-tag>
                  </div>
                  <div class="text-right" style="width: 40%">{{ item.fcomission_amount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      
      <el-dialog
        :visible.sync="dialogEditBank"
        :show-close="false"
        :close-on-press-escape="false"
        append-to-body
        custom-class="dialog-card">
        <div slot="title" class="flex-container">
          <h4 class="dialog-title full-width">
            {{ masterPartner.bt_account_no ? lang.edit + ' ' + lang.bank_account : rootLang.add_bank_account }}
          </h4>
          <div class="btn_save_dialog full-width text-right">
            <el-button type="info" @click="dialogEditBank = false, temp = {}">{{ lang.cancel }}</el-button>
            <el-button :loading="loadingSaveBank" type="success" @click="handleSaveBank" >{{ lang.save }}</el-button>
          </div>
        </div>
        <div>
          <div class="full-width">
            <div class="mb-16 word-break">Pastikan Nama dan Nomor akun sesuai dengan buku tabungan Anda</div>
            <div class="mb-16">
              <div class="font-12 text-left">Nama Bank</div>
              <!-- <el-select
                v-if="!masterPartner.bt_account_no"
                v-model="temp.bank_swift_id"
                placeholder="Pilih tipe bisnis Anda"
                filterable
                style="width:100%">
                <el-option
                  v-for="item in listBank"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select> -->
              <el-select
                v-model="temp.bt_bank"
                placeholder="Pilih tipe bisnis Anda"
                filterable
                style="width:100%">
                <el-option
                  v-for="item in listBank"
                  :key="item.id"
                  :value="item.name"
                  :label="item.name"
                />
              </el-select>
              <div class="font-12 text-left mt-16">Cabang</div>
              <el-input v-model="temp.bt_branch_code"></el-input>

              <div class="font-12 text-left mt-16">Nama Akun</div>
              <el-input v-model="temp.bt_account_name" ></el-input>

              <div class="font-12 text-left mt-16">Nomor Akun</div>
              <el-input v-model="temp.bt_account_no" type="number"></el-input>
            </div>
          </div>
        </div>
      </el-dialog>
    </section>

    <activation-partnership
      :show-dialog="dialogPartner"
      @activated="avtivatedPartner"
      @close="closeDialogPartner"
    />
  </div>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import CloseEsc from '@/components/modules/CloseEsc'
import ActivationPartnership from '@/components/modules/_views/partnership/activationPartnership'
import { dataBank as getDataBank } from '@/api/settlement'
import { profileUser, addBankAccount, fetchMasterpartner, getPartnerDetail } from '@/api/partner'
import { ShareNetwork } from 'vue-social-sharing'
export default {
  name: 'JoinPartner',
  components: {
    // WelcomePopup
    ShareNetwork,
    CloseEsc,
    ActivationPartnership
  },

  mixins: [basicComputedMixin],

  data() {
    return {
      loading: true,
      loadingSaveBank: false,
      loadingPartner: false,
      dataProfile: {},
      dialogEditBank: false,
      listBank: [],
      temp: {},
      dataPartner: [],
      visibleItem: [false, false],
      params: {
        per_page: 15
      },
      meta: {
        total: 0,
        page_size: 15,
        currentPage: 1
      },
      networkShare: [
        { network: 'whatsapp', name: 'Whatsapp', icon: 'fab fah fa-lg fa-whatsapp', color: '#25d366' },
        { network: 'facebook', name: 'Facebook', icon: 'fab fah fa-lg fa-facebook-f', color: '#1877f2' },
        { network: 'twitter', name: 'Twitter', icon: 'fab fah fa-lg fa-twitter', color: '#1da1f2' },
      ],
      showDetail: false,
      tempPartner: {},
      dialogPartner: false
    }
  },

  computed: {
    masterPartner () {
      let data = {}
      if (this.dataProfile.master_partner) {
        data = this.dataProfile.master_partner
        data.url_partner = 'https://www.olsera.com/id/pos/' + data.code.toLowerCase()
      }
      return data
    }
  },

  mounted() {
    this.getProfile()
    this.getDataBank()
    this.getDataPartner()
  },

  methods: {
    getProfile() {
      this.loading = true
      profileUser().then(response => {
        this.dataProfile = response.data.data
        if (!this.dataProfile.master_partner) {
          this.dialogPartner = true
        }
        this.loading = false
      }).catch(error => {
        this.dataProfile = {}
        this.loading = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    getDataBank() {
      this.loading = true
      let param = {
        per_page: 1000
      }
      getDataBank(param).then(response => {
        this.loading = false
        this.listBank = response.data.data
      }).catch(error => {
        this.loading = false
        this.$message({
          type: 'error',
          message: error.response.data.error.error
        })
      })
    },

    getDataPartner() {
      this.loadingPartner = true
      fetchMasterpartner(this.params).then(response => {
        this.dataPartner = response.data.data
        this.meta = {
          total: response.data.meta.total,
          page_size: response.data.meta.per_page,
          currentPage: response.data.meta.current_page
        }
        this.loadingPartner = false
      }).catch(error => {
        this.dataPartner = []
        this.loadingPartner = false
        if (error.response.data.error.status_code !== 404) {
          this.$notify({
            type: 'warning',
            title: error.response.data.error.message,
            message: error.response.data.error.error
          })
        }
      })
    },

    handleSearch () {
      this.getDataPartner()
    },

    handleEditBank () {
      this.temp = {
        bt_account_no: this.masterPartner.bt_account_no,
        bt_account_name: this.masterPartner.bt_account_name,
        bt_branch_code: this.masterPartner.bt_branch_code,
        bt_bank: this.masterPartner.bt_bank
      }
      this.dialogEditBank = true
    },

    selectBank (data) {
      if (data) {
        this.listBank.map(i => {
          if (i.name === data) {
            this.temp.bank_swift_id = i.id
          }
        })
      }
    },

    handleSaveBank () {
      this.loadingSaveBank = true
      addBankAccount(this.temp).then(response => {
        this.dataProfile = response.data.data
        this.temp = {}
        this.loadingSaveBank = false
        this.dialogEditBank = false
      }).catch(error => {
        this.dataProfile = {}
        this.loadingSaveBank = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleChangePage (val) {
      this.meta.currentPage = val
      this.params.page = val
      this.getDataPartner()
    },

    handleChangeSizePage (val) {
      this.params.per_page = val
      this.params.page = 1
      this.getDataPartner()
    },

    showData (args) {
      if (args === 'not_saved') {
        this.params.search_text = 0
        this.params.search_column = 'status_withdraw'
      } else if (args === 'saved') {
        this.params.search_text = 1
        this.params.search_column = 'status_withdraw'
      } else {
        this.$delete(this.params, 'search_text')
        this.$delete(this.params, 'search_column')
      }
      this.getDataPartner()
    },

    copyText(dataId) {
      var str = document.getElementById(dataId).innerHTML;
      const el = document.createElement('textarea');
      el.value = str;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.$notify({
        type: 'info',
        message: 'Berhasil copy text'
      })
    },

    openWa () {
      window.open(this.dataProfile.master_partner.share_link)
      // window.open('https://bit.ly/3r4sWZR')
      // window.open('https://bit.ly/3kiIbeD')
      // window.open('https://api.whatsapp.com/send/?phone=%2B6285282460670&text=Hi+Olsera%21+Saya+ingin+membagikan+calon+pengguna+sbb%0A%2ANama+%3A%2A%0A%2ANo.+Contact+%3A%2A%0A%2AKebutuhan+%3A%2A%0A%2AKode.+Referral+' + this.dataProfile.master_partner.code +'%2A&app_absent=0')
    },

    getDetailPartner (row) {
      this.loadingPartner = true
      console.log('partner', row.partner_id)
      getPartnerDetail(row).then(response => {
        this.tempPartner = response.data.data
        this.showDetail = true
        this.loadingPartner = false
      }).catch(error => {
        this.loadingPartner = false
        this.$notify({
          type: 'warning',
          title: error.response.data.error.message,
          message: error.response.data.error.error
        })
      })
    },

    handleClose () {
      this.showDetail = false
      this.tempPartner = {}
    },

    closeDialogPartner () {
      this.dialogPartner = false
      if (!this.dataProfile.master_partner) {
        this.$router.push({path: '/dashboard'})
      }
    },

    avtivatedPartner () {
        this.getProfile()
        this.getDataBank()
        this.getDataPartner()
        this.dialogPartner = false
      }
  }
}
</script>
