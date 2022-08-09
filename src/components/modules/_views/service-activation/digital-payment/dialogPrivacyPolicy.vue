<template>
  <el-dialog
    :visible.sync="show"
    :before-close="closePrivacy"
    :show-close="false"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    class="dialog-mdr">
    <div slot="title" class="row">
      <div class="col-lg-7 col-md-8 col-sm-8 col-xs-12">
        <h4 class="dialog-title full-width">
          <img src="/static/img/service-activation/ovo.png" style="height: 30px; border-radius: 5px;"/>
          Syarat & Ketentuan Merchant OVO
        </h4>
      </div>
      
      <div class="col-lg-5 col-md-4 col-sm-4 col-xs-12 btn_save_dialog text-right">
        <el-button type="info" @click="closePrivacy">{{ rootLang.disagree }}</el-button>
        <el-button type="primary" :disabled="disableAgree" :loading="loading" @click="acceptTermCondition">{{ rootLang.agree }}</el-button>
      </div>
    </div>
    <perfect-scrollbar @ps-y-reach-end="handleScrollTerm" class="scrollterm">
      <h4><b>Syarat Dan Ketentuan Merchant</b></h4>
      <p style="word-break: break-word;">
        Syarat dan Ketentuan Merchant ini, selanjutnya untuk kemudahan referensi akan disebut <b>"Perjanjian"</b> dan diatur serta tunduk 
        pada hukum yang berlaku di Republik Indonesia, disepakati oleh dan antara:
      </p>
      <span class="word-break list-term-commonwealth">
        <ol class="pl-20">
          <li><b>PT Visionet Internasional</b> adalah suatu perseroan terbatas yang didirikan berdasarkan hukum 
            Negara Republik Indonesia, yang merupakan penerbit uang elektronik berbasis server yang telah memperoleh 
            izin dari Bank Indonesai berdasarkan Surat Badan Hukum, untuk selanjutnya disebut sebagai <b>"OVO"</b>; dan
          </li>
          <li>
            Merchant adalah pihak yang telah mengajukan pendaftaran untuk menjadi <b>"Merchant"</b> dengan menyerahkan data dan informasi yang dibutuhkan, 
            di mana OVO telah memberikan persetjuan atas pendaftaran yang diajukan dan memberikan persetujuan untuk Kerja Sama Penerimaan Transaksi yang diatur dalam 
            Perjanjian ini.
          </li>
        </ol>
        OVO dan Merchant masing-masing dapat disebut sebagai <b>"Pihak"</b> dan secara bersama-sama disebut sebagai <b>"Para Pihak"</b>.<br>
        <b>Pendahuluan</b><br>
        Pelaksanaan atas Kerja Sama Penerimaan Transaksi <b>("Kerja Sama")</b> ini tunduk terhadap syarat dan ketentuan dalam Perjanjian ini.<br>
        <b>Pasal 1 : Definisi</b>
        <ol class="pl-25">
          <li><b>"Dana Settlement"</b> adalah nilai Dana Transaksi yang telah dipotong dengan MDR.</li>
          <li><b>"Dana Transaksi"</b> adalah dana yang dihasilkan dari setiap Transaksi yang berhasil dilakukan.</li>
          <li><b>"Data Pelanggan"</b> adalah setiap informasi yang melekat dan dapat diidentifikasi, baik langsung maupun tidak langsung, pada masing-masing Pelanggan, 
            termasuk; data pribadi milik Pelanggan dan data atas Transaksi yang mengandung identifikasi Pelanggan.
          </li>
          <li><b>"Deployment"</b> adalah serangkaian kegiatan yang akan dilaksanakan agar Merchant dapat melakukan penerimaan Transaksi dan Pelanggan dapat melakukan 
            Transaksi pembelian Produk Merchan. Kegiatan Deployment mencakup; penghubungan sistem dan/atau pemasangan Perangkat.
          </li>
          <li><b>"GRAB"</b> adalah PT Grab Teknologi Indonesia dan/atau perusahaan-perusahaan lainnya yang merupakan afiliasi yang diakui dari PT Grab Teknologi 
            Indonesia.
          </li>
          <li><b>"Layanan Grab"</b> adalah layanan yang diberikan oleh GRAB kepada Merchant dalam bentuk Kerja Sama Grab yang memungkinkan Merchant untuk menerima 
            pemesanan Produk melalui platform GRAB dan layanan pengantaran Produk ke Pelanggan, GRAB akan menghubungkan mitra GRAB (sehubungan dengan layanan pemesanan, 
            pengambilan dan pengantaran Produk) dan Merchant (sehubungan denagn layanan penjualan Produk) dengan Pelanggan, sehingga Pelanggan dapat melakukan pemesanan 
            atas Produk yang disediakan, dijual, dan/atau ditawarkan oleh Merchant dan diantarkan oleh mitra Grab.
          </li>
          <li><b>"Hari Kerja"</b> adalah hari kerja mulai dari Senin sampai Jumat, tidak termasuk Sabtu, Minggu, dan hari libur nasional yang ditetapkan oleh Pemerintah 
            Republik Indonesia.
          </li>
          <li><b>"Informasi Rahasia"</b> adalah seluruh data dan/atau informasi, baik yang diberikan keterangan sebagai suatu "rahasia" atau pada sifatnya sewajarnya 
            diperlukan sebagai suatu rahasia, termasuk namun tidak terbatas pada, informasi atau data yang:
            <ol type="a" class="pl-20">
              <li>berfat rahasia dan timbul atau dihasilkan dari pelaksanaan Perjanjian ini;</li>
              <li>diserahkan oleh satu Pihak kepada Pihak lainnya untuk tujuan Perjanjian ini;</li>
              <li>yang sensitif terkait dengan produk layanan, rahasia perusahaan, atau kegiatan usaha dari masing-masing Pihak; dan/atau</li>
              <li>tersimpan dalam sistem penyimpanan masing-masing Pihak.</li>
            </ol>
          </li>
          <li><b>"Keadaan Kahar"</b> adalah keadaan atau kondisi perang (apakah dinyatakan atau tidak), kegiatan militer, sabotase, kekerasan, kerusuhan sosial, pemogokan, 
            wabah (termasuk wabah virus corona (COVID-19)), epidemic, kecelakaan, kebakaran, banjir, bencana alam, embargo, alasan hukum, atau tindakan pemerintah Republik 
            Indonesia, dan kondisi/keadaan serupa lainnya yang dapat terjadi di luar kemampuan Para Pihak untuk mencegahnya.
          </li>
          <li><b>"Kerja Sama Penerimaan Transaksi"</b> atau <b>"Kerja Sama"</b> adalah kerja sama antara OVO dan Merchant untuk membuat Merchant untuk dapat menerima Transaksi 
            pada atau melalui Toko.
          </li>
          <li><b>"Laporan Settlement"</b> adalah laporan yang dibuat dan dipersiapkan oleh OVO berdasarkan pencatatan Transaksi yang dilakukan oleh OVO, laporan tersebut 
            berisikan nilai nominal Dana Transaksi, Dana Settlement, dan MDR dari Transaksi yang terjadi pada suatu hari.
          </li>
          <li><b>"Kerja Sama Grab"</b> adalah kerja sama yang dibuat oleh dan antara GRAB dengan Merchant baik yang dibuat secara tertulis, verbal, ataupun dengan dengan cara 
            lain yang diakui oleh peraturan perundang-undangan yang berlaku, mengenai penyediaan suatu layanan, pemasaran, ataupun hal-hal lainnya sebagaimana disepakati oleh 
            dan antara GRAB dan Merchant dari waktu ke waktu.
          </li>
          <li><b>"Merchant Discount Rate"</b> atau <b>"MDR"</b> adalah sejumlah tarif dalam persentase yang dikenakan kepada Merchant ata pemrosesan Transaksi. Persentase MDR 
            yang disepakati oleh Para Pihak adalah sebagaimana diinformasikan oleh OVO kepada Merchant pada saat proses pendaftaran Merchant dalam Kerja Sama ini atau pada 
            saat lainnya sebagaimana diterapkan oleh OVO dari waktu ke waktu.
          </li>
          <li><b>"Pelanggan"</b> adalah pengguna OVO Payment yang juga merupakan pelanggan Merchant.</li>
          <li><b>"OVO Merchant App"</b> adalah mobile application yang dikembangkan, dikelola, dan dimiliki oleh OVO untuk memfasilitasi Merchant dalam pelaksanaan Kerja Sama.</li>
          <li><b>"OVO Payment"</b> adalah suatu fitur pembayaran elektronik non-tunai dengan menggunakan instrumen pembayaran yang tersedia daripada, yang diciptakan, dikembangkan, 
            dimiliki, dan dikelola oleh OVO yang dapat digunakan oleh Pelanggan untuk melakukan pembayaran, instrument pembayaran yang dimaksud dalam hal ini adalah uang elektronik 
            berbasis server yang diterbitkan dan dikelola oleh OVO yaitu "OVO Cash".
          </li>
          <li><b>"Penyalahgunaan Transaksi"</b> adalah penerimaan Transaksi atau pelaksanaan Transaksi yang;
            <ol type="a" class="pl-20">
              <li>pelaksanaannya merupakan pelanggaran atas Perjanjian ini atau pelanggaran atas peraturan perundang-undangan yang berlaku atau dapat berpotensi melanggar peraturan 
                perundang-undangan yang berlaku; dan/atau
              </li>
              <li>menyebabkan kerugian atau dapat berpotensi menyebabkan kerugian kepada OVO, termasuk namun tidak terbatas pada Transaksi yang;</li>
              <li>yang sensitif terkait dengan produk, layanan, rahasia perusahaan, atau kegiatan usaha dari masing-masing Pihak; dan/atau
                <ol type="i" class="pl-20">
                  <li>merupakan Transaksi palsu atau fiktif, tanpa adanya perpindahan barang atau jasa dari Merchant ke Pelanggan atau dilakukan secara internal antara Merchant dengan 
                    karyawan, agen, atau perwakilannya; dan/atau
                  </li>
                  <li>dilakukan dengan mengganggu, merusak, mengelabui, dan/atau memanfaatkan kekurangan sistem OVO.</li>
                </ol>
              </li>
            </ol>
          </li>
          <li><b>"Perangkat"</b> adalah perangkat keras dan/atau perangkat lunak termasuk namun tidak terbatas pada; reader/scanner device, dan/atau dalam bentuk lainnya (termasuk 
            sticker quick response code/kode QR) yang dipinjamkan oleh OVO kepada Merchant untuk memfasilitasi Merchant dalam menerima Transaksi.
          </li>
          <li><b>"Produk"</b> adalah barang dan/atau jasa yang diperbolehkan secara hukum untuk ditawarkan, dijual, dan/atau disediakan oleh Merchant.</li>
          <li><b>"Refund"</b> adalah pengembalian saldo OVO Cash dan/atau OVO Points yang telah ditukarkan oleh Pelanggan, kepada Palanggan karena terjadinya pembatalan suatu Transaksi.</li>
          <li><b>"Toko"</b> adalah lokasi fisik dan/atau platform digital seperti; website ataupun mobile aplication yang digunakan oleh Merchant untuk menawarkan, menjual, dan/atau 
            menyelesaikan Produk.
          </li>
          <li><b>"Transaksi"</b> adalah transaksi pembayaran non-tunai atas pembelian Produk yang dilakukan oleh Pelanggan dengan menggunakan OVO Payment atau dengan pertukaran OVO Points.</li>
          <li><b>"Waktu Cut Off"</b> adalah batas waktu akhir pencatatan Transaksi oleh OVO yang dilakukan pada suatu hari yaitu pada pukul 23.59 Waktu Indonesia Barat.</li>
        </ol>
      </span>
    </perfect-scrollbar>
  </el-dialog>
</template>

<script>
import basicComputedMixin from '@/mixins/basicComputedMixin';

export default {
  name: 'digiPayPrivacyPolicy',
  mixins: [basicComputedMixin],

  props: {
    show: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data(){
    return{
      disableAgree: true,
    }
  },

  methods: {
    acceptTermCondition(){
      this.$emit('submit')
    },

    closePrivacy(){
      this.$emit('close')
    },

    handleScrollTerm () {
      this.disableAgree = false
    },
  }
}
</script>