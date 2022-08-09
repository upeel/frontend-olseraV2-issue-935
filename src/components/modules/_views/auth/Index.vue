<template>
  <div>
    Please wait...
  </div>
</template>

<script>
export default {
  mounted() {
    // lava
    // eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY0M2NkYmI0OGVjNWQ3MzQxYzhmNTFlNTk5NzI0MGVhMjM5NDFmZDQ4NTUwZjA3MmNiYWYwMjQ1OWM1YTY5MmVjMzBkZjAwYjEyY2VmM2RjIn0.eyJhdWQiOiIyIiwianRpIjoiNjQzY2RiYjQ4ZWM1ZDczNDFjOGY1MWU1OTk3MjQwZWEyMzk0MWZkNDg1NTBmMDcyY2JhZjAyNDU5YzVhNjkyZWMzMGRmMDBiMTJjZWYzZGMiLCJpYXQiOjE2MDM4NTY5NTcsIm5iZiI6MTYwMzg1Njk1NywiZXhwIjoxNjA2NDQ4OTU3LCJzdWIiOiIxNzE5NDQiLCJzY29wZXMiOltdfQ.YnxfEHdVAaN46DW-gzSWluL3Pm-jaYEOwKKRUEWZfezi1926IFRcJCtsddPAKw-uyOAIbdCU4z6XGBOCAam1XGHXCAbRakmGpHPHCIPsmV8ghJFZOqDwe64hGAvEb7GRhaPfqnKmQ7VUH6j9bK1bNulfspaV3pDr_ag-z3Fb51UGaRQ4NljO2DztCGWKyc6zeV882_N9V6a5y-HnPaxrBWnbgWIC1L0W0neUSU7YLImaPxTklLkCoYitV_9yUT4Bxm99ie4JJ4ZRbxUA0kfVhLOgVamdaYF2W5Z4UqNmmuqxneXwF0bwd6VYUrm47z8my-Yx8gGxbN_K0MSKY5iNaEm8Ba-SXEQQ0bbwBvtKeo4WY8bq5qC0F0BxDHHCOVjSR9hv13CA2Pl8oVXPfSW9mAVhCtBWwpr4GCZlKuTs1dzoYI1-sy34_HIPGUyTdRSeUROEyPl7FAYkMKH1TG8uy43IPk4YmDYjfi2GBsSxJE_L0UnyUiRu8O-P7jVIwWqyZf2SkD_QksgQZl5z2o0kp2jaDKh0h1-AzXy0Bitinl3XFodKt5Nx8UcBbhrx_bDmfI3X3wOkn0yIUCCxdb4x1C3aUR7L_66L2G5QhoElGtVJ9qzSZ4at9aP0er4piIgdn7OilY97ds7a4c_n2J_SveTsa-edunCTcMovu2KmTfM
    // 75562

    this.$store.commit('REMOVE_LOGIN_DATA')
    this.$store.commit('REMOVE_TOKEN')
    this.$store.commit('REMOVE_SELECTED_STORE')
    localStorage.clear()
    if (this.$route.query.access_token && this.$route.query.store_id) {
      localStorage.setItem('olsbo_authstoreid', parseInt(this.$route.query.store_id))
      this.$store.commit('SET_TOKEN', {
        access_token: this.$route.query.access_token,
        token_type: 'Bearer',
        expires_in: 2591999
      })
      if (this.$route.query.new_user === 1) {
        this.$store.dispatch('setNewUser', true)
      }
      // this.$router.push('/')
    } else {
      this.$router.push('/login')
    }
  }
}
</script>
