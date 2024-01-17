import { Play, StopCircle } from 'lucide-react'
import './App.css'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'


// Note: If you just want to process 
// audio data, for instance, buffer and stream it but not play it, you might want to look into creating an OfflineAudioContext.


function App() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  const [playing, setPlaying] = useState(false)
  const [gain, setGain] = useState(1)
  const [volume, setVolume] = useState(1)
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

    let track = null
    if (audioElement) {
      const track = audioContext.createMediaElementSource(audioElement)

      if (gainNode && panner) {
        track.connect(gainNode).connect(panner).connect(audioContext.destination)

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
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input type='range' id="gain" className='rotate' min={-1} max={2} value={gain} step={0.01} onChange={onGainChange} />
          <label htmlFor='gain'>Gain</label>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input type='range' id="volume" className='rotate' min={0} max={2} value={volume} step={0.01} onChange={onVolumeChange} />
          <label htmlFor='volume'>Volume</label>
        </div>
      </div>

      <button style={{ display: 'block' }} onClick={togglePlay}>{playing ? (
        <StopCircle />
      ) : (
        <Play />
      )}</button>
      <audio ref={audioRef} src='/src/assets/Somewhere between grief, prayer & liberation.mp3' onEnded={() => setPlaying(false)}></audio>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <input type="range" id="panner" min="-1" max="1" value={pan} step={0.01} onChange={onPannerChange} />
      </div>
    </div>
  )
}

export default App
