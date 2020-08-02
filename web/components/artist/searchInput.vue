<template>
  <div>
    <form-input
      v-model="term"
      class="funny"
      :placeholder="placeholder"
      @enter="$emit('search', term)"
    >
    </form-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      placeholderInterval: null,
      content: [
        'Qual o nome daquela banda que começa com J?',
        'Quero uma banda de forro porreta',
        'Rock das antigas',
        'Um standup bem engraçado'
      ],
      placeholder: '',
      term: ''
    }
  },
  watch: {
    term() {
      clearInterval(this.placeholderInterval)
      this.placeholder = 'Encontre os melhores artistas para seu evento'
    }
  },
  mounted() {
    let length = 5
    let index = 0
    let hold = 10
    const self = this
    self.placeholderInterval = setInterval(() => {
      length++
      // reached end of phrase
      if (length >= self.content[index].length) {
        // hold a bit so user can read phrase
        if (hold === 0) {
          // reset length
          hold = 10
          length = 5
          if (index === 3) {
            index = 0
          } else {
            index++
          }
        } else {
          hold--
        }
      }
      self.placeholder = self.content[index].substring(0, length)
    }, 100)
  }
}
</script>

<style lang="scss" scoped>
.funny {
  min-width: 35vw;
  margin-right: 2 * $space;
  margin-bottom: 4 * $space;
}
</style>
