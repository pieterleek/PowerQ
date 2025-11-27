<script setup>
import { computed } from 'vue';
import { useSocket } from '../composables/useSocket';

// Haal de data uit onze service
const { latestReading, isConnected } = useSocket();

// Computed properties voor opmaak (altijd 2 decimalen)
const powerDisplay = computed(() => latestReading.value.power.toFixed(2));
const currentDisplay = computed(() => latestReading.value.current.toFixed(3));
const voltageDisplay = computed(() => latestReading.value.voltage.toFixed(1));
</script>

<template>
  <div class="panel-container">
    <div class="header">
      <h2>SENSOR: {{ latestReading.deviceId }}</h2>
      <span :class="['status-dot', isConnected ? 'online' : 'offline']"></span>
    </div>

    <div class="grid">
      <div class="card power">
        <div class="value">{{ powerDisplay }} <small>W</small></div>
        <div class="label">VERMOGEN</div>
      </div>
      <div class="card">
        <div class="value">{{ currentDisplay }} <small>A</small></div>
        <div class="label">STROOM</div>
      </div>
      <div class="card">
        <div class="value">{{ voltageDisplay }} <small>V</small></div>
        <div class="label">SPANNING</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-container { background: #111; color: #0f0; padding: 20px; border: 1px solid #333; margin-bottom: 20px; font-family: 'Courier New', monospace; }
.header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; margin-bottom: 20px; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.card { background: #000; border: 1px solid #222; padding: 15px; text-align: center; }
.power .value { color: #fff; text-shadow: 0 0 10px #0f0; } /* Gloeiend effect */
.value { font-size: 2.5rem; font-weight: bold; }
.label { color: #666; font-size: 0.8rem; letter-spacing: 2px; }

.status-dot { width: 12px; height: 12px; border-radius: 50%; background: red; box-shadow: 0 0 5px red; }
.status-dot.online { background: #0f0; box-shadow: 0 0 5px #0f0; }
</style>