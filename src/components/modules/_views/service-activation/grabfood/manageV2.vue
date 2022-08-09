<template>
  <page-fullscreen
    title="Grabfood"
    class="page-fullscreen-blibli"
    @close="$router.push({ path: '/service-activation-v2' })">
    <template #sticky-top>
      <div class="panel tab-list" style="padding-left: unset !important; margin-top: -12px">
        <ul class="nav-tabs-shop-devin" role="tablist">
          <li>
            <router-link :to="{ path: '/service-activation-v2/grabfood/manage/menu' }">
              {{ rootLang.menu }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ path: '/service-activation-v2/grabfood/manage/promotions' }">
              {{ rootLang.promotions }}
            </router-link>
          </li>
          <li >
            <router-link :to="{ path: '/service-activation-v2/grabfood/manage/resto' }">
              {{ rootLang.opening_hours }}
            </router-link>
          </li>
        </ul>
      </div>
    </template>
    <section v-loading="loading">
      <router-view :data-grab-food-id="dataGrabFoodId" :is-pause="isPause"></router-view>
    </section>
  </page-fullscreen>
</template>
<script>
import basicComputedMixin from '@/mixins/basicComputedMixin'
import { fetchByStore as fetchGrabfoodStore } from '@/api/thirdParty/grabfood'
import PageFullscreen from '@/components/layouts/PageFullscreen.vue'
export default {
  name: 'ManageGrabfood',

  components: {
    PageFullscreen
  },

  mixins: [basicComputedMixin],

  computed: {
    accessByStore () {
      return ['setdemo', 
        'setdemo1', 
        'allinolsera2',
        'teleponaku', 
        'kopisenandung', 
        'basooodj', 
        'mrbread777222',
        'suasikocoffeeandspace',
        'latifcafe',
        'virtualkitchenbali',
        'howiecafe',
        'pena',
        'crispykuchickenenak',
        'scandichouse',
        'indcoffeeandtea',
        'morningstar',
        'kopi1815bdj',
        'terminalngopi',
        'howiecafe',
        'pena',
        'wizenayambakarpenyet',
        'obatlaper',
        'rotipenyetbangka',
        'asokaresto',
        'rumahkopiplazgozz']
    },
  },

  data () {
    return {
      dataGrabFoodId: '',
      isPause: 0,
      loading: false
    }
  },

  mounted () {
    this.handleGetGrabfoodStore()
  },

  watch: {
    '$store.getters.selectedStore'() {
      this.getTest()
    }
  },
  methods: {
    handleGetGrabfoodStore(data) {
      this.loading = true
      fetchGrabfoodStore().then(response => {
        if (response.data.data.group_menu.length) {
          this.dataGrabFoodId = response.data.data.id
          this.isPause = response.data.data.isPause
        } else {
          this.$router.push('/service-activation-v2')
        }
        this.loading = false
      }).catch(() => {
        this.grabfoodData = {}
        this.loading = false
      })
    },
  }
}
</script>
