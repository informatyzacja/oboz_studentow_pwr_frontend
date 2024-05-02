import { STATUS } from './status'

const difference = (array, exclude) => {
  const result = []
  for (let i = 0; i < array.length; i++) {
    if (exclude.indexOf(array[i]) > -1) {
      break
    }
    result.push(array[i])
  }
  return result
}

export default {
  data: () => ({
    /**
     * Key currently being removed, currently only handling insertion, not deletion after removal
     */
    leavingKeys: [],
    /**
     * Number of rewinds this time, updated each diff, useful for deciding target state after card is hidden during animation removal
     */
    onceRewindCount: 0
  }),
  methods: {
    /**
     * Need to distinguish whether the array change is an increase or a decrease
     * @param {Array} list
     * @param {Array} old
     */
    diff(list, old) {
      // Adding or rewinding
      const keyName = this.keyName
      const add = difference(list, old)
      let onceRewindCount = 0
      if (add.length) {
        for (let i = 0; i < add.length; i++) {
          const item = this.queue[i]
          if (item[keyName] && add[i] === item[keyName]) {
            onceRewindCount++
            const id = item[keyName]
            const newVueTinderkey = id + Math.random()
            if (
              this.leavingKeys.indexOf(item.$vtKey) > -1 ||
              this.leavingKeys.indexOf(id) > -1 ||
              this.rewindKeys.indexOf(item.$vtKey) > -1 ||
              this.rewindKeys.indexOf(id) > -1
            ) {
              // If it has been removed and appears again, to avoid the dom reuse interrupting the previous disappearance animation, a new key is needed
              item.$vtKey = newVueTinderkey
              // Because in beforeEnter, the data-id stored in rewindKeys,
              // and data-id prioritizes $vtKey, if the previously removed object is rewinded directly,
              // there's a good chance it already has a $vtKey, so merely searching by its id might not find it
              // thus it's also necessary to search by $vtKey and, to be safe, assign a new $vtKey
              const rewindIndex = Math.max(
                this.rewindKeys.indexOf(item.$vtKey),
                this.rewindKeys.indexOf(id)
              )
              if (rewindIndex > -1) {
                this.rewindKeys[rewindIndex] = newVueTinderkey
                this.state.status = STATUS.REWINDING
              }
            }
          } else {
            break
          }
        }
      }
      this.onceRewindCount = onceRewindCount

      // Removing
      const remove = difference(old, list)
      if (remove.length) {
        // Here only considering the removal of one, manual removal of the head is not covered, manual queue operations should be avoided except appending to the end
        this.leavingKeys.push(this.list[0].$vtKey || this.list[0][keyName])
        for (let i = this.max + 1; i < this.max + 1 + remove.length; i++) {
          const item = this.list[i]
          if (item) {
            if (
              this.leavingKeys.indexOf(item[keyName]) > -1 ||
              // For items that are hidden but about to appear, a $vtKey needs to be created to avoid the situation of being hidden (conflicting with just coming out key)
              this.hidingKeys.indexOf(item[keyName]) > -1
            ) {
              item.$vtKey = item[keyName] + Math.random()
            }
          }
        }
      }

      this.list = this.queue.slice(0)
    }
  }
}
