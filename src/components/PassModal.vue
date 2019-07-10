<template>
    <div id="modal-center" class="uk-flex-top" uk-modal>
      <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <button class="uk-modal-close-default" type="button" uk-close></button>

        <p><input type="password" class="uk-input" value="" v-model="password" placeholder="Input Password" @change="emitChangePasswordInput"></p>
        <p>{{ msg }}</p>
        <button class="uk-button uk-button-primary" @click="emitLockNotepad">OK</button>
      </div>
    </div>
</template>

<script>
export default {
  name: "PassModal",
  props: {
    msg: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      password: "null"
    }
  },
  methods: {
    emitLockNotepad() {
      this.$emit("lockNotepad");
    },
    emitChangePasswordInput() {
      this.$emit("changePasswordInput", this.password);
    }
  }
}
</script>

<style scoped lang="scss">
.uk-modal-body {
	padding : 60px 20px 40px 20px;
	text-align: center;
}
</style>
