// Création d'un contexte audio
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

// Garder une référence aux oscillateurs actifs
let activeOscillators: OscillatorNode[] = [];
let activeGainNodes: GainNode[] = [];

// Fonction pour arrêter tous les sons actifs
export function stopAllSounds() {
  const currentTime = audioContext.currentTime;
  
  activeGainNodes.forEach(gain => {
    gain.gain.setTargetAtTime(0, currentTime, 0.01);
  });

  setTimeout(() => {
    activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Ignorer les erreurs si l'oscillateur est déjà arrêté
      }
    });
    activeGainNodes.forEach(gain => gain.disconnect());
    activeOscillators = [];
    activeGainNodes = [];
  }, 50);
}

// Son de tam-tam pour la recherche
export function playTamTam() {
  stopAllSounds();
  
  const osc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  
  // Configuration du filtre pour un son plus profond
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(100, audioContext.currentTime);
  filter.Q.setValueAtTime(10, audioContext.currentTime);
  
  // Configuration de l'oscillateur
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(60, audioContext.currentTime);
  
  // Enveloppe pour simuler le son du tam-tam
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
  
  // Connexion des nodes
  osc.connect(gainNode);
  gainNode.connect(filter);
  filter.connect(audioContext.destination);
  
  activeOscillators.push(osc);
  activeGainNodes.push(gainNode);
  
  // Démarrage et arrêt
  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.3);
  
  // Nettoyage
  setTimeout(() => {
    const index = activeOscillators.indexOf(osc);
    if (index > -1) {
      activeOscillators.splice(index, 1);
      activeGainNodes.splice(index, 1);
    }
  }, 300);
}

// Son de hover futuriste
export function playHoverSound() {
  const osc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  
  // Configuration du filtre pour un son plus cristallin
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2000, audioContext.currentTime);
  filter.Q.setValueAtTime(2, audioContext.currentTime);
  
  // Configuration de l'oscillateur
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.1);
  
  // Enveloppe courte et douce
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
  
  // Connexion des nodes
  osc.connect(gainNode);
  gainNode.connect(filter);
  filter.connect(audioContext.destination);
  
  activeOscillators.push(osc);
  activeGainNodes.push(gainNode);
  
  // Démarrage et arrêt
  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.1);
  
  // Nettoyage
  setTimeout(() => {
    const index = activeOscillators.indexOf(osc);
    if (index > -1) {
      activeOscillators.splice(index, 1);
      activeGainNodes.splice(index, 1);
    }
  }, 100);
}