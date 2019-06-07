import React from "react";
import {shallow, mount} from "enzyme";
import Synth from "./Synth";
import AudioAnalyser from "../AudioAnalyser/AudioAnalyser";
import Tuning from "../Tuning/Tuning";
import Waveform from "../Waveform/Waveform";
import Envelope from "../Envelope/Envelope";
import {RadioGroup} from "@material-ui/core";
import {Slider} from "@material-ui/lab";
import EnvelopeGraph from "adsr-envelope-graph";
import {justKeyToFrequency, equalKeyToFrequency} from "./frequencies.js";
require("./AudioContext.mock.js");

describe("Synth", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<Synth />));

  it("should render correctly", () => expect(wrapper).toMatchSnapshot());

  it("should render three <div />", () => {
    expect(wrapper.find("div")).toHaveLength(3);
  });

  it("should render the AudioAnalyser, Tuning, Waveform and Envelope Components", () => {
    expect(wrapper.containsAllMatchingElements([
      <AudioAnalyser
        key="AudioAnalyser"
        audioContext={wrapper.instance().audioContext}
        activeOscillators={wrapper.instance().state.activeOscillators}
        amp={wrapper.instance().volume}/>,
      <Tuning
        key="Tuning"
        setTuning={wrapper.instance().setTuning}
        tuning="just"/>,
      <Waveform
        key="Waveform"
        setWaveform={wrapper.instance().setWaveform}
        waveform="sine"/>,
      <Envelope
        key="Envelope"
        setEnvelope={wrapper.instance().setEnvelope}
        envelope={{attack: 0.1, decay: 0.01, sustain: 1, release: 0.1}}
      />,
    ])).toEqual(true);
  });
});

describe("mounted Synth", () => {
  let wrapper;
  window.HTMLCanvasElement.prototype.getContext = () => {
    return {
      width: 0,
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

  it("calls setEnvelope when the envelope sliders are changed", () => {
    const spy = jest.spyOn(wrapper.instance(), "setEnvelope");
    wrapper.instance().forceUpdate();
    expect(spy).toHaveBeenCalledTimes(0);
    wrapper.find(Slider).at(0).props().onChange(null, 0.2);
    expect(spy).toHaveBeenCalledTimes(1);
    wrapper.find(Slider).at(1).props().onChange(null, 0.2);
    expect(spy).toHaveBeenCalledTimes(2);
    wrapper.find(Slider).at(2).props().onChange(null, 0.2);
    expect(spy).toHaveBeenCalledTimes(3);
    wrapper.find(Slider).at(3).props().onChange(null, 0.2);
    expect(spy).toHaveBeenCalledTimes(4);
  });

  afterAll(() => wrapper.unmount());
});

describe("play", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<Synth />));

  it("updates activeOscillators", () => {
    expect(wrapper.state("activeOscillators")).toEqual({});
    wrapper.instance().play("a");
    expect(wrapper.state("activeOscillators")).toHaveProperty("a");
  });

  it("plays an oscillator with the correct pitch", () => {
    wrapper.setState({tuning: {type: "equal", frequencies: equalKeyToFrequency}});
    wrapper.instance().play("d");
    expect(wrapper.state().activeOscillators["d"].oscillator.frequency.value).toEqual(329.63);
  });

  it("plays an oscillator with the correct waveform", () => {
    wrapper.setState({waveform: "triangle"});
    wrapper.instance().play("d");
    expect(wrapper.state().activeOscillators["d"].oscillator.type).toEqual("triangle");
  });

  it("plays an oscillator with the correct envelope", () => {
    const envelope = {attack: 1, decay: 1, sustain: 0.9, release: 1};
    wrapper.setState({envelope: envelope});
    wrapper.instance().play("d");
    expect(wrapper.state().activeOscillators["d"].envelope.attackTime).toEqual(envelope.attack);
    expect(wrapper.state().activeOscillators["d"].envelope.decayTime).toEqual(envelope.decay);
    expect(wrapper.state().activeOscillators["d"].envelope.sustainLevel).toEqual(envelope.sustain);
    expect(wrapper.state().activeOscillators["d"].envelope.releaseTime).toEqual(envelope.release);
  });
});

describe("setTuning", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<Synth />));

  it("updates tuning type and frequency object in state", () => {
    expect(wrapper.state("tuning")).toEqual({type: "just", frequencies: justKeyToFrequency});
    wrapper.instance().setTuning({target: {value: "equal"}});
    expect(wrapper.state("tuning")).toEqual({type: "equal", frequencies: equalKeyToFrequency});
    wrapper.instance().setTuning({target: {value: "just"}});
    expect(wrapper.state("tuning")).toEqual({type: "just", frequencies: justKeyToFrequency});
  });
});

describe("setWaveform", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<Synth />));

  it("updates waveform in state", () => {
    expect(wrapper.state("waveform")).toEqual("sine");
    wrapper.instance().setWaveform({target: {value: "square"}});
    expect(wrapper.state("waveform")).toEqual("square");
  });
});

describe("setEnvelope", () => {
  let wrapper;
  beforeEach(() => wrapper = mount(<Synth />));

  it("updates envelope in state", () => {
    expect(wrapper.state("envelope")).toEqual({attack: 0.1, decay: 0.01, sustain: 1, release: 0.1});
    wrapper.instance().setEnvelope("attack", 1);
    expect(wrapper.state("envelope")).toEqual({attack: 1, decay: 0.01, sustain: 1, release: 0.1});
  });

  it("updates EnvelopeGraph attack", () => {
    wrapper.instance().setEnvelope("attack", 1);
    wrapper.update();
    expect(wrapper.find(EnvelopeGraph).props().a).toEqual(1);
  });

  it("updates EnvelopeGraph decay", () => {
    wrapper.instance().setEnvelope("decay", 1);
    wrapper.update();
    expect(wrapper.find(EnvelopeGraph).props().d).toEqual(1);
  });

  it("updates EnvelopeGraph sustain", () => {
    wrapper.instance().setEnvelope("sustain", 0.9);
    wrapper.update();
    expect(wrapper.find(EnvelopeGraph).props().s).toEqual(0.9);
  });

  it("updates EnvelopeGraph release", () => {
    wrapper.instance().setEnvelope("release", 1);
    wrapper.update();
    expect(wrapper.find(EnvelopeGraph).props().r).toEqual(1);
  });
});
