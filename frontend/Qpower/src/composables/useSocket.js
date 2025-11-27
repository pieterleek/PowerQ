// src/composables/useSocket.js
import { ref } from 'vue';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');
const isConnected = ref(false);
const latestReading = ref({
  deviceId: 'Loading...', power: 0, current: 0, voltage: 0, timestamp: new Date()
});

socket.on('connect', () => { isConnected.value = true; });
socket.on('disconnect', () => { isConnected.value = false; });
socket.on('energy_update', (data) => { latestReading.value = data; });

// NIEUW: Functie om geschiedenis op te halen
async function fetchHistory() {
  try {
    const response = await fetch('http://localhost:3000/api/measurements');
    if (!response.ok) throw new Error('Failed to fetch intel');
    const data = await response.json();
    
    // De API geeft de data 'Nieuwste Eerst' (DESC).
    // Chart.js wil de tijdlijn van Links naar Rechts (Oud -> Nieuw).
    // Dus we draaien de array om.
    return data.reverse(); 
  } catch (error) {
    console.error("Archief onbereikbaar:", error);
    return [];
  }
}

export function useSocket() {
  return {
    socket,
    isConnected,
    latestReading,
    fetchHistory // Exporteer deze zodat componenten hem kunnen gebruiken
  };
}