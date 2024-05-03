import { STATUS } from './status'

export default {
  data: () => ({
    /**
     * Number of removed cards:
     * Each removed card's z-index is raised from the base of 100 to about 10000,
     * to avoid overlapping with the z-index of currently displayed cards.
     */
    leavedCount: 0,
    /**
     * z-index for hidden cards and the most recently set index, starting from 50
     */
    hideIndex: 50,
    lastHideIndex: 50,
    /**
     * Stores keys hidden because their z-index exceeded max:
     * Used in the remove part of the diff function to avoid executing removal operations on cards during hiding,
     * while the key hasn't changed, leading to DOM reuse and unnatural transition animations.
     */
    hidingKeys: []
  }),
  methods: {
    beforeEnter(divEl) {
      const el = divEl.querySelector('.tinder-card')
      if (!el) return
      const beforeIndex = el.dataset.index - 0 + 1
      el.style.opacity = 0
      el.style.transform = this.getTransform(beforeIndex)
      if (this.rewindKeys.indexOf(parseInt(el.dataset.id)) > -1) {
        // This is the same as the calculation method for the destination of the card being removed in the leave function
        let x = -1 // Rewind from the left
        x += this.size.width * (x < 0 ? -0.5 : 0.5)
        const ratio = x / (this.size.width * 0.5)
        const rotate = (ratio / (0.8 / 0.5)) * 15 * 1
        el.style.transform = `translate3d(${x}px, 0, 0) rotate(${rotate}deg)`
      }
      el.style.transition = 'all 0s'
    },
    /**
     * Current card is leaving
     * When only using JavaScript transitions, the done callback is necessary in enter and leave.
     * Otherwise, they will be called synchronously, and the transition will immediately complete.
     * @param {element}  el   Current card
     * @param {Function} done Callback function
     */
    leave(divEl, done) {
      const state = this.state
      const { start, move, startPoint } = state
      let x = move.x - start.x || 0
      let y = move.y - start.y || 0
      if (state.result === 'super') {
        y -= this.size.width
      } else if (state.result === 'down') {
        y += this.size.width
      } else {
        x += this.size.width * (x < 0 ? -0.5 : 0.5)
        y *= x / (move.x - start.x)
      }
      const ratio = x / (this.size.width * 0.5) // x and y are fine-tuned, cannot directly use this.ratio
      const rotate = (ratio / (0.8 / 0.5)) * 15 * startPoint
      let duration =
        state.result === 'super' ||
          state.result === 'down'
          ? 800
          : 300
      const el = divEl.querySelector('.tinder-card')
      el.style.opacity = 0
      el.style['pointer-events'] = 'none'
      if (this.leavingKeys.indexOf(parseInt(el.dataset.id)) > -1) {
        // Removal operation
        el.className += ` ${state.result}`
        el.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rotate}deg)`
        // Ensure the correct z-index for dequeued (earlier out, higher up)
        el.style.zIndex = 1000000 - this.leavedCount++
      } else {
        // Need to be hidden because the index exceeds max after a rewind operation
        this.hidingKeys.push(parseInt(el.dataset.id))
        duration = 500
        const index =
          Math.min(this.max, this.onceRewindCount) + (el.dataset.index - 0)
        el.style.transform = this.getTransform(index)
        el.style.zIndex = this.getHideIndex(el.dataset.index - 0)
      }
      el.style.transition = `all ${duration}ms ${duration === 500 ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'ease'
        },z-index 0s`
      el.addEventListener('transitionend', e => {
        if (e.propertyName === 'transform') {
          // Reset hideIndex to avoid conflict with the main card's level
          if (this.lastHideIndex === el.style.zIndex - 0) {
            this.lastHideIndex = 50
            this.hideIndex = 50
          }
          if (
            this.sync &&
            (this.status === STATUS.NORMAL || this.status === STATUS.LEAVING)
          ) {
            this.resetStatus()
          }
          done()
        }
      })
      if (
        !this.sync &&
        el.dataset.index - 0 === 0 &&
        this.status !== STATUS.REWINDING
      ) {
        this.resetStatus()
      }
    },
    /**
     * Give a correct z-index to cards hidden because they exceed max during multiple or single rewinds
     * Store the last current index in leave to reset it, to avoid conflict with the main card's level
     * @param {Number} index
     */
    getHideIndex(index) {
      const max = this.max
      let cur
      if (index === max) {
        if (this.lastHideIndex > this.hideIndex) {
          // Indicates that there was a higher level previously, here need to restore the hideIndex to the topmost index to avoid subsequent conflicts
          cur = this.hideIndex
          this.hideIndex += 1 + max
        } else {
          cur = this.hideIndex++
        }
      } else {
        cur = this.hideIndex + max - index
      }
      this.lastHideIndex = cur
      return cur
    },
    getTransform(index) {
      const scale = 1 - this.scaleStep * index
      let translateY = 0
      if (this.offsetY) {
        const inverse = this.offsetY < 0
        const offsetY = Math.abs(this.offsetY)
        let y = index * offsetY
        let offsetScale = ((1 - scale) / 2) * 100
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
