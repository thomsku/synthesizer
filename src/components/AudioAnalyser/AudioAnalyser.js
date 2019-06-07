import React from "react";
import AudioVisualiser from "../AudioVisualiser/AudioVisualiser";
import PropTypes from "prop-types";

class AudioAnalyser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {audioData: new Uint8Array(0)};
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.analyser = this.props.audioContext.createAnalyser();
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.props.amp.connect(this.analyser);
    this.rafId = requestAnimationFrame(this.tick);
  }

  tick() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.setState({audioData: this.dataArray});
    this.rafId = requestAnimationFrame(this.tick);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
  }

  render() {
    return (
      <div>
        <AudioVisualiser audioData={this.state.audioData}/>
      </div>
    );
  }
}

AudioAnalyser.propTypes = {
  audioContext: PropTypes.object.isRequired,
  amp: PropTypes.object.isRequired,
};

export default AudioAnalyser;
