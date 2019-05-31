import React from "react";

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
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidMount() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);

    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
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
      this.state.activeOscillators[key].connect(this.gainNode);
      this.state.activeOscillators[key].start();
    }
  }

  handleKeyUp(event) {
    const key = event.key;
    if (this.state.activeOscillators[key]) {
      this.state.activeOscillators[key].stop();
      delete this.state.activeOscillators[key];
    }
  }

  render() {
    return (
      <div className="synthDiv">

      </div>
    );
  }
}

export default Synth;
