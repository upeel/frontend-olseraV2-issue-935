<template>
  <div>
    <p>Pengaturan API Klien pada laman Blibli Seller perlu dilakukan untuk mengintegrasikan mengintegrasikan produk dan pesanan Blibli dengan toko Olseramu</p>
    <div class="font-16 font-semi-bold">
      1. Masuk ke laman Blibli Seller
    </div>
    <p>Lakukan pendaftaran akun Blibli Seller terlebih dahulu. Jika Anda telah memiliki akun, masuk dengan akun toko di Blibli Seller yang hendak diintegrasikan dengan tokomu di Olsera.</p>
    <p><a href="https://seller.blibli.com/" target="_blank">https://seller.blibli.com/</a></p>
    <div class="font-16 font-semi-bold">
      2. Kunjungi Pengaturan Seller API
    </div>
    <p>Setelah berhasil masuk, klik profil toko Anda pada pojok kanan atas laman. Kemudian pilih menu Pengaturan Seller API seperti yang terlihat pada gambar.</p>
    <p><lazy-image src="/static/img/service-activation/blibli/blibli-guide-2.png" lazy /></p>
    <div class="font-16 font-semi-bold">
      3. Salin Kata Sandi API
    </div>
    <p>Pada laman Pengaturan Seller API, tersedia Kata Sandi API berupa deretan huruf dan angka yang akan digunakan pada proses integrasi Blibli di toko Olsera. Jika belum Kata Sandi API belum tersedia, klik tombol "Buat Ulang".</p>
    <p>Salin Kata Sandi API tersebut, lalu tempel pada isian integrasi Blibli seperti terlihat pada gambar.</p>
    <p><lazy-image src="/static/img/service-activation/blibli/blibli-guide-3.png" lazy /></p>
    <div class="font-16 font-semi-bold">
      4. Hubungkan API Klien
    </div>
    <p>Masukkan ID API Klien Olsera <strong>(mta-api-olsera-a53aa)</strong> seperti yang terlihat pada gambar</p>
    <p><lazy-image src="/static/img/service-activation/blibli/blibli-guide-4.png" lazy /></p>
  </div>
</template>

<script>
  import LazyImage from '@/components/LazyImage'
  export default {
    components: {
      LazyImage
    }
  }
</script>
