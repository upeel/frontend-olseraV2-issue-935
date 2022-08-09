<template>
  <el-dialog
    v-if="data"
    :visible.sync="show"
    :before-close="close">
    <div
      class="login-banner--card pointer">
      <div
        class="text-center"
        style="flex: 1;">
        <el-avatar
          :src="data.logo"
          :alt="data.name"
          :size="100"
        />
        <h5 class="color-body font-bold font-24 m-null">
          {{ data.name }}
        </h5>
        <div class="font-12 color-info mb-16">
          {{ data.role_name }}
        </div>
        <!-- <div>
          <el-progress :percentage="(data.remaining_active_days*100)/60" :show-text="false"></el-progress>
          <div class="text-left font-12 mt-8">Aktifkan toko dalam {{ data.remaining_active_days }} hari</div>
        </div> -->

        <div
          class="bg-f5 p-8 mt-8 radius-10 text-left font-14 color-body flex-container">
          <div>
            <div>Masa aktif dari toko anda sudah berakhir, silahkan melakukan perpanjangan aktifasi atau hubungi tim kami untuk bantuan</div>
          </div>
        </div>

        <div
          class="login-banner--card--footer radius-10" style="bottom: unset !important">
          <div class="flex-container">
            <div class="full-width pr-4">
              <el-button class="btn-block color-primary--soft--bg color-whatsapp--soft" @click="openWa">
                <svg-icon icon-class="whatsapp-logo" /> Whatsapp
              </el-button>
            </div>
            <div class="full-width pl-4">
              <el-button class="btn-block color-primary--soft--bg" style="color: #03A84E" @click="openTalktow">
                <svg-icon icon-class="message-circle" /> Live chat
              </el-button>
            </div>
            <!-- <a href="http://bit.ly/olseraofficial" target="_blank" class="font-bold">
              Hubungi Kami <svg-icon icon-class="external-link" />
            </a> -->
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },

  methods: {
    close() {
      this.$emit('close')
    },

    openWa () {
      window.open('http://bit.ly/olseraofficial')
    },

    openTalktow () {
      window.open('https://tawk.to/chat/5613725912c288fc1fd4ca94/default')
    }
  }
}
</script>
