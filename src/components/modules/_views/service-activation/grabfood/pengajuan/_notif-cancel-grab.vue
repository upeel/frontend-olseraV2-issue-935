<template>
  <div v-if="show" class="color-warning--soft--bg p-8 radius-10 full-width">
    <div class="flex-container">
      <div class="container-icon font-16 font-bold color-warning--bg color-white radius-50 flex-container" style="width: 24px; height: 24px">X</div>
      <div class="px-8 font-14 full-width">Pengajuan integrasi GrabFood {{ data.activation_status === 'X'? 'dibatalkan' : data.activation_status === 'R'? 'ditolak' : ''}}</div>
      <div class="px-8 pointer" @click="show = false">X</div>
    </div>
    <!-- <div class="full-width text-right font-11 px-8">Batam, Jumat, 22 Oct 2020</div>
    <div v-if="!isCollapse" class="color-white--bg radius-5 font-14 flex-container p-16 pointer" style="height: 50px" @click="isCollapse = !isCollapse">
      <div class="wrap-text wrap-text--width">Mohon maaf Bapak Ogi. Dalam pengurusan pengajuan izin GrabFood yang diajukan pada Kamis, 12 Oct 2020, pukul 09.00 WIB dengan ID Merchant GrabFoo...</div>
    </div>
    <el-collapse-transition>
      <div v-show="isCollapse" class="color-white--bg radius-5 font-14 flex-container p-16">
        Mohon maaf Bapak Ogi. Dalam pengurusan pengajuan izin GrabFood yang diajukan pada Kamis, 12 Oct 2020, pukul 09.00 WIB dengan ID Merchant GrabFood 99011989, kami menemukan bahwa:
        <br> <br> 1. ID Merchant GrabFood 99011989 sudah tidak berlaku atau dinonaktifkan oleh pihak Grab dengan alasan sudah lama tidak digunakan (lebih dari 30 hari). 
        <br><br> Adapun hal yang kami anjurkan sebagai solusi isu ini sebagai berikut:
        <br><br> 1. Ajukan ulang dengan menggunakan ID Merchant GrabFood yang baru. Anda dapat melakukan pendaftaran ID baru di www.grabfood.com/merchant.
        <br> 2. Pengajuan ulang akan memakan waktu lebih lama dari pengajuan awal sesuai dengan aturan Grab yaitu sekitar 1 bulan.
        <br> 3. Kami tidak menjamin keberhasilan pengajuan ini. Mohon pastikan data yang Anda berikan dalam Form Pengajuan di Olsera benar dan sesuai dengan data Grab yang Anda miliki.
        <br><br> Terima kasih atas perhatian Bapak Ogi. Semoga tidak menjadi halangan Bapak untuk terus berkembang bersama kami. Salam hangat.
        <br><br> Tim Support Olsera.
      </div>
    </el-collapse-transition> -->
  </div>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
export default {
  name: 'NotifGrab',
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

  mixins: [basicComputedMixin],

  data() {
    return {
      isCollapse: false
    }
  }
}
</script>