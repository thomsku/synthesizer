import React from "react";
import AudioAnalyser from "../AudioAnalyser/AudioAnalyser";
import Tuning from "../Tuning/Tuning";
import Waveform from "../Waveform/Waveform";
import Envelope from "../Envelope/Envelope";
import "./Synth.css";
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
      tuning: "just",
      waveform: "sine",
    };

    this.counter = 0;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.tick = this.tick.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.setTuning = this.setTuning.bind(this);
    this.setWaveform = this.setWaveform.bind(this);
  }

  componentDidMount() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.minDecibels = -50;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.85;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    this.rafId = requestAnimationFrame(this.tick);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    // this.source.disconnect();
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
      this.play(key);
    }
  }

  handleKeyUp(event) {
    const key = event.key;
    if (this.state.activeOscillators[key]) {
      this.stop(key);
    }
  }

  play(key) {
    const oscillator = this.audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(keyToFrequency[key], this.audioContext.currentTime);
    const amp = this.audioContext.createGain();
    amp.gain.value = 0.2;
    amp.connect(this.analyser);
    amp.connect(this.audioContext.destination);
    const envelope = new EnvGen(this.audioContext, amp.gain);
    envelope.mode = "ADSR";
    envelope.attackTime = 0.01;
    envelope.decayTime = 0.01;
    envelope.sustainLevel = 0;
    envelope.releaseTime = 0.1;
    this.setState((prevState) => ({
      activeOscillators: {
        ...prevState.activeOscillators,
        [key]: {oscillator: oscillator, amp: amp, envelope: envelope},
      },
    }));
    this.state.activeOscillators[key].oscillator.connect(this.state.activeOscillators[key].amp);
    this.state.activeOscillators[key].oscillator.start();
    this.state.activeOscillators[key].envelope.gateOn(this.audioContext.currentTime);
  }

  stop(key) {
    this.state.activeOscillators[key].envelope.gateOff(this.audioContext.currentTime);
    // this.state.activeOscillators[key].oscillator.stop();
    delete this.state.activeOscillators[key];
  }

  setTuning(event) {
    this.setState({tuning: event.target.value});
  }

  setWaveform(event) {
    this.setState({waveform: event.target.value});
  }

  render() {
    return (
      <div className="synthDiv">
        <AudioAnalyser activeOscillators={this.state.activeOscillators}/>
        <h2>Synth Parameters</h2>
        <div className="parameters">
          <Tuning setTuning={this.setTuning} tuning={this.state.tuning} />
          <Waveform setWaveform={this.setWaveform} waveform={this.state.waveform}/>
          <Envelope setEnvelope={this.setEnvelope}/>
        </div>
      </div>
    );
  }
}

export default Synth;
