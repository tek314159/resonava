import { useState, useEffect, useRef } from 'react'

// Circle of Fifths keys (no D#, G#, etc.)
const majorKeys = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'
];
const minorKeys = [
  'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'Bb', 'F', 'C', 'G', 'D'
];

// Modes with new weights (major/minor = 50% total)
const modes = [
  { name: 'Major (Ionian)', weight: 0.25 },
  { name: 'Minor (Aeolian)', weight: 0.25 },
  { name: 'Dorian', weight: 0.15 },
  { name: 'Mixolydian', weight: 0.15 },
  { name: 'Phrygian', weight: 0.10 },
  { name: 'Lydian', weight: 0.08 },
  { name: 'Locrian', weight: 0.07 },
];

// Chromatic scale (for enharmonic spelling)
const CHROMATIC = [
  'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'
];

// Mode intervals (in semitones from root)
const MODE_INTERVALS = {
  'Major (Ionian)':      [0, 2, 4, 5, 7, 9, 11],
  'Minor (Aeolian)':    [0, 2, 3, 5, 7, 8, 10],
  'Dorian':             [0, 2, 3, 5, 7, 9, 10],
  'Phrygian':           [0, 1, 3, 5, 7, 8, 10],
  'Lydian':             [0, 2, 4, 6, 7, 9, 11],
  'Mixolydian':         [0, 2, 4, 5, 7, 9, 10],
  'Locrian':            [0, 1, 3, 5, 6, 8, 10],
};

// Diatonic chord qualities for each mode
const MODE_CHORDS = {
  'Major (Ionian)':      ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'],
  'Minor (Aeolian)':     ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'],
  'Dorian':              ['min', 'min', 'maj', 'maj', 'min', 'dim', 'maj'],
  'Phrygian':            ['min', 'maj', 'maj', 'min', 'dim', 'maj', 'min'],
  'Lydian':              ['maj', 'maj', 'min', 'dim', 'maj', 'min', 'min'],
  'Mixolydian':          ['maj', 'min', 'dim', 'maj', 'min', 'maj', 'maj'],
  'Locrian':             ['dim', 'maj', 'min', 'min', 'maj', 'maj', 'min'],
};

const DEGREE_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const DEGREE_ROMAN_MINOR = ['i', 'ii', 'III', 'iv', 'v', 'VI', 'VII'];

// Helper: all possible note names for each letter
const NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const ENHARMONIC = {
  'C#': 'Db', 'Db': 'C#',
  'D#': 'Eb', 'Eb': 'D#',
  'F#': 'Gb', 'Gb': 'F#',
  'G#': 'Ab', 'Ab': 'G#',
  'A#': 'Bb', 'Bb': 'A#',
};

// Helper: get the next note letter (wraps around)
function nextLetter(letter) {
  const idx = NOTE_LETTERS.indexOf(letter);
  return NOTE_LETTERS[(idx + 1) % 7];
}

// Helper: get all possible names for a pitch class
function getPossibleNames(semitone) {
  // C=0, C#=1, D=2, Eb=3, E=4, F=5, F#=6, G=7, Ab=8, A=9, Bb=10, B=11
  const names = [
    ['C'], ['C#', 'Db'], ['D'], ['D#', 'Eb'], ['E'], ['F'], ['F#', 'Gb'],
    ['G'], ['G#', 'Ab'], ['A'], ['A#', 'Bb'], ['B']
  ];
  return names[semitone % 12];
}

function weightedRandom(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    if (r < item.weight) return item.name;
    r -= item.weight;
  }
  return items[0].name;
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getScaleNotesSpelled(root, mode) {
  // Get intervals for the mode
  const intervals = MODE_INTERVALS[mode];
  // Get root letter
  let rootLetter = root[0];
  // For flats/sharps, adjust root letter
  if (root.length > 1 && (root[1] === 'b' || root[1] === '#')) {
    rootLetter = root[0];
  }
  // Build scale
  let letter = rootLetter;
  // Find root index in chromatic
  let idx = CHROMATIC.indexOf(root);
  if (idx === -1) {
    // Try enharmonic equivalents
    idx = CHROMATIC.indexOf(ENHARMONIC[root]);
  }
  const scale = [];
  for (let i = 0; i < 7; i++) {
    const semitone = (idx + intervals[i]) % 12;
    const possible = getPossibleNames(semitone);
    // Pick the name that matches the expected letter
    let note = possible.find(n => n[0] === letter);
    if (!note) note = possible[0]; // fallback
    scale.push(note);
    letter = nextLetter(letter);
  }
  return scale;
}

function getChordNotes(scale, degree, quality) {
  // Triads: root, 3rd, 5th
  const root = scale[degree];
  const third = scale[(degree + 2) % 7];
  const fifth = scale[(degree + 4) % 7];
  // For dim: lower 5th by 1 semitone
  if (quality === 'dim') {
    // Find the note a half step below the fifth
    const idx = CHROMATIC.indexOf(fifth);
    return [root, third, CHROMATIC[(idx + 11) % 12]];
  }
  return [root, third, fifth];
}

function getRoman(degree, mode, quality) {
  // Major: uppercase, Minor: lowercase, Diminished: lowercase + °
  let numeral = DEGREE_ROMAN[degree];
  if (quality === 'maj') {
    return numeral;
  } else if (quality === 'min') {
    return numeral.toLowerCase();
  } else if (quality === 'dim') {
    return numeral.toLowerCase() + '°';
  }
  return numeral;
}

function getRelativeMajor(key, mode) {
  // For major mode, no relative major
  if (mode === 'Major (Ionian)') return null;
  
  // Get the scale for this key and mode
  const scale = getScaleNotesSpelled(key, mode);
  
  // Different modes have different relative majors
  let relativeMajor;
  switch (mode) {
    case 'Minor (Aeolian)':
      relativeMajor = scale[2]; // 3rd degree (major third up)
      break;
    case 'Dorian':
      relativeMajor = scale[6]; // 7th degree (minor seventh up)
      break;
    case 'Mixolydian':
      relativeMajor = scale[3]; // 4th degree (perfect fourth up)
      break;
    case 'Phrygian':
      relativeMajor = scale[5]; // 6th degree (major sixth up)
      break;
    case 'Lydian':
      relativeMajor = scale[1]; // 2nd degree (major second up)
      break;
    case 'Locrian':
      relativeMajor = scale[4]; // 5th degree (perfect fifth up)
      break;
    default:
      return null;
  }
  
  // Ensure proper enharmonic spelling
  // Find the note in chromatic scale
  let idx = CHROMATIC.indexOf(relativeMajor);
  if (idx === -1) {
    // Try enharmonic equivalents
    idx = CHROMATIC.indexOf(ENHARMONIC[relativeMajor]);
  }
  
  // Return the properly spelled note
  return CHROMATIC[idx];
}

function randomProgression(mode) {
  // 80% 4 chords, 20% 3 chords
  const len = Math.random() < 0.8 ? 4 : 3;
  const degrees = [0,1,2,3,4,5,6];
  // Always include I/i in first or last position
  let prog = [];
  const counts = Array(7).fill(0);
  if (Math.random() < 0.5) {
    prog.push(0); // I/i first
    counts[0]++;
    while (prog.length < len) {
      const available = degrees.filter(x => x !== 0 ? counts[x] < 2 : counts[x] < 2 || prog.length === len - 1);
      const d = getRandom(available.filter(x => x !== 0));
      prog.push(d);
      counts[d]++;
    }
  } else {
    while (prog.length < len-1) {
      const available = degrees.filter(x => x !== 0 ? counts[x] < 2 : counts[x] < 2 || prog.length === 0);
      const d = getRandom(available.filter(x => x !== 0));
      prog.push(d);
      counts[d]++;
    }
    prog.push(0); // I/i last
    counts[0]++;
  }
  return prog;
}

// Color themes for each mode (dark mode)
const MODE_COLORS = {
  'Major (Ionian)':      { bg: '#1a2e1a', text: '#90ee90', border: '#4a7c59' },
  'Minor (Aeolian)':     { bg: '#2e1a2e', text: '#dda0dd', border: '#7c4a7c' },
  'Dorian':              { bg: '#1a2e2e', text: '#87ceeb', border: '#4a7c7c' },
  'Phrygian':            { bg: '#2e1a1a', text: '#f0a0a0', border: '#7c4a4a' },
  'Lydian':              { bg: '#2e2e1a', text: '#f0e68c', border: '#7c7c4a' },
  'Mixolydian':          { bg: '#1a2e1a', text: '#98fb98', border: '#4a7c7c' },
  'Locrian':             { bg: '#2e2e2e', text: '#c0c0c0', border: '#7c7c7c' },
};

// Chord quality colors (brightened for dark mode)
const CHORD_COLORS = {
  'maj': '#90ee90',    // Light green for major
  'min': '#dda0dd',    // Light purple for minor
  'dim': '#f0a0a0',    // Light red for diminished
};

function getChordColor(quality) {
  return CHORD_COLORS[quality] || '#333';
}

function ChordProgressionGenerator() {
  const [result, setResult] = useState({ key: '', mode: '', progression: [], scale: [], chords: [], relMaj: null });
  const [metronome, setMetronome] = useState({
    isPlaying: false,
    bpm: 120,
    beatsPerMeasure: 4,
    volume: 0.5, // 0.0 to 1.0
    accentFirstBeat: true,
    subdivisions: false,
    subdivisionType: 'simple', // 'simple' or 'compound'
    subdivisionValue: 2 // 2 = eighth notes, 3 = triplets, etc.
  });
  
  const metronomeRef = useRef(null);
  const intervalRef = useRef(null);
  const beatCountRef = useRef(0);
  const audioContextRef = useRef(null);
  const isPlayingRef = useRef(false);

  function generate() {
    const mode = weightedRandom(modes);
    let key = '';
    if (mode === 'Major (Ionian)' || mode === 'Lydian' || mode === 'Mixolydian') {
      key = getRandom(majorKeys);
    } else {
      key = getRandom(minorKeys);
    }
    const scale = getScaleNotesSpelled(key, mode);
    const qualities = MODE_CHORDS[mode];
    const progDegrees = randomProgression(mode);
    const chords = progDegrees.map(d => ({
      degree: d,
      roman: getRoman(d, mode, qualities[d]),
      quality: qualities[d],
      notes: getChordNotes(scale, d, qualities[d]),
    }));
    const relMaj = getRelativeMajor(key, mode);
    setResult({ key, mode, progression: progDegrees, scale, chords, relMaj });
  }

  useEffect(() => {
    generate();
  }, []);

  // Initialize audio context
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // Metronome functions
  const playClick = (isAccent = false) => {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different frequencies for accent vs regular beat
    oscillator.frequency.setValueAtTime(isAccent ? 800 : 600, audioContext.currentTime);
    
    // Apply volume setting to different volumes
    const baseVolume = isAccent ? 0.3 : 0.2;
    const adjustedVolume = baseVolume * metronome.volume;
    gainNode.gain.setValueAtTime(adjustedVolume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const playSubdivision = () => {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Gentle subdivision click
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    const adjustedVolume = 0.1 * metronome.volume;
    gainNode.gain.setValueAtTime(adjustedVolume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  };

  const startMetronome = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const interval = (60 / metronome.bpm) * 1000;
    beatCountRef.current = 0;
    
    // Set playing state immediately
    setMetronome(prev => ({ ...prev, isPlaying: true }));
    isPlayingRef.current = true;
    
    intervalRef.current = setInterval(() => {
      // Use a ref to track playing state to avoid stale closure issues
      if (!isPlayingRef.current) return;
      
      const isFirstBeat = beatCountRef.current % metronome.beatsPerMeasure === 0;
      const shouldAccent = isFirstBeat && metronome.accentFirstBeat;
      
      playClick(shouldAccent);
      
      // Schedule subdivisions if enabled
      if (metronome.subdivisions && metronome.subdivisionValue > 1) {
        const subdivisionDelay = interval / metronome.subdivisionValue;
        for (let i = 1; i < metronome.subdivisionValue; i++) {
          setTimeout(() => {
            if (isPlayingRef.current) {
              playSubdivision();
            }
          }, subdivisionDelay * i);
        }
      }
      
      beatCountRef.current++;
    }, interval);
  };

  const stopMetronome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setMetronome(prev => ({ ...prev, isPlaying: false }));
    isPlayingRef.current = false;
  };

  const toggleMetronome = () => {
    if (metronome.isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };

  // Restart metronome when settings change
  useEffect(() => {
    if (metronome.isPlaying) {
      stopMetronome();
      // Small delay to ensure clean restart
      setTimeout(() => {
        startMetronome();
      }, 50);
    }
  }, [metronome.bpm, metronome.beatsPerMeasure, metronome.volume, metronome.accentFirstBeat, metronome.subdivisions, metronome.subdivisionValue]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const modeTheme = MODE_COLORS[result.mode] || MODE_COLORS['Major (Ionian)'];

  return (
    <div className="app-container">
      <div className="container" style={{ 
        backgroundColor: modeTheme.bg, 
        color: modeTheme.text,
        border: `2px solid ${modeTheme.border}` 
      }}>
        <h1>Chord Progression Generator</h1>
        <button className="generate-btn" onClick={generate}>Generate</button>
        <div className="result">
          <div><strong>Key:</strong> {result.key}</div>
          <div><strong>Mode:</strong> {result.mode}</div>
          <div><strong>Progression:</strong> {result.chords && result.chords.length > 0 ? result.chords.map((c, i) => (
            <span key={i} style={{ color: getChordColor(c.quality), fontWeight: 'bold' }}>
              {c.roman}{i < result.chords.length - 1 ? ' - ' : ''}
            </span>
          )) : ''}</div>
        </div>
        <div className="reference">
          <h3>Reference</h3>
          <div><strong>Scale notes:</strong> {result.scale && result.scale.join(', ')}</div>
          <div><strong>Chords:</strong>
            <ul style={{textAlign:'left', margin:'0.5em auto', maxWidth:'300px'}}>
              {result.chords && result.chords.map((c, i) => (
                <li key={i}>
                  <strong style={{ color: getChordColor(c.quality) }}>{c.roman}:</strong> {c.notes.join('-')}
                </li>
              ))}
            </ul>
          </div>
          {result.relMaj && <div><strong>Relative major:</strong> {result.relMaj} major</div>}
        </div>
        <p className="footer">Keys are based on the circle of fifths. Modes are weighted by real-world usage. Progressions are random diatonic chords.</p>
      </div>
      
      <div className="metronome-container">
        <h2>Metronome</h2>
        <div className="metronome-controls">
          <div className="bpm-section">
            <label>BPM: {metronome.bpm}</label>
            <input 
              type="range" 
              min="40" 
              max="200" 
              value={metronome.bpm}
              onChange={(e) => setMetronome(prev => ({ ...prev, bpm: parseInt(e.target.value) }))}
              className="bpm-slider"
            />
          </div>
          
          <div className="volume-section">
            <label>Volume: {Math.round(metronome.volume * 100)}%</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={metronome.volume}
              onChange={(e) => setMetronome(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
              className="volume-slider"
            />
          </div>
          
          <div className="time-signature">
            <div>
              <label>Beats per measure: <span style={{fontWeight: 'bold', color: '#646cff'}}>{metronome.beatsPerMeasure}</span></label>
              <input 
                type="range" 
                min="2" 
                max="16" 
                value={metronome.beatsPerMeasure}
                onChange={(e) => setMetronome(prev => ({ ...prev, beatsPerMeasure: parseInt(e.target.value) }))}
                className="beats-slider"
              />
            </div>
          </div>
          
          <div className="options">
            <label>
              <input 
                type="checkbox" 
                checked={metronome.accentFirstBeat}
                onChange={(e) => setMetronome(prev => ({ ...prev, accentFirstBeat: e.target.checked }))}
              />
              Accent first beat
            </label>
            
            <label>
              <input 
                type="checkbox" 
                checked={metronome.subdivisions}
                onChange={(e) => setMetronome(prev => ({ ...prev, subdivisions: e.target.checked }))}
              />
              Enable subdivisions
            </label>
            
            {metronome.subdivisions && (
              <div className="subdivision-controls">
                <label>Subdivision type:</label>
                <div className="subdivision-buttons">
                  <button
                    className={`subdivision-btn ${metronome.subdivisionType === 'simple' ? 'active' : ''}`}
                    onClick={() => setMetronome(prev => ({ 
                      ...prev, 
                      subdivisionType: 'simple',
                      subdivisionValue: 2
                    }))}
                  >
                    Simple (2:1)
                  </button>
                  <button
                    className={`subdivision-btn ${metronome.subdivisionType === 'compound' ? 'active' : ''}`}
                    onClick={() => setMetronome(prev => ({ 
                      ...prev, 
                      subdivisionType: 'compound',
                      subdivisionValue: 3
                    }))}
                  >
                    Compound (3:1)
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button 
            className={`metronome-btn ${metronome.isPlaying ? 'playing' : ''}`}
            onClick={toggleMetronome}
          >
            {metronome.isPlaying ? '⏸ Stop' : '▶ Play'}
          </button>
          
          <div className="time-signature-display">
            {metronome.beatsPerMeasure}/4
            {metronome.subdivisions && ` (with ${metronome.subdivisionType} subdivisions)`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChordProgressionGenerator 