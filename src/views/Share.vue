<template>
  <div id="app">
    <ReadOnly></ReadOnly>
  </div>
</template>

<script>
import ReadOnly from "../components/ReadOnly.vue";

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    setId: function (data) {
      this.activity.date = data.date
    }
  },
  components: {
    ReadOnly: ReadOnly
  }
}
</script>

<style lang="scss">

</style>
