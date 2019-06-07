import React, {Component} from "react";
import PropTypes from "prop-types";

class AudioVisualiser extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw() {
    const canvas = this.canvas.current;
    const width = canvas.width;
    const height = canvas.height;
    const context = canvas.getContext("2d");
    const scaling = height / 256;
    let risingEdge = 0;
    const edgeThreshold = 5;

    context.fillStyle = "rgba(40, 56, 68, 0.21)";
    context.clearRect(0, 0, width, height);

    context.lineWidth = 2;
    context.strokeStyle = "#fff";
    context.beginPath();

    // No buffer overrun protection
    while (this.props.audioData[risingEdge++] - 128 > 0 && risingEdge <= width);
    if (risingEdge >= width) risingEdge = 0;

    while (this.props.audioData[risingEdge++] - 128 < edgeThreshold && risingEdge <= width);
    if (risingEdge >= width) risingEdge = 0;

    for (let x = risingEdge; x < this.props.audioData.length && x - risingEdge < width; x++) {
      context.lineTo(x - risingEdge, height - this.props.audioData[x] * scaling);
    }

    context.stroke();
  }

  render() {
    return <canvas width="800" height="256" ref={this.canvas} />;
  }
}

AudioVisualiser.propTypes = {
  audioData: PropTypes.object.isRequired,
};

export default AudioVisualiser;
