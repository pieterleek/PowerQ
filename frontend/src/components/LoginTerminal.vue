<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login-success']);
const inputCode = ref('');
const errorMsg = ref('');

const attemptLogin = () => {
  if (!inputCode.value) return;
  
  // We slaan de code lokaal op, zodat je niet elke keer opnieuw hoeft in te loggen
  localStorage.setItem('mi6_clearance_code', inputCode.value);
  emit('login-success');
};
</script>

<template>
  <div class="terminal-overlay">
    <div class="login-box">
      <div class="logo">SECURITY</div>
      <p>ENTER CLEARANCE CODE</p>
      
      <input 
        type="password" 
        v-model="inputCode" 
        @keyup.enter="attemptLogin"
        placeholder="Secret Key..."
        autofocus
      />
      
      <button @click="attemptLogin">ACCESS</button>
      <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<style scoped>
.terminal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: #000;
  display: flex; justify-content: center; align-items: center;
  z-index: 999;
}
.login-box {
  border: 2px solid #0f0; padding: 40px; text-align: center;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
  background: #111;
}
.logo { font-size: 2em; font-weight: bold; margin-bottom: 20px; color: #0f0; letter-spacing: 5px; }
input {
  background: #000; border: 1px solid #333; color: #0f0;
  padding: 10px; font-family: 'Courier New', monospace; font-size: 1.2em;
  width: 100%; margin-bottom: 20px; text-align: center;
}
input:focus { outline: none; border-color: #0f0; }
button {
  background: #0f0; color: #000; border: none; padding: 10px 30px;
  font-weight: bold; cursor: pointer; font-family: 'Courier New', monospace;
}
button:hover { background: #fff; }
</style>