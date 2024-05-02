<template>
  <div :data-index="index" class="tinder-card" :style="[{ zIndex: 100 - index }, style]" @transitionend="transitionEnd">
    <slot></slot>
    <slot name="nope"></slot>
    <slot name="like"></slot>
    <slot name="super"></slot>
    <slot name="down"></slot>
    <transition name="tinder-rewind">
      <slot name="rewind" v-if="scopedRewind !== false"></slot>
    </transition>
  </div>
</template>

<script>
import { STATUS } from './status'

export default {
  name: 'TinderCard',
  props: {
    // To prevent overlapping of tinder-cards due to unapplied styles before vue-tinder is fully initialized
    tinderMounted: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      required: true
    },
    ready: {
      type: Boolean,
      default: false
    },
    state: {
      type: Object,
      required: true
    },
    ratio: {
      type: Number,
      default: 0
    },
    rewind: {
      type: [Number, Boolean],
      default: false
    },
    scaleStep: {
      type: Number,
      required: true
    },
    offsetY: {
      type: Number,
      required: true
    },
    offsetUnit: {
      type: String,
      required: true
    }
  },
  data: () => ({
    inited: false,
    scopedRewind: false,
    willDestory: false
  }),
  computed: {
    // Current scale size
    curScale() {
      return this.scaleStep * this.index
    },
    /**
     * Whether it is the current card
     * @param  {Number}  index Card index
     * @return {Boolean}       true/false
     */
    isCur() {
      return this.index === 0
    },
    style() {
      if (!this.inited) {
        return {}
      }
      // Use the change of inited to override the style set in beforeEnter
      const status = this.state.status
      if (status === STATUS.MOVING) {
        return this.movingStyle
      } else {
        return this.normalStyle
      }
    },
    normalStyle() {
      if (this.isCur) {
        return {
          opacity: 1,
          transform: `translate3d(0,0,0) rotate(0) scale3d(1,1,1)`,
          transition: `all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275), z-index 0s`
        }
      }
      return {
        opacity: this.ready ? 0 : 1,
        transform: this.getTransform(),
        transition: `all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) ${this.scopedRewind ? this.scopedRewind * 80 : 0
          }ms, z-index 0s` // Transition of an item being rewound should match the main card
      }
    },
    movingStyle() {
      const style = { transition: 'none' }
      if (this.isCur) {
        // During movement, displacement and rotation angle
        const state = this.state
        const { start, move, startPoint } = state
        const x = move.x - start.x || 0
        const y = move.y - start.y || 0
        // Standard state when sliding card halfway width (0.5)
        const rotate = 10 * this.ratio * startPoint
        style['transform'] = `translate3d(${x}px,${y}px,0) rotate(${rotate}deg)`
      } else {
        let ratio = Math.abs(this.ratio)
        if (ratio > 1) {
          ratio = 1
        }
        if (this.ready) {
          style['opacity'] = ratio * 1
        }
        style['transform'] = this.getTransform(ratio)
      }
      return style
    }
  },
  watch: {
    index(val, oldVal) {
      // Transitioning from originally needing rewind to a new target position, no delay needed
      // If level is elevated and needs to be hidden, prevent the flashing bug from quick operations
      if (val < oldVal) {
        this.scopedRewind = false
      }
    }
  },
  created() {
    this.scopedRewind = this.rewind
    if (!this.tinderMounted) {
      this.inited = true
    }
  },
  mounted() {
    // Must wrap in requestAnimationFrame to ensure it executes after beforeEnter
    requestAnimationFrame(() => {
      this.inited = true
    })
  },
  methods: {
    // Return to original position, can reset vue-tinder state
    transitionEnd(e) {
      if (e.target === e.currentTarget && e.propertyName === 'transform') {
        // Need to hide rewind slot after returning to position
        this.scopedRewind = false
        if (this.isCur) {
          const status = this.state.status
          if (status === STATUS.REVERT || status === STATUS.REWINDING) {
            this.$emit('reverted')
          }
        }
      }
    },
    getTransform(ratio) {
      const index = this.index
      let translateY = 0
      let scale = 1 - this.scaleStep * index
      if (ratio) {
        scale += ratio * this.scaleStep
      }
      if (this.offsetY) {
        const inverse = this.offsetY < 0
        const offsetY = Math.abs(this.offsetY)
        let y = index * offsetY
        let offsetScale = ((1 - scale) / 2) * 100
        if (ratio) {
          y -= ratio * offsetY
        }
        if (inverse) {
          y *= -1
          offsetScale *= -1
        }
        translateY = `calc(${offsetScale}% + ${y}${this.offsetUnit})`
      }
      return `translate3d(0,${translateY},0) scale3d(${scale},${scale},1)`
    }
  }
}
</script>

<style scoped>
.tinder-card {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fefefe;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.tinder-rewind-leave-active {
  transition: all 0.5s ease;
}

.tinder-rewind-leave-to {
  opacity: 0;
}
</style>
