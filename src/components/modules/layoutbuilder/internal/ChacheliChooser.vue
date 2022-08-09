<template>
  <div class="chacheli-chooser">
    <div class="inner">
      <template v-for="(c, idx) in chachelis">
        <div v-if="c.available" class="chacheli-outer" :key="c.id">
          <div
            :class="{ dragging: dragging.active && idx === dragging.index }"
            class="chacheli"
            @mousedown.left.prevent.stop="mousedown(idx, $event)">
            {{ c.text }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chacheli-chooser',
  props: [ 'chachelis', 'dragging' ],

  methods: {
    mousedown(idx, e) {
      let cs = document.defaultView.getComputedStyle(e.target)
      let bounds = e.target.getBoundingClientRect()

      this.dX = bounds.left - e.clientX
      this.dY = bounds.top - e.clientY

      this.dragElement = e.target
      this.dragElement.style.width = parseFloat(cs.width) + 'px'
      this.dragElement.style.height = this.dragElement.parentElement.style.height = parseFloat(cs.height) + 'px'

      this.dragMove(e)

      document.documentElement.addEventListener('mousemove', this.dragMove, false)
      document.documentElement.addEventListener('mouseup', this.dragStop, false)
      document.documentElement.addEventListener('keydown', this.keyDown, false)

      this.dragging.active = true
      this.dragging.cancelled = false
      this.dragging.index = idx
    },

    keyDown(e) {
      if (e.keyCode === 27) {
        this.dragging.cancelled = true
        this.dragStop()
      }
    },

    dragMove(e) {
      this.dragElement.style.left = (e.clientX + this.dX) + 'px'
      this.dragElement.style.top = (e.clientY + this.dY) + 'px'
    },

    dragStop() {
      document.documentElement.removeEventListener('mousemove', this.dragMove, false)
      document.documentElement.removeEventListener('mouseup', this.dragStop, false)
      document.documentElement.removeEventListener('keydown', this.keyDown, false)

      this.dragElement.parentElement.removeAttribute('style')
      this.dragElement.removeAttribute('style')
      this.dragElement = null

      this.dragging.active = false
    }
  }
}
</script>
