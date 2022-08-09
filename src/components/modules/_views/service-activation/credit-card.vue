<template>
  <div class="shippings">
    <el-collapse v-model="collapse">
      <el-collapse-item name="1">
        <template slot="title">
          <label style="padding-left: 20px"> Cashlez </label>
        </template>
        <div style="margin-bottom: 20px; padding-left: 20px">
          <span>
            Cashlez adalah salah satu produk payment yang dapat Anda gunakan untuk melengkapi metode pembayaran yang dapat diproses oleh POS Anda.
          </span>
          <span>
              Pembayaran yang dapat diterima meliputi : kartu debit, kartu kredit Visa/Master, JCB, GPN & sebagainya.
          </span>
          <br>
          <span style={styles.textValue}>
              Untuk pemesanan alat Cashlez, silahkan hubungi tim marketing Olsera atau cek
              <a href="https://www.olsera.com/id/pricing">disini</a>
          </span>
          <br><br>
          <span >
            Untuk aktivasi fitur ini, silahkan mengikuti langkah-langkah di bawah:
          </span>
          <ol>
            <li>Download form pendaftaran <a href="http://bit.ly/formcashlez">disini</a></li>
            <li>Lengkapi form dan tandatangani.</li>
            <li>Upload formulir yang telah ditandatangani beserta dokumen-dokumen pelengkap <a href="http://bit.ly/uploadcashlez">disini</a></li>
          </ol>

          <span style="marginTop:8">
              Dokumen-dokumen yang dibutuhkan :
          </span>
          <ul>
            <li>Formulir pendaftaran merchant (di atas)</li>
            <li>Foto asli KTP atau KITAS atau Passport</li>
            <li>Foto NPWP</li>
            <li>Foto lokasi usaha</li>
            <li>Foto produk</li>
          </ul>
          <span>
            Informasi lebih detil, cek <a href="https://www.olsera.com/en/blog/solusi-pembayaran-non-tunai-dari-cashlez/92">disini</a>
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

