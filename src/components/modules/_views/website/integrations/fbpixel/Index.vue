<template>
  
    <div v-loading="loading">
      <el-card class="box-card">
        <div slot="header">
          <div class="row">
            <div class="col-md-4">
              <h4>{{ $lang[langId].facebook_pixel }}</h4>
            </div>
            <div class="col-md-8 text-right">
              <button-action-authenticated
                :permission="['website/facebookpixel', 'edit']"
                type="success"
                icon="el-icon-check"
                @click="save(data)">
                {{ lang.save }}
              </button-action-authenticated>
            </div>
          </div>
        </div>

        <div class="card-body">
          <el-form v-model="data" label-width="120px">
            <el-form-item :label="this.$lang[langId].app_id">
              <el-input type="text" v-model="data.fb_pixel_id"></el-input>
              <p class="size-12 input-desc oldgrey">
                {{ lang.info_facebook_pixel }}
              </p>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header">
          <span>{{ this.$lang[langId].how_to }}</span>
        </div>
        <div class="card-body">
          <div v-if="stageLevel === 'dash'">
            <el-steps direction="vertical">
              <el-step :title="this.$lang[langId].login_facebook" status="process">
                <div slot="description">
                  {{ this.$lang[langId].step_1_facebook_login }}
                </div>
              </el-step>
              <el-step :title="this.$lang[langId].go_to_facebook_dev" status="process">
                <div slot="description">
                  <ol>
                    <li>{{ this.$lang[langId].go_to_facebook_dev }}, https://developers.facebook.com/.</li>
                    <li>{{ this.$lang[langId].step_2_facebook_login }}</li>
                  </ol>
                </div>
              </el-step>
              <el-step :title="this.$lang[langId].change_logo_facebook" status="process">
                <div slot="description">
                  {{ this.$lang[langId].step_9_facebook_page }}
                  <p><img src="https://d2cp4rzo38etyi.cloudfront.net/admin/img/admin/help_fb_page_view.png"></p>
                </div>
              </el-step>
            </el-steps>
          </div>
          <div v-else>
            <el-steps direction="vertical">
              <el-step title="Sebelum memulai" status="process">
                <div slot="description">
                  <ol>
                    <li>Anda memerlukan situs web untuk bisnis Anda.</li>
                    <li>Anda harus bisa memperbarui kode situs web Anda.</li>
                  </ol>
                </div>
              </el-step>
              <el-step title="Membuat Facebook pixel" status="process">
                <div slot="description">
                  <ol>
                    <li>Buka Pengelola Peristiwa.</li>
                    <li>Klik 
                      <el-image style="width: 50px" src="https://scontent-sin6-1.xx.fbcdn.net/v/t39.8562-6/95556789_533797817286101_149898554813448192_n.png?_nc_cat=111&ccb=1-5&_nc_sid=6825c5&_nc_eui2=AeF5D2Qkopv6revKkavVcSfCkAfc27J0nCWQB9zbsnScJRV35_MGqjhL5B0J2x8ffUI&_nc_ohc=_LHEhYItPfoAX94DL1l&_nc_ht=scontent-sin6-1.xx&oh=4cad067a3ac83f67929b52a481a69f91&oe=612434E6"
                      /> <span class="font-bold">Hubungkan Sumber Data</span> dan pilih <span class="font-bold">Web.</span></li>
                    <li>Pilih <span class="font-bold">Facebook Pixel</span> dan klik <span class="font-bold">Hubungkan.</span></li>
                    <li>Tambahkan <span class="font-bold">Nama Pixel</span> Anda</li>
                    <li>Masukkan URL situs web Anda untuk memeriksa opsi penyiapan yang mudah</li>
                    <li>Klik Lanjutkan</li>
                  </ol>
                </div>
              </el-step>
              <el-step title="Menambahkan Facebook pixel ke situs web Anda" status="process">
                <div slot="description">
                  Setelah membuat pixel, Anda siap menempatkan kode Facebook pixel di situs web Anda. Untuk petunjuk tentang cara melakukannya, 
                  buka halaman facebook developers atau klik <span class="pointer font-bold color-primary" @click="openFb">link</span> berikut.
                </div>
              </el-step>
            </el-steps>
          </div>
        </div>
      </el-card>
    </div>
  
</template>

<script>
import { baseApi } from 'src/http-common'
import axios from 'axios'
import basicComputedMixin from '@/mixins/basicComputedMixin'
const apiEndPoint = 'facebookpixel'
export default {
  data() {
    return {
      loading: false,
      disabledSave: true,
      data: {}
    }
  },

  mixins: [basicComputedMixin],

  computed: {
    selectedStore() {
      return this.$store.getters.selectedStore
    },
    token() {
      return this.$store.state.user.token
    },
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    }
  },

  watch: {
    '$store.getters.selectedStore': function() {
      this.getData()
    },
    data: {
      handler(data) {
        if (data.fb_pixel_id && data.fb_pixel_id !== '') {
          this.disabledSave = false
        } else {
          this.disabledSave = true
        }
      },
      deep: true
    }
  },

  methods: {
    getData() {
      this.loading = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'GET',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        params: this.params,
        headers: headers
      }).then(response => {
        this.data = response.data.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        this.$notify({
          type: 'warning',
          title: 'Error',
          message: error.response.data.error.error
        })
      })
    },
    save(data) {
      this.loading = true
      this.disabledSave = true
      let headers = {
        Authorization: 'Bearer ' + this.token.access_token
      }

      axios({
        method: 'POST',
        url: baseApi(this.selectedStore.url_id, this.langId, apiEndPoint),
        data,
        headers
      }).then(response => {
        this.data = response.data.data
        this.loading = false
        this.disabledSave = false
        this.$message({
          type: 'success',
          message: 'Saved'
        })
      }).catch(error => {
        this.loading = false
        this.disabledSave = false
        this.$notify({
          type: 'warning',
          title: 'Error',
          message: error.response.data.error.error
        })
      })
    },

    openFb () {
      window.open('https://www.facebook.com/business/help/952192354843755?id=1205376682832142&recommended_by=218844828315224')
    }
  },

  mounted() {
    this.getData()
  }
}
</script>
