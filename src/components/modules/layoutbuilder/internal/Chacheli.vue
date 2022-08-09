<template>
  <div class="chacheli" :style="style" @mousedown.left.prevent.stop="mousedown('drag', $event)">
    <div class="content-table" ref="content">{{ chacheli.text }}</div>
    <div v-if="checkCustomPermission('settings/posrestolayout', 'edit')" class="close" @click.prevent.stop="close" @mousedown.prevent.stop></div>
  </div>
</template>

<script>
import { checkCustomPermission } from '@/mixins/checkCustomPermission'
export default {
  name: 'chacheli',
  props: [ 'layout', 'chacheli', 'units' ],
  mixins: [checkCustomPermission],

  computed: {
    style() {
      return {
        top: (this.chacheli.y * this.units.v) + '%',
        left: (this.chacheli.x * this.units.h) + '%',
        width: (this.chacheli.w * this.units.h) + '%',
        height: (this.chacheli.h * this.units.v) + '%'
      }
    }
  },

  methods: {
    mousedown(name, e) {
      let outer = document.defaultView.getComputedStyle(this.$el)
      let inner = document.defaultView.getComputedStyle(this.$refs.content)
      this.$emit(name, {
        chacheli: this.chacheli,
        event: e,
        initialPos: {
          left: parseFloat(outer.getPropertyValue('left')) +
          parseFloat(outer.getPropertyValue('padding-left')) +
          parseFloat(outer.getPropertyValue('border-left-width')),
          top: parseFloat(outer.getPropertyValue('top')) +
          parseFloat(outer.getPropertyValue('padding-top')) +
          parseFloat(outer.getPropertyValue('border-top-width')),
          width: parseFloat(inner.getPropertyValue('width')),
          height: parseFloat(inner.getPropertyValue('height'))
        }
      })
    },

    close() {
      this.chacheli.available = true
      this.$emit('remove', this.chacheli)
    }
  }
}
</script>
