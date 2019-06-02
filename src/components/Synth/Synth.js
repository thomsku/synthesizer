import React from "react";
import AudioAnalyser from "../AudioAnalyser/AudioAnalyser";
import Tuning from "../Tuning/Tuning";
import Waveform from "../Waveform/Waveform";
import Envelope from "../Envelope/Envelope";
const EnvGen = require("fastidious-envelope-generator");

// This is tuned to just intonation
const keyToFrequency = {
  a: 261.63,
  s: 294.33,
  d: 327.03,
  f: 392.44,
  g: 436.05,
  h: 523.25,
  j: 588.66,
  k: 654.06,
  l: 697.66,
};


class Synth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeOscillators: {},
      audioData: new Uint8Array(0),
    };

    this.counter = 0;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.amp = this.audioContext.createGain();
    this.amp.gain.value = 0.2;
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.minDecibels = -50;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.85;

    this.amp.connect(this.analyser);
    this.amp.connect(this.audioContext.destination);
    // this.analyser.fftSize = 256;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    this.rafId = requestAnimationFrame(this.tick);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.source.disconnect();
  }

  tick() {
    if ((this.counter & 7) === 0) {
      this.analyser.getByteTimeDomainData(this.dataArray);
      this.setState({audioData: this.dataArray});
    }
    this.rafId = requestAnimationFrame(this.tick);
    this.counter += 1;
  }

  handleKeyDown(event) {
    const key = event.key;
    if (!this.state.activeOscillators[key] && keyToFrequency[key]) {
      const oscillator = this.audioContext.createOscillator();
      oscillator.frequency.setValueAtTime(keyToFrequency[key], this.audioContext.currentTime);
      this.setState((prevState) => ({
        activeOscillators: {
          ...prevState.activeOscillators,
          [key]: oscillator,
        },
      }));
      this.state.activeOscillators[key].connect(this.amp);
      this.state.activeOscillators[key].start();
      this.eg = new EnvGen(this.audioContext, this.amp.gain);
      this.eg.mode = "ADSR";
      this.eg.attackTime = 1;
      this.eg.decayTime = 1;
      this.eg.releaseTime = 1;
      this.eg.gateOn(this.audioContext.currentTime);
    }
  }

  handleKeyUp(event) {
    const key = event.key;
    if (this.state.activeOscillators[key]) {
      this.state.activeOscillators[key].stop();
      delete this.state.activeOscillators[key];
      this.eg.gateOff(this.audioContext.currentTime);
    }
  }

  render() {
    return (
      <div className="synthDiv">
        <AudioAnalyser activeOscillators={this.state.activeOscillators}/>
        <Tuning setTuning={this.setTuning} />
        <Waveform setWaveform={this.setWaveform}/>
        <Envelope setEnvelope={this.setEnvelope}/>
      </div>
    );
  }
}

export default Synth;
