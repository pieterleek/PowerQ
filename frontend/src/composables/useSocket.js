import { ref } from 'vue';
import { io } from 'socket.io-client';

const isConnected = ref(false);
const authError = ref(false);
const latestReading = ref({
  deviceId: 'Loading...', power: 0, current: 0, voltage: 0, timestamp: new Date()
});

let socket = null;

// Functie om verbinding te starten (wordt pas aangeroepen na login)
function connect() {
  const token = localStorage.getItem('mi6_clearance_code');
  if (!token) return;

  // Dit had natuurlijk beter in een environment variable gekund maar ja...
  socket = io('http://localhost:3000', {
    auth: {
      token: token 
    }
  });

  socket.on('connect', () => { 
    isConnected.value = true; 
    authError.value = false;
  });
  
  socket.on('connect_error', (err) => {
    // Als de server zegt "UNAUTHORIZED", weten we dat de sleutel fout is
    if (err.message === "UNAUTHORIZED") {
      authError.value = true;
      socket.disconnect(); // Verbreek verbinding
      localStorage.removeItem('mi6_clearance_code'); // Wis foute code
    }
  });

  socket.on('disconnect', () => { isConnected.value = false; });
  socket.on('energy_update', (data) => { latestReading.value = data; });
}

async function fetchHistory() {
  const token = localStorage.getItem('mi6_clearance_code');
  if (!token) return [];

  try {
    const response = await fetch('https://api.qman.io/api/measurements', {
      method: 'GET',
      headers: {
        'Authorization': token 
      }
    });

    if (response.status === 401 || response.status === 403) {
      authError.value = true;
      return [];
    }
    
    const data = await response.json();
    return data.reverse();
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export function useSocket() {
  return {
    connect,
    authError, 
    isConnected,
    latestReading,
    fetchHistory
  };
}