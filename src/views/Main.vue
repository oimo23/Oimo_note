<template>
  <div>
    <Editor></Editor>
  </div>
</template>

<script>
import Editor from "../components/Editor.vue";
import SideMenu from "../components/SideMenu.vue";

export default {
  name: 'app',
  data () {
    return {
    }
  },
  methods: {
    setId: function (data) {
      this.activity.date = data.date
    }
  },
  components: {
    Editor: Editor,
    SideMenu: SideMenu
  }
}
</script>

<style lang="scss">

</style>
