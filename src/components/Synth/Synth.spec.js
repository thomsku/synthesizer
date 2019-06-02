/* eslint-disable react/jsx-key */
import React from "react";
import {shallow} from "enzyme";
import Synth from "./Synth";
import AudioAnalyser from "../AudioAnalyser/AudioAnalyser";
import Tuning from "../Tuning/Tuning";
import Waveform from "../Waveform/Waveform";
import Envelope from "../Envelope/Envelope";
require("./AudioContext.mock.js");

describe("Synth", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<Synth />));

  it("should render correctly", () => expect(wrapper).toMatchSnapshot());

  it("should render a <div />", () => {
    expect(wrapper.find("div")).toHaveLength(1);
  });

  it("should render the AudioAnalyser, Tuning, Waveform and Envelope Components", () => {
    expect(wrapper.containsAllMatchingElements([
      <AudioAnalyser activeOscillators={wrapper.instance().state.activeOscillators}/>,
      <Tuning setTuning={wrapper.instance().setTuning}/>,
      <Waveform setWaveform={wrapper.instance().setWaveform}/>,
      <Envelope setEnvelope={wrapper.instance().setEnvelope}/>,
    ])).toEqual(true);
  });
});
