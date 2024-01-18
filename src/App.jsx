import { Play, StopCircle } from 'lucide-react'
import './App.css'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { analyseAudio } from './helpers/audioHelpers';


// Note: If you just want to process 
// audio data, for instance, buffer and stream it but not play it, you might want to look into creating an OfflineAudioContext.


function App() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  // const AUDIO_SRC = '/src/assets/Somewhere between grief, prayer & liberation.mp3'
  const AUDIO_SRC = '/src/assets/All_ends_well.mp3'

  const [playing, setPlaying] = useState(false)
  const [gain, setGain] = useState(1)
  const [volume, setVolume] = useState(0.5)
  const [pan, setPan] = useState(0)
  const [audioElement, setAudioElement] = useState(null)
  const audioRef = useRef()


  useEffect(() => {
    const ele = document.querySelector('audio')
    setAudioElement(ele)

  }, [])
  //  how big our sound wave is. // default;1, min:~-3.4028235E38; max:~3.4028235E38 (loat number range in JavaScript)



  const { gainNode, audioContext, panner } = useMemo(() => {
    const audioContext = new AudioContext()

    const gainNode = audioElement ? audioContext.createGain() : null
    const pannerOptions = { pan: 0 };
    const panner = new StereoPannerNode(audioContext, pannerOptions);

    /**
     * Analyser
     */


    let track = null
    if (audioElement) {
      // The "source"
      const track = audioContext.createMediaElementSource(audioElement)
      const analyser = audioContext.createAnalyser()
      console.log('analyser ', analyser)


      if (gainNode && panner && AudioContext && analyser) {
        track.connect(analyser).connect(gainNode).connect(panner).connect(audioContext.destination)
        analyseAudio(analyser)



      }

    }
    return { gainNode, panner, track, audioContext }
  }, [AudioContext, audioElement])





  const togglePlay = useCallback(() => {

    if (audioContext) {
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }

      if (playing) {
        audioElement.pause()
      } else {
        audioElement.play()
      }

      setPlaying((prev) => !prev)
    }
  }, [audioContext, audioElement, playing])

  const onGainChange = useCallback((e) => {
    const newGain = e.target.value
    if (gainNode) {
      console.log(newGain)
      gainNode.gain.value = newGain
      setGain(newGain)
    }
  }, [gainNode])

  const onVolumeChange = useCallback((e) => {
    const newVolume = e.target.value
    if (audioElement) {
      console.log(newVolume)
      setVolume(newVolume)

      audioElement.volume = newVolume
    }
  }, [audioElement])

  const onPannerChange = useCallback((e) => {
    if (panner) {
      const newPan = e.target.value
      setPan(newPan)
      panner.pan.value = newPan
    }
  }, [panner])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <canvas style={{ width: '80%', height: '150px', background: 'white', margin: 'auto', top: 0 }}></canvas>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <input type='range' id="gain" className='rotate' min={-1} max={2} value={gain} step={0.01} onChange={onGainChange} />
          <label htmlFor='gain'>Gain</label>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input type='range' id="volume" className='rotate' min={0} max={1} value={volume} step={0.01} onChange={onVolumeChange} />
          <label htmlFor='volume'>Volume</label>
        </div>
      </div>

      <button style={{ display: 'block', width: 'fit-content' }} onClick={togglePlay}>{playing ? (
        <StopCircle />
      ) : (
        <Play />
      )}</button>
      <audio ref={audioRef} src={AUDIO_SRC} onEnded={() => setPlaying(false)}></audio>
      <div >
        <input type="range" id="panner" min="-1" max="1" value={pan} step={0.01} onChange={onPannerChange} />
      </div>
    </div>
  )
}

export default App
