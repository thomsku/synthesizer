/* eslint-disable react/jsx-key */
import React from "react";
import {shallow, mount} from "enzyme";
import Synth from "./Synth";
import AudioAnalyser from "../AudioAnalyser/AudioAnalyser";
import Tuning from "../Tuning/Tuning";
import Waveform from "../Waveform/Waveform";
import Envelope from "../Envelope/Envelope";
import {RadioGroup} from "@material-ui/core";
require("./AudioContext.mock.js");

describe("Synth", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<Synth />));

  it("should render correctly", () => expect(wrapper).toMatchSnapshot());

  it("should render two <div />", () => {
    expect(wrapper.find("div")).toHaveLength(2);
  });

  it("should render the AudioAnalyser, Tuning, Waveform and Envelope Components", () => {
    expect(wrapper.containsAllMatchingElements([
      <AudioAnalyser activeOscillators={wrapper.instance().state.activeOscillators}/>,
      <Tuning setTuning={wrapper.instance().setTuning} tuning="just"/>,
      <Waveform setWaveform={wrapper.instance().setWaveform} waveform="sine"/>,
      <Envelope setEnvelope={wrapper.instance().setEnvelope}/>,
    ])).toEqual(true);
  });
});

describe("mounted Synth", () => {
  let wrapper;
  window.HTMLCanvasElement.prototype.getContext = () => {
    return {
      beginPath: jest.fn(),
      clearRect: jest.fn(),
      lineTo: jest.fn(),
      moveTo: jest.fn(),
      stroke: jest.fn(),
    };
  };

  beforeEach(() => wrapper = mount(<Synth />));

  it("calls play() when the right key is pressed", () => {
    const spy = jest.spyOn(wrapper.instance(), "play");
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.instance().handleKeyDown({key: "a"});
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("calls stop() when the right key is released", () => {
    const spy = jest.spyOn(wrapper.instance(), "stop");
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.instance().handleKeyDown({key: "a"});
    wrapper.instance().handleKeyUp({key: "a"});
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("does not call play() when the wrong key is pressed", () => {
    const spy = jest.spyOn(wrapper.instance(), "play");
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.instance().handleKeyDown({key: "x"});
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it("does not call stop() when the wrong key is released", () => {
    const spy = jest.spyOn(wrapper.instance(), "stop");
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.instance().handleKeyDown({key: "x"});
    wrapper.instance().handleKeyUp({key: "x"});
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it("calls setTuning when the tuning radio buttons are changed", () => {
    const spy = jest.spyOn(wrapper.instance(), "setTuning");
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.find(RadioGroup).at(0).find("input").at(1).simulate("change", {target: {value: "equal"}});
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("calls setWaveform when the waveform radio buttons are changed", () => {
    const spy = jest.spyOn(wrapper.instance(), "setWaveform");
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.find(RadioGroup).at(1).find("input").at(1).simulate("change", {target: {value: "square"}});
    expect(spy).toHaveBeenCalledTimes(1);
  });

  afterAll(() => wrapper.unmount());
});
