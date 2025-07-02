import { useState, useEffect, useRef } from 'react'
import './App.css'

// Import the chord progression component (we'll create this)
import ChordProgressionGenerator from './components/ChordProgressionGenerator'

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

// Color themes for each mode (brightness/darkness)
const MODE_COLORS = {
  'Major (Ionian)':      { bg: '#e8f5e8', text: '#2d5a2d', border: '#4a7c59' },
  'Minor (Aeolian)':     { bg: '#f0e8f5', text: '#4a2d5a', border: '#7c4a7c' },
  'Dorian':              { bg: '#e8f0f5', text: '#2d4a5a', border: '#4a7c7c' },
  'Phrygian':            { bg: '#f5e8e8', text: '#5a2d2d', border: '#7c4a4a' },
  'Lydian':              { bg: '#f5f0e8', text: '#5a4a2d', border: '#7c7c4a' },
  'Mixolydian':          { bg: '#e8f5f0', text: '#2d5a4a', border: '#4a7c7c' },
  'Locrian':             { bg: '#f0f0f0', text: '#4a4a4a', border: '#7c7c7c' },
};

// Chord quality colors
const CHORD_COLORS = {
  'maj': '#2d5a2d',    // Dark green for major
  'min': '#4a2d5a',    // Purple for minor
  'dim': '#5a2d2d',    // Dark red for diminished
};

function getChordColor(quality) {
  return CHORD_COLORS[quality] || '#333';
}

function App() {
  const [currentPage, setCurrentPage] = useState('chord-progression')
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const navigateTo = (page) => {
    setCurrentPage(page)
    closeMenu()
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'chord-progression':
        return <ChordProgressionGenerator />
      default:
        return <ChordProgressionGenerator />
    }
  }

  return (
    <div className="app">
      {/* Menu Bar */}
      <header className="menu-bar">
        <div className="menu-bar-content">
          <h1 className="app-title">Resonava</h1>
          <button 
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Hamburger Menu */}
      <nav className={`hamburger-menu ${menuOpen ? 'open' : ''}`}>
        <div className="menu-overlay" onClick={closeMenu}></div>
        <div className="menu-content">
          <div className="menu-header">
            <h2>Menu</h2>
            <button className="close-menu" onClick={closeMenu}>×</button>
          </div>
          <ul className="menu-items">
            <li>
              <button 
                className={`menu-item ${currentPage === 'chord-progression' ? 'active' : ''}`}
                onClick={() => navigateTo('chord-progression')}
              >
                Chord Progression Generator
              </button>
            </li>
            {/* Future menu items can be added here */}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
