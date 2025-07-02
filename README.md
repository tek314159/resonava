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
  - **Relative major scale** for all minor modes (correctly calculated for each mode)
- **Color-coded Chords**: Major (green), Minor (purple), Diminished (red)

### ⏱️ Metronome
- **BPM Control**: 40-200 BPM with real-time slider
- **Beats per Measure**: 2-16 beats with intuitive slider control
- **Volume Control**: 0-100% volume adjustment with real-time updates
- **Accent First Beat**: Optional different tone for the first beat of each measure
- **Subdivisions**: 
  - **Simple subdivisions** (2:1 ratio - eighth notes)
  - **Compound subdivisions** (3:1 ratio - triplets)
  - Attractive toggle buttons for easy selection
- **Professional Audio**: High-quality tones using Web Audio API with single audio context
- **Real-time Updates**: Settings change immediately while playing
- **Instant Start**: Metronome starts immediately when play button is pressed

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
   - **Relative major scale** (correctly calculated for each mode)

### Using the Metronome
1. **Set BPM**: Use the slider to adjust tempo (40-200 BPM)
2. **Adjust Volume**: Use the volume slider (0-100%) for comfortable listening
3. **Configure Beats**: Use the slider to set beats per measure (2-16)
4. **Enable Features**:
   - Check "Accent first beat" for emphasis on downbeats
   - Check "Enable subdivisions" for additional rhythmic guidance
5. **Choose Subdivision Type** (if enabled):
   - **Simple**: Eighth notes (2:1 ratio)
   - **Compound**: Triplets (3:1 ratio)
6. **Start/Stop**: Click the play button to begin or stop the metronome

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
- **Relative Major Calculation**: 
  - **Minor (Aeolian)**: 3rd degree of scale
  - **Dorian**: 7th degree of scale
  - **Mixolydian**: 4th degree of scale
  - **Phrygian**: 6th degree of scale
  - **Lydian**: 2nd degree of scale
  - **Locrian**: 5th degree of scale
  - Proper enharmonic spelling for all relative majors

### Audio Design
- **Main Beats**: 600Hz (regular) / 800Hz (accented)
- **Subdivisions**: 400Hz (gentle, lower volume)
- **Volume Control**: User-adjustable volume (0-100%) with real-time application
- **Single Audio Context**: Prevents audio overload and memory leaks
- **Real-time Updates**: Metronome restarts when settings change
- **Stable Audio**: Ref-based state management prevents audio glitches

### UI/UX Improvements
- **Slider Controls**: Replaced problematic dropdowns with reliable sliders
- **Toggle Buttons**: Attractive subdivision selection with visual feedback
- **Volume Control**: Dedicated volume slider with percentage display
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Color-coded Interface**: Each mode has its own theme color
- **Instant Feedback**: All controls respond immediately

### Responsive Design
- **Desktop**: Full-featured interface with fixed-height containers
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly controls with simplified layout

## Recent Updates

### v2.0 - UI & Audio Improvements
- ✅ **Fixed metronome start issue** - now starts immediately on play button
- ✅ **Added volume control** - 0-100% slider with real-time updates
- ✅ **Replaced dropdowns** - beats per measure now uses reliable slider (2-16)
- ✅ **Improved subdivision controls** - attractive toggle buttons instead of dropdown
- ✅ **Fixed relative major calculation** - correct for all 7 modes with proper enharmonic spelling
- ✅ **Updated page title** - now shows "Chord Progression Generator"
- ✅ **Enhanced audio stability** - ref-based state management prevents audio glitches
- ✅ **Improved mobile experience** - better touch controls and responsive design

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
- Music theory implementation based on standard practice
