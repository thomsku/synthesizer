import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import PropTypes from "prop-types";
import "./Tuning.css";

const Tuning = ({
  setTuning,
  tuning,
}) => {
  return (
    <div className="radiobuttons">
      <FormLabel className="parametertitle" component="legend">Tuning</FormLabel>
      <RadioGroup
        aria-label="Tuning"
        name="tuning"
        className="radiogroup"
        value={tuning}
        onChange={setTuning}
      >
        <FormControlLabel className="radiolabel" value="just" control={<Radio className="radio"/>} label="just intonation" />
        <FormControlLabel className="radiolabel" value="equal" control={<Radio className="radio"/>} label="equal temperament" />

      </RadioGroup>
    </div>
  );
};

Tuning.propTypes = {
  setTuning: PropTypes.func.isRequired,
  tuning: PropTypes.string.isRequired,
};

export default Tuning;
