// Offline Web Audio API Synthesizer for Focus & Notifications
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCompletionChime(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Play a gentle major triad (C5 - E5 - G5 - C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);
      
      gain.gain.setValueAtTime(0, now + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.2, now + index * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 1.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 1.3);
    });
  } catch (e) {
    console.warn('Audio play failed', e);
  }
}

export function playMicroChime(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.2); // A5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {
    console.warn('Micro chime failed', e);
  }
}

// Offline Ambient Sound Generator (White noise / Brown noise / Soft Rain)
let ambientSource: AudioBufferSourceNode | null = null;
let ambientGain: GainNode | null = null;

export function startAmbientNoise(type: 'white' | 'brown' | 'rain' | 'off'): void {
  stopAmbientNoise();
  if (type === 'off') return;

  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'white') {
        // Pure White Noise
        output[i] = white * 0.15;
      } else if (type === 'brown') {
        // Brown noise filter algorithm
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain adjustment
      } else {
        // Rain sound simulation (filtered soft noise)
        output[i] = white * 0.18;
      }
    }

    ambientSource = ctx.createBufferSource();
    ambientSource.buffer = buffer;
    ambientSource.loop = true;

    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(type === 'white' ? 0.05 : 0.08, ctx.currentTime);

    ambientSource.connect(ambientGain);
    ambientGain.connect(ctx.destination);
    ambientSource.start();
  } catch (e) {
    console.warn('Ambient noise failed', e);
  }
}

export function stopAmbientNoise(): void {
  if (ambientSource) {
    try {
      ambientSource.stop();
      ambientSource.disconnect();
    } catch {
      // ignore
    }
    ambientSource = null;
  }
}
