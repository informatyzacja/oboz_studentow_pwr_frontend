<template>
  <TransitionGroup class="vue-tinder" tag="div" :css="false" @beforeEnter="beforeEnter" @leave="leave"
    @touchstart="start" @touchmove="move" @touchend="end" @touchcancel="end" @mousedown="start" @mousemove="move"
    @mouseup="end">
    <div v-for="(item, index) in list" :key="item.$vtKey || item[keyName]">
      <TinderCard v-if="index < max + 1" :ready="index === max" :data-id="item.$vtKey || item[keyName]" :index="index"
        :state="state" :ratio="ratio" :rewind="rewindKeys.indexOf(item.$vtKey || item[keyName]) > -1 ? index : false"
        :tinder-mounted="tinderMounted" :scale-step="scaleStep" :offset-y="offsetY" :offset-unit="offsetUnit"
        @reverted="resetStatus">
        <slot :data="item" :index="index" :status="status"></slot>
        <template v-if="index === 0 && status !== 2">
          <span slot="nope" class="pointer-wrap nope-pointer-wrap" :style="{ opacity: nopeOpacity }">
            <slot name="nope" :opacity="nopeOpacity"></slot>
          </span>
          <span slot="like" class="pointer-wrap like-pointer-wrap" :style="{ opacity: likeOpacity }">
            <slot name="like" :opacity="likeOpacity"></slot>
          </span>
          <span v-if="allowSuper" slot="super" class="pointer-wrap super-pointer-wrap"
            :style="{ opacity: superOpacity }">
            <slot name="super" :opacity="superOpacity"></slot>
          </span>
          <span v-if="allowDown" slot="down" class="pointer-wrap down-pointer-wrap" :style="{ opacity: downOpacity }">
            <slot name="down" :opacity="downOpacity"></slot>
          </span>
        </template>
        <!-- The rewind indicator does not need to be the first card, it will be judged internally when to display -->
        <span v-if="state.status === 4" slot="rewind" class="pointer-wrap rewind-pointer-wrap">
          <slot name="rewind"></slot>
        </span>
      </TinderCard>
    </div>
  </TransitionGroup>
</template>

<script>
import TinderCard from './TinderCard.vue'
import queueHandle from './queue-handle'
import touchEvent from './touch-event'
import transitionEvent from './transition-event'
import openMethods from './open-methods'
import { initStatus } from './status'

let resizeTimer

export default {
  mixins: [queueHandle, touchEvent, transitionEvent, openMethods],
  components: {
    TinderCard
  },
  emits: ['update:queue', 'reverted', 'submit'],
  props: {
    // TODO: Consider adding a configuration that does not enforce rendering
    allowSuper: {
      type: Boolean,
      default: true
    },
    allowDown: {
      type: Boolean,
      default: false
    },
    queue: {
      type: Array,
      default: () => []
    },
    keyName: {
      type: String,
      default: 'key'
    },
    /**
     * When moving horizontally until disappearance, the ratio of the distance moved to "half the width" of the card
     * Since it is a proportion of half the width of the card, the default 0.5 is equivalent to 1/4 (0.5*0.5) of the card width
     */
    pointerThreshold: {
      type: Number,
      default: 0.5
    },
    /**
     * When moving upward until disappearance, the ratio of the distance moved to the height of the card
     * Default movement of 1/2 height meets the removal condition
     */
    superThreshold: {
      type: Number,
      default: 0.5
    },
    downThreshold: {
      type: Number,
      default: 0.5
    },
    // Whether the next action needs to wait for the card to completely disappear, default is asynchronous operation
    sync: {
      type: Boolean,
      default: false
    },
    // Maximum render count
    max: {
      type: Number,
      default: 3
    },
    scaleStep: {
      type: Number,
      default: 0.05
    },
    offsetY: {
      type: Number,
      default: 0
    },
    offsetUnit: {
      type: String,
      default: 'px'
    }
  },
  data: () => ({
    size: {
      top: 0,
      width: 0,
      height: 0
    },
    state: initStatus(), // Status of this touch and movement, etc.
    list: [], // Actual list used, to compare with new list, treat new list items uniquely to avoid DOM reuse
    tinderMounted: false
  }),
  computed: {
    status() {
      return this.state.status
    },
    // Ratio of the horizontal movement distance relative to half the width of the card
    ratio() {
      if (this.size.width) {
        const { start, move } = this.state
        const x = move.x - start.x || 0
        const ratio = x / (this.size.width * 0.5)
        return ratio
      }
      return 0
    },
    // Opacity of the like/dislike icons on the card
    pointerOpacity() {
      return this.ratio / this.pointerThreshold
    },
    disY() {
      if (this.allowSuper || this.allowDown) {
        return this.state.move.y - this.state.start.y
      }
      return 0
    },
    superOpacity() {
      if (!this.allowSuper) {
        return 0
      }
      const ratio = this.disY / (-this.superThreshold * this.size.height)
      const pointerOpacity = Math.abs(this.pointerOpacity)
      return ratio > pointerOpacity ? ratio : 0
    },
    downOpacity() {
      if (!this.allowDown) {
        return 0
      }
      const ratio = this.disY / (this.downThreshold * this.size.height)
      const pointerOpacity = Math.abs(this.pointerOpacity)
      return ratio > pointerOpacity ? ratio : 0
    },
    likeOpacity() {
      return 1
      // If the current card is sliding up, need to hide the like/dislike
      if (this.superOpacity || this.downOpacity) {
        return 0
      }
      return this.pointerOpacity
    },
    nopeOpacity() {
      return -this.likeOpacity
    }
  },

  watch: {
    queue: {
      handler(val) {
        const keyName = this.keyName
        const newKeys = val.map(item => item[keyName])
        const oldKeys = this.list.map(item => item[keyName])
        this.diff(newKeys, oldKeys)
      },
      deep: true
    }
  },
  mounted() {
    window.onresize = this.getSize
    setTimeout(() => {
      this.getSize()
      if (!this.$el.offsetWidth || !this.$el.offsetHeight) {
        /* eslint-disable-next-line */
        console.error('Please set the width and height of vue-tinder');
        return
      }
      this.tinderMounted = true
    }, 0)
  },
  created() {
    this.list = this.queue.slice()
  },
  unmounted() {
    window.removeEventListener('onresize', this.getSize)
  },
  methods: {
    // Get component size and position to determine the angle of rotation, show corresponding status, etc.
    getSize() {
      clearInterval(resizeTimer)
      resizeTimer = setTimeout(() => {
        this.size = {
          top: this.$el.offsetTop,
          width: this.$el.offsetWidth,
          height: this.$el.offsetHeight
        }
      }, 300)
    },
    // Current card has already left
    resetStatus() {
      this.state = initStatus()
    }
  }
}
</script>

<style scoped>
.vue-tinder {
  position: relative;
  -webkit-tap-highlight-color: transparent;
}

/* Style is being bound by data, only important can be used to override */
.v-move {
  transition: none !important;
}

.pointer-wrap {
  pointer-events: none;
  transition: opacity 0.2s ease;
}

/* When calling a function to make a card disappear, corresponding state needs to be shown directly without transition animations */
.tinder-card.nope .nope-pointer-wrap,
.tinder-card.like .like-pointer-wrap,
.tinder-card.super .super-pointer-wrap,
.tinder-card.down .down-pointer-wrap {
  opacity: 1 !important;
}

.tinder-card.nope .rewind-pointer-wrap,
.tinder-card.like .rewind-pointer-wrap,
.tinder-card.super .rewind-pointer-wrap,
.tinder-card.down .rewind-pointer-wrap {
  display: none;
}
</style>
