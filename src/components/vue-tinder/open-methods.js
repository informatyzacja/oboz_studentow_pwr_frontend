import { STATUS } from './status'

export default {
  data: () => ({
    rewindKeys: []
  }),
  methods: {
    /**
     * Click button to make a choice
     * @param {String} type like: like, nope: dislike, super: super like, down: downward
     */
    decide(type) {
      if (this.state.touchId || this.status !== STATUS.NORMAL) {
        return
      }
      this.state.start = { x: 0, y: 0 }
      this.state.move = {
        x: type === 'super' || type === 'down' ? 0 : type === 'like' ? 1 : -1,
        y: type === 'super' ? -1 : type === 'down' ? 1 : 0
      }
      this.state.startPoint = 1
      this.shiftCard(type)
    },
    /**
     * Restore a list
     * @param {Array} list
     */
    rewind(list) {
      const keyName = this.keyName
      // TODO: Actually, you could place the id somewhere else, doing so now mainly for future configuration of the source location of rewind
      for (const item of list) {
        this.rewindKeys.push(item[keyName] + '') // To prevent numeric type id from causing mismatch in subsequent decisions
      }
      this.queue.unshift(...list)
    },
    /***************** The following methods are not public, for queue operations please use the above functions *****************/
    /**
     * Remove a card
     * @param {String} type Removal method, like: like, nope: dislike, super: super like, down: downward
     */
    shiftCard(type) {
      this.state.status = STATUS.LEAVING
      this.state.result = type
      const item = this.queue.shift()
      this.$emit('update:queue', this.queue)
      this.submitDecide(type, item)
    },
    /**
     * Submit choice
     * @param {Boolean} type Type, like: like, nope: dislike, super: super like, down: downward
     * @param {String}  key  Current card's key
     * @param {Object}  item Card object
     */
    submitDecide(type, item) {
      this.$emit('submit', { type, key: item[this.keyName], item })
    }
  }
}
