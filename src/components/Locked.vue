<template>
  <div class="pass">
    <p><img src="~/../assets/logo.png" alt="OimoNote" width="200"></p>
    <input type="password" class="uk-input" v-model="password" @change="emitChangePasswordInput" placeholder="Input Password">
    <div v-if="msg" class="alert">
      <p>{{ msg }}</p>
    </div>
    <button class="pass_btn uk-button uk-button-primary" @click="emitCheckPass">OK</button>    
  </div>
</template>

<script>
export default {
  name: "Locked",
  props: {
    msg: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      password: null
    }
  },
  methods: {
    emitCheckPass() {
      this.$emit("checkPass");
    },
    emitChangePasswordInput() {
      this.$emit("changePasswordInput", this.password);
    }
  }
}
</script>

<style scoped lang="scss">
.loading,
.loading::before,
.loading::after {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid #303841;
  border-left-color: #30384170;
  -webkit-border-radius: 999px;
  -moz-border-radius: 999px;
  border-radius: 999px;
}

.loading {
  margin: -25px 0 0 -25px;
  height: 50px;
  width: 50px;
  -webkit-animation: animation-rotate 1000ms linear infinite;
  -moz-animation: animation-rotate 1000ms linear infinite;
  -o-animation: animation-rotate 1000ms linear infinite;
  animation: animation-rotate 1000ms linear infinite;
}

.loading::before {
  content: "";
  margin: -23px 0 0 -23px;
  height: 44px;
  width: 44px;
  -webkit-animation: animation-rotate 1000ms linear infinite;
  -moz-animation: animation-rotate 1000ms linear infinite;
  -o-animation: animation-rotate 1000ms linear infinite;
  animation: animation-rotate 1000ms linear infinite;
}

.loading::after {
  content: "";
  margin: -29px 0 0 -29px;
  height: 56px;
  width: 56px;
  -webkit-animation: animation-rotate 2000ms linear infinite;
  -moz-animation: animation-rotate 2000ms linear infinite;
  -o-animation: animation-rotate 2000ms linear infinite;
  animation: animation-rotate 2000ms linear infinite;
}
</style>
