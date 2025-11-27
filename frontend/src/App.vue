<script setup>
import { ref, onMounted, watch } from 'vue';
import StatusPanel from './components/StatusPanel.vue';
import EnergyChart from './components/EnergyChart.vue';
import LoginTerminal from './components/LoginTerminal.vue';
import { useSocket } from './composables/useSocket';

const { connect, authError } = useSocket();
const needsLogin = ref(true);

// Check bij opstarten of er al een sleutel is
onMounted(() => {
  if (localStorage.getItem('mi6_clearance_code')) {
    needsLogin.value = false;
    connect();
  }
});

// Als er een auth error optreedt (verkeerd wachtwoord), gooi gebruiker terug naar login
watch(authError, (hasError) => {
  if (hasError) {
    needsLogin.value = true;
    alert("ACCESS DENIED: Invalid Clearance Code");
  }
});

const handleLogin = () => {
  needsLogin.value = false;
  connect(); 
};
</script>

<template>
  <main>
    <LoginTerminal v-if="needsLogin" @login-success="handleLogin" />

    <div v-else class="dashboard">
      <h1 class="title">ENERGY MONITOR</h1>
      <StatusPanel />
      <EnergyChart />
    </div>
  </main>
</template>

<style>
/* ... je bestaande styles ... */
body { margin: 0; background-color: #000; color: #ccc; font-family: 'Courier New', monospace; }
.dashboard { max-width: 900px; margin: 0 auto; padding: 20px; }
.title { text-align: center; color: #0f0; border-bottom: 2px solid #0f0; padding-bottom: 20px; margin-bottom: 30px; letter-spacing: 4px; }
</style>