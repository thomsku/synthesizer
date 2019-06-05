import React from "react";
import EnvelopeGraph from "adsr-envelope-graph";
import Slider from "@material-ui/lab/Slider";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";
import {fade} from "@material-ui/core/styles/colorManipulator";
import "./Envelope.css";

const StyledSlider = withStyles({
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    "&$focused, &:hover": {
      boxShadow: `0px 0px 0px ${8}px ${fade("#de235b", 0.16)}`,
    },
    "&$activated": {
      boxShadow: `0px 0px 0px ${8 * 1.5}px ${fade("#de235b", 0.16)}`,
    },
    "&$jumped": {
      boxShadow: `0px 0px 0px ${8 * 1.5}px ${fade("#de235b", 0.16)}`,
    },
  },
  track: {
    backgroundColor: "#fff",
    height: 8,
  },
  trackAfter: {
    backgroundColor: "#fff",
  },
  focused: {},
  activated: {},
  jumped: {},
})(Slider);

class Envelope extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.5,
      release: 0.1,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value, type) {
    console.log(type);
    this.setState({[type]: value});
  }
  render() {
    return (
      <div className="envelope">
        <div className="graph">
          <EnvelopeGraph style={
            {height: "100%", width: "100%"}}
          a={this.state.attack}
          d={this.state.decay}
          s={this.state.sustain}
          r={this.state.release}
          />
        </div>
        <div className="sliders">

          <Typography id="label">A</Typography>
          <StyledSlider
            id="attack"
            className="slider"
            value={this.state.attack}
            min={0.01}
            max={5}
            aria-labelledby="label"
            onChange={(event, value) => {
              this.handleChange(event, value, "attack");
            }}
          />
          <Typography id="label">D</Typography>
          <StyledSlider
            id="attack"
            className="slider"
            value={this.state.decay}
            min={0.01}
            max={5}
            aria-labelledby="label"
            onChange={(event, value) => {
              this.handleChange(event, value, "decay");
            }}
          />
          <Typography id="label">S</Typography>
          <StyledSlider
            id="attack"
            className="slider"
            value={this.state.sustain}
            min={0}
            max={1}
            aria-labelledby="label"
            onChange={(event, value) => {
              this.handleChange(event, value, "sustain");
            }}
          />
          <Typography id="label">R</Typography>
          <StyledSlider
            id="attack"
            className="slider release"
            value={this.state.release}
            min={0.01}
            max={5}
            aria-labelledby="label"
            onChange={(event, value) => {
              this.handleChange(event, value, "release");
            }}
          />
        </div>
      </div>
    );
  }
}

export default Envelope;
