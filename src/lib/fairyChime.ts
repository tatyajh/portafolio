// "Tilín" de hada para cuando Lía tiene algo que decir. Es un sonido
// original hecho con Web Audio (no un archivo): dos notas agudas con un
// brillo corto encima. Solo suena después de que la persona interactuó
// con la página, que es cuando el navegador permite reproducir audio.
let ctx: AudioContext | null = null;
let unlocked = false;

if (typeof window !== 'undefined') {
  const unlock = () => {
    unlocked = true;
    window.removeEventListener('pointerdown', unlock, true);
    window.removeEventListener('keydown', unlock, true);
  };
  // En captura: algunos elementos (como Lía) detienen el evento al tocarlos.
  window.addEventListener('pointerdown', unlock, true);
  window.addEventListener('keydown', unlock, true);
}

function note(audio: AudioContext, freq: number, start: number, length: number, volume: number) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(audio.destination);
  osc.start(start);
  osc.stop(start + length + 0.02);
}

export function playFairyChime() {
  if (!unlocked || typeof window === 'undefined') return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const t = ctx.currentTime;
    note(ctx, 1318.5, t, 0.18, 0.05);        // Mi
    note(ctx, 1975.5, t + 0.09, 0.28, 0.045); // Si
    note(ctx, 2637, t + 0.16, 0.22, 0.02);    // brillo
  } catch {
    // Sin audio disponible: Lía igual muestra su mensaje.
  }
}

// "Chac" de tijeras: un golpe corto de ruido filtrado más un clic metálico.
// Suena cada vez que las tijeras se cierran sobre las letras.
export function playSnip() {
  if (!unlocked || typeof window === 'undefined') return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const t = ctx.currentTime;
    const length = 0.07;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * length), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3800;
    filter.Q.value = 0.9;
    const gain = ctx.createGain();
    gain.gain.value = 0.35;
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(t);
    note(ctx, 5200, t, 0.04, 0.03);
  } catch {
    // Sin audio disponible: el corte se ve igual.
  }
}
