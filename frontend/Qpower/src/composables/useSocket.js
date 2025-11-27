// src/composables/useSocket.js
import { ref } from 'vue';
import { io } from 'socket.io-client';

const isConnected = ref(false);
const authError = ref(false); // Nieuw: om foute logins te detecteren
const latestReading = ref({
  deviceId: 'Loading...', power: 0, current: 0, voltage: 0, timestamp: new Date()
});

let socket = null;

// Functie om verbinding te starten (wordt pas aangeroepen na login)
function connect() {
  const token = localStorage.getItem('mi6_clearance_code');
  if (!token) return;

  // We maken de verbinding nu pas aan, MET het token
  socket = io('http://localhost:3000', {
    auth: {
      token: token // Dit stuurt de sleutel naar de socket handshake
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
    const response = await fetch('http://localhost:3000/api/measurements', {
      method: 'GET',
      headers: {
        // Stuur token mee als header (zoals we in de backend middleware hebben ingesteld)
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
    connect, // Nieuwe export
    authError, // Nieuwe export
    isConnected,
    latestReading,
    fetchHistory
  };
}