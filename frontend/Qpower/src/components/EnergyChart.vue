<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import { useSocket } from '../composables/useSocket';

// Haal nu ook de fetchHistory functie op
const { latestReading, fetchHistory } = useSocket();
const chartCanvas = ref(null);
let chartInstance = null;

onMounted(async () => {
  // 1. Initialiseer de Chart (leeg)
  const ctx = chartCanvas.value.getContext('2d');
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Wattage',
        data: [],
        borderColor: '#00ff00',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0, // Geen puntjes in de historie
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false, // Belangrijk: Zet animatie uit bij bulk-load
      scales: {
        x: { display: false },
        y: { grid: { color: '#222' }, ticks: { color: '#0f0' } }
      },
      plugins: { legend: { display: false } }
    }
  });

  // 2. HAAL DE GESCHIEDENIS OP (Async)
  // Dit is het "James Bond" moment: Dossiers inladen...
  console.log("📂 Loading Archives...");
  const history = await fetchHistory();

  // 3. Vul de grafiek met historische data
  history.forEach(point => {
    const timeStr = new Date(point.timestamp).toLocaleTimeString();
    chartInstance.data.labels.push(timeStr);
    chartInstance.data.datasets[0].data.push(point.power);
  });
  
  chartInstance.update();
  console.log(`✅ ${history.length} records retrieved.`);
});

// 4. Blijf luisteren naar nieuwe data (Real-time)
watch(latestReading, (newVal) => {
  if (!chartInstance) return;

  const timeStr = new Date(newVal.timestamp).toLocaleTimeString();
  
  chartInstance.data.labels.push(timeStr);
  chartInstance.data.datasets[0].data.push(newVal.power);

  // Houd de grafiek netjes (max 50 punten totaal)
  if (chartInstance.data.labels.length > 50) {
    chartInstance.data.labels.shift();
    chartInstance.data.datasets[0].data.shift();
  }

  chartInstance.update();
});
</script>

<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  background: #111;
  border: 1px solid #333;
  padding: 20px;
  height: 400px;
  position: relative;
}
</style>