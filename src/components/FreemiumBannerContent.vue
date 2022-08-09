<template>
  <div class="app-body custom-font">
    <div class="container-flex-fullpage">
      <div class="wrapper-card-premium-banner">
        <div
          :class="mode === 'dialog' || mode === 'tabs' ? 'card-premium-banner-mobile' : ''"
          class="card-premium-banner"
          style="margin-bottom: 12px;">
          <div>
            <div>
              <img width="42" src="/static/img/logo-olsera-premium.png" />
            </div>
            <div class="font-42">
              <strong>Olsera Basic & Premium</strong>
            </div>
          </div>

          <div class="font-16" style="font-family: sans-serif; word-break: keep-all;">
            {{ $lang[langId].olsera_premium_desc }}
          </div>
        </div>
        <div class="font-16 text-center link-blue" style="word-break: keep-all;">
          <p>{{ $lang[langId].olsera_premium_note }}</p>
          <p>{{ $lang[langId].olsera_premium_note_2 }} <span style="font-weight: bold">
            Rp 128.000</span> {{ $lang[langId].olsera_premium_note_3 }}
          </p>
          <a href="http://www.olsera.com/id/pricing">www.olsera.com/id/pricing</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['mode'],
  computed: {
    langId() {
      return this.$store.state.userStores.langId
    },
    lang() {
      return this.$store.state.userStores.lang
    },
    selectedStore () {
      return this.$store.getters.selectedStore
    }
  }
}
</script>
