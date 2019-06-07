import React from "react";
import AudioAnalyser from "../AudioAnalyser/AudioAnalyser";
import Tuning from "../Tuning/Tuning";
import Waveform from "../Waveform/Waveform";
import Envelope from "../Envelope/Envelope";
import {justKeyToFrequency, equalKeyToFrequency} from "./frequencies.js";
import "./Synth.css";

const EnvGen = require("fastidious-envelope-generator");

class Synth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeOscillators: {},
      audioData: new Uint8Array(0),
      tuning: {type: "just", frequencies: justKeyToFrequency},
      waveform: "sine",
      envelope: {attack: 0.1, decay: 0.01, sustain: 1, release: 0.1},
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.setTuning = this.setTuning.bind(this);
    this.setWaveform = this.setWaveform.bind(this);
    this.setEnvelope = this.setEnvelope.bind(this);
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.volume = this.audioContext.createGain();
  }

  componentDidMount() {
    this.volume.gain.value = 0.2;
    this.volume.connect(this.audioContext.destination);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }
  handleKeyDown(event) {
    const key = event.key;
    if (!this.state.activeOscillators[key] && this.state.tuning.frequencies[key]) {
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
    oscillator.frequency.value = this.state.tuning.frequencies[key];
    oscillator.type = this.state.waveform;
    const amp = this.audioContext.createGain();
    amp.connect(this.volume);
    const envelope = new EnvGen(this.audioContext, amp.gain);
    envelope.mode = "ADSR";
    envelope.attackTime = this.state.envelope.attack;
    envelope.decayTime = this.state.envelope.decay;
    envelope.sustainLevel = this.state.envelope.sustain;
    envelope.releaseTime = this.state.envelope.release;
    this.setState((prevState) => ({
      activeOscillators: {
        ...prevState.activeOscillators,
        [key]: {oscillator: oscillator, envelope: envelope},
      },
    }));
    this.state.activeOscillators[key].oscillator.connect(amp);
    this.state.activeOscillators[key].oscillator.start();
    this.state.activeOscillators[key].envelope.gateOn(this.audioContext.currentTime);
  }

  stop(key) {
    this.state.activeOscillators[key].envelope.gateOff(this.audioContext.currentTime);
    // stop oscillator after 10 seconds, mostly for performance. Does it actually affect it? Will have to research that
    this.state.activeOscillators[key].oscillator.stop(this.audioContext.currentTime + 10);
    delete this.state.activeOscillators[key];
  }

  setTuning(event) {
    let frequencies = justKeyToFrequency;
    if (event.target.value === "equal") {
      frequencies = equalKeyToFrequency;
    }
    this.setState({tuning: {type: event.target.value, frequencies: frequencies}});
  }

  setWaveform(event) {
    this.setState({waveform: event.target.value});
  }

  setEnvelope(type, value) {
    this.setState((prevState) => ({
      envelope: {
        ...prevState.envelope,
        [type]: value,
      },
    }));
  }

  render() {
    return (
      <div className="synthDiv">
        <AudioAnalyser audioContext={this.audioContext} activeOscillators={this.state.activeOscillators} amp={this.volume}/>
        <h2>Synth Parameters</h2>
        <div className="parameters">
          <Tuning setTuning={this.setTuning} tuning={this.state.tuning.type} />
          <Waveform setWaveform={this.setWaveform} waveform={this.state.waveform}/>
          <Envelope setEnvelope={this.setEnvelope} envelope={this.state.envelope}/>
        </div>
      </div>
    );
  }
}

export default Synth;
