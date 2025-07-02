# Chord Progression Generator

A responsive web application that generates random chord progressions with a built-in metronome for music composition and practice. Built with React.

## Features

### 🎵 Chord Progression Generator
- **Circle of Fifths Keys**: Generates keys that follow proper music theory (no enharmonic errors like D# - uses Eb instead)
- **Weighted Modes**: 
  - Major and Minor modes (25% each, 50% combined)
  - Dorian, Mixolydian, Phrygian, Lydian, Locrian (remaining 50%)
- **Random Progressions**: 3-4 chord progressions (80% 4-chord, 20% 3-chord) with the I/i chord always in first or last position
- **No Repetition**: Maximum of 2 of the same chord per progression
- **Visual Themes**: Each mode has its own color theme (Major=green, Minor=purple, etc.)
- **Reference Information**: 
  - Scale notes for the selected key and mode (properly spelled with correct letters)
  - Chord notes for each progression chord
  - Relative major scale (for minor modes)
- **Color-coded Chords**: Major (green), Minor (purple), Diminished (red)

### ⏱️ Metronome
- **BPM Control**: 40-200 BPM with real-time slider
- **Time Signatures**: Configurable beats per measure (2-8) and beat values (2, 4, 8, 16)
- **Accent First Beat**: Optional different tone for the first beat of each measure
- **Subdivisions**: 
  - Simple subdivisions (2:1 ratio - eighth notes)
  - Compound subdivisions (3:1 ratio - triplets)
- **Professional Audio**: High-quality tones using Web Audio API with single audio context
- **Real-time Updates**: Settings change immediately while playing

## Tech Stack

- **Frontend**: React 19 with Vite
- **Styling**: Plain CSS with responsive design
- **Audio**: Web Audio API with single audio context

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "chord progressions gpt"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production files will be created in the `dist/` folder.

## Usage

### Generating Chord Progressions
1. Click the "Generate" button to create a new progression
2. The app will display:
   - Key and mode with color-coded theme
   - Chord progression with color-coded chord qualities (I, ii, iii, IV, V, vi, vii°)
   - Scale notes for the key (properly spelled)
   - Individual chord notes
   - Relative major (if applicable)

### Using the Metronome
1. **Set BPM**: Use the slider to adjust tempo (40-200 BPM)
2. **Configure Time Signature**: 
   - Select beats per measure (2-8)
   - Select beat value (2, 4, 8, 16)
3. **Enable Features**:
   - Check "Accent first beat" for emphasis on downbeats
   - Check "Enable subdivisions" for additional rhythmic guidance
4. **Choose Subdivision Type** (if enabled):
   - Simple: Eighth notes (2:1 ratio)
   - Compound: Triplets (3:1 ratio)
5. **Start/Stop**: Click the play button to begin or stop the metronome

## Project Structure

```
chord progressions gpt/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Styles for the application
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── dist/                # Production build output
├── public/              # Static assets
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Features in Detail

### Music Theory Implementation
- **Circle of Fifths**: Only uses proper keys (C, G, D, A, E, B, F#, Db, Ab, Eb, Bb, F)
- **Mode Intervals**: Accurate semitone intervals for all 7 modes
- **Chord Qualities**: Proper major, minor, and diminished chord construction
- **Roman Numerals**: Standard notation (I, ii, iii, IV, V, vi, vii°)
- **Scale Spelling**: Correct note letters with proper accidentals

### Audio Design
- **Main Beats**: 600Hz (regular) / 800Hz (accented)
- **Subdivisions**: 400Hz (gentle, lower volume)
- **Volume Control**: Accented beats louder, subdivisions softer
- **Single Audio Context**: Prevents audio overload and memory leaks
- **Real-time Updates**: Metronome restarts when settings change

### Responsive Design
- **Desktop**: Full-featured interface with fixed-height containers
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly controls with simplified layout

## Live Demo

The application is live at: [resonava.com](https://resonava.com)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with React and Vite for modern web development
- Uses Web Audio API for high-quality metronome sounds
