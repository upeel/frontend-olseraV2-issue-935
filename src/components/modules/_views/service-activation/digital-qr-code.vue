<template>
  <div class="shippings">
    <el-collapse v-model="collapse">
      <el-collapse-item name="1">
        <template slot="title">
          <label style="padding-left: 20px"> GoPay </label>
        </template>
        <div style="margin-bottom: 20px; padding-left: 20px">
          <span>
            Tingkatkan Transaksi Toko Anda dengan Kemudahan Pembayaran dari GO-PAY
          </span>
          <span>
              Dengan kehadiran pilihan pembayaran GO-PAY di Point of Sale yang kini dapat digunakan oleh para merchant, diharapkan meningkatkan transaksi di outlet Anda,
          </span>
          <span>sekaligus menghadirkan kemudahan, kenyamanan dan user experience yang lebih baik kepada para pelanggan yang berbelanja.</span>
          <br>
          <span>Kini proses pendaftaran lebih mudah bersama Olsera POS. Silahkan mengikuti langkah-langkah di bawah ini, tim Olsera akan membantu Anda lebih lanjut:</span>
          <ol>
            <li>Lengkapi dan tandatangani Form Registrasi yang dapat Anda unduh <a href="http://bit.ly/formgopay">disini</a></li>
            <li>Upload form yang telah Anda tandatangani beserta kelengkapan dokumen yang dibutuhkan (KTP & NPWP) <a href="http://bit.ly/uploadgopay">disini</a> 
            <span> Untuk registrasi rekanan Badan Usaha, kirimkan beserta dokumen badan usaha Anda. Detil dapat Anda lihat di form registrasi.</span>
            </li>
            <li>Setelah verifikasi dari kami, Anda akan diminta untuk mengirimkan hardcopy formulir dan dokumen di atas ke kantor Olsera untuk diteruskan ke GO-PAY dan mengkonfirmasi aktivasi akun merchant GO-PAY Anda.</li>
          </ol>

          <span>
            Untuk informasi lebih detil untuk fitur pembayaran GO-PAY, silahkan cek <a href="https://www.olsera.com/id/blog/tingkatkan-transaksi-toko-anda-dengan-kemudahan-pembayaran-dari-go-pay/131">disini</a>
          </span>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <label style="padding-left: 20px"> OVO </label>
        </template>
        <div style="margin-bottom: 20px; padding-left: 20px">
          <span>
            Aktivasi segera layanan populer dari OVO untuk mendukung pilihan pembayaran di POS Anda.
          </span>
          <span>
              Terima pembayaran digital hanya cukup memasukkan nomor handphone dari pelanggan yang telah terhubung ke akun OVO point mereka, dan berpartisipasi dalam berbagai program promo Cash Back dari OVO.
          </span>
          <span>Untuk aktivasi fitur payment OVO di POS Anda, ikuti langkah-langkah berikut ini, silahkan mengisi formulir pendaftaran <a href="https://goo.gl/forms/fJHUHGDVOWQYWT4K2">disini</a></span>
          <br>
          <span>Dokumen-dokumen yang perlu disiapkan dan diupload saat mengisi formulir mencakup:</span>
          <ol>
            <li>Logo usaha</li>
            <li>Foto outlet/toko</li>
            <li>Foto KTP</li>
            <li>Foto NPWP</li>
          </ol>
          <span>*Dokumen pelengkap lainnya mungkin dibutuhkan apabila Anda menjalankan badan usaha.</span>
          <br>
          <span>
            Informasi lebih detil untuk layanan OVO, silahkan cek <a href="https://www.olsera.com/en/blog/olsera-pos-kini-mendukung-solusi-digital-payment-dari-ovo/93">disini</a>
          </span>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>

export default {
  components: {
    // Domestic,
    // International,
    // Free
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
    }
  },
  watch: {
    '$store.getters.selectedStore': function () {
      this.getTest()
    }
  },
  methods: {
    getTest() {
      console.log('test', '')
    }
  }
}
</script>

