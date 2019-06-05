import React from "react";
import AudioVisualiser from "../AudioVisualiser/AudioVisualiser";

class AudioAnalyser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {audioData: new Uint8Array(0)};
  }
  render() {
    return (
      <div>
        <AudioVisualiser audioData={this.state.audioData}/>
      </div>
    );
  }
}

export default AudioAnalyser;
