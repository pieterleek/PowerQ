<script setup>
import StatusPanel from './components/StatusPanel.vue';
import EnergyChart from './components/EnergyChart.vue';
</script>

<template>
  <main>
    <div class="dashboard">
      <h1 class="title">Q-BRANCH // ENERGY MONITOR</h1>
      <StatusPanel />
      <EnergyChart />
    </div>
  </main>
</template>

<style>
/* Globale reset en background */
body { margin: 0; background-color: #000; color: #ccc; }
.dashboard { max-width: 900px; margin: 0 auto; padding: 20px; }
.title { 
  text-align: center; 
  font-family: 'Courier New', Courier, monospace; 
  color: #0f0; 
  border-bottom: 2px solid #0f0; 
  padding-bottom: 20px; 
  margin-bottom: 30px; 
  letter-spacing: 4px;
}
</style>