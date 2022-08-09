<template>
  <offscreen
    :show="show"
    hide-footer
    hide-esc
    title="Langkah-Langkah Pengaturan API Klien"
    @close="handleClose">
    <el-form
      label-position="top"
      class="mb-12"
      @submit.native.prevent>
      <el-form-item label="Topic">
        <el-select
          class="w-fit"
          v-model="selectedTopic">
          <el-option
            v-for="(topic, key) in topics"
            :key="key"
            :value="topic.id"
            :label="topic.label"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <integration-guide-one v-if="selectedTopic === 1" />
    <integration-guide-two v-if="selectedTopic === 2" />
  </offscreen>
</template>

<script>
import Offscreen from '@/components/Offscreen'
import IntegrationGuideOne from './integrationGuideOne.vue'
import IntegrationGuideTwo from './integrationGuideTwo.vue'
export default {
  components: {
    Offscreen,
    IntegrationGuideOne,
    IntegrationGuideTwo
  },

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      selectedTopic: 1,
      topics: [
        {
          id: 1,
          label: 'Pengaturan API Klien'
        },
        {
          id: 2,
          label: 'ID Toko dan Kode Toko'
        }
      ]
    }
  },

  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
