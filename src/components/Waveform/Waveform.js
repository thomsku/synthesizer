import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import PropTypes from "prop-types";
import "./Waveform.css";

const Waveform = ({
  setWaveform,
  waveform,
}) => {
  return (
    <div className="radiobuttons">
      <FormLabel className="parametertitle" component="legend">Waveform</FormLabel>
      <RadioGroup
        aria-label="Waveform"
        name="waveform"
        className="radiogroup"
        value={waveform}
        onChange={setWaveform}
      >
        <FormControlLabel className="radiolabel" value="sine" control={<Radio className="radio"/>} label="sine" />
        <FormControlLabel className="radiolabel" value="square" control={<Radio className="radio"/>} label="square" />
        <FormControlLabel className="radiolabel" value="sawtooth" control={<Radio className="radio"/>} label="sawtooth" />
        <FormControlLabel className="radiolabel" value="triangle" control={<Radio className="radio"/>} label="triangle" />

      </RadioGroup>
    </div>
  );
};

Waveform.propTypes = {
  setWaveform: PropTypes.func.isRequired,
  waveform: PropTypes.string.isRequired,
};

export default Waveform;
