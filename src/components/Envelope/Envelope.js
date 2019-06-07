import React from "react";
import EnvelopeGraph from "adsr-envelope-graph";
import Slider from "@material-ui/lab/Slider";
import Typography from "@material-ui/core/Typography";
import FormLabel from "@material-ui/core/FormLabel";
import {withStyles} from "@material-ui/core/styles";
import {fade} from "@material-ui/core/styles/colorManipulator";
import PropTypes from "prop-types";
import "./Envelope.css";

const StyledSlider = withStyles({
  thumb: {
    height: 20,
    width: 20,
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
    height: 2,
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
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, value, type) {
    this.props.setEnvelope(type, value);
  }
  render() {
    return (
      <div className="envelope">
        <FormLabel className="envelopeparametertitle" component="legend">Envelope</FormLabel>
        <div className="graph">
          <EnvelopeGraph style={
            {height: "100%", width: "100%"}}
          lineStyle={
            {strokeWidth: "1.5px"}
          }
          a={this.props.envelope.attack}
          d={this.props.envelope.decay}
          s={this.props.envelope.sustain}
          r={this.props.envelope.release}
          />
        </div>
        <div className="sliders">

          <Typography id="label">attack</Typography>
          <StyledSlider
            id="attack"
            className="slider"
            value={this.props.envelope.attack}
            min={0.01}
            max={2}
            aria-labelledby="label"
            onChange={(event, value) => {
              this.handleChange(event, value, "attack");
            }}
          />
          <Typography id="label">decay</Typography>
          <StyledSlider
            id="attack"
            className="slider"
            value={this.props.envelope.decay}
            min={0.01}
            max={2}
            aria-labelledby="label"
            onChange={(event, value) => {
              this.handleChange(event, value, "decay");
            }}
          />
          <Typography id="label">sustain</Typography>
          <StyledSlider
            id="attack"
            className="slider"
            value={this.props.envelope.sustain}
            min={0}
            max={1}
            aria-labelledby="label"
            onChange={(event, value) => {
              this.handleChange(event, value, "sustain");
            }}
          />
          <Typography id="label">release</Typography>
          <StyledSlider
            id="attack"
            className="slider release"
            value={this.props.envelope.release}
            min={0.01}
            max={2}
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

Envelope.propTypes = {
  setEnvelope: PropTypes.func.isRequired,
  envelope: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default Envelope;
