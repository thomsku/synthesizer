import React from "react";
import {shallow, mount} from "enzyme";
import AudioAnalyser from "./AudioAnalyser";
import AudioVisualiser from "../AudioVisualiser/AudioVisualiser";
require("../Synth/AudioContext.mock.js");

describe("AudioAnalyser", () => {
  let wrapper;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const amp = audioContext.createGain();
  beforeEach(() => wrapper = shallow(<AudioAnalyser audioContext={audioContext} activeOscillators={{}} amp={amp}/>));

  it("should render correctly", () => expect(wrapper).toMatchSnapshot());

  it("should render a <div />", () => {
    expect(wrapper.find("div")).toHaveLength(1);
  });

  it("should render the AudioVisualiser Component", () => {
    expect(wrapper.containsMatchingElement(<AudioVisualiser audioData={wrapper.instance().state.audioData}/>)).toEqual(true);
  });
});

describe("tick", () => {
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
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const amp = audioContext.createGain();
  beforeEach(() => {
    wrapper = mount(<AudioAnalyser audioContext={audioContext} activeOscillators={{}} amp={amp}/>);
    jest.spyOn(window, "requestAnimationFrame").mockImplementationOnce((cb) => cb());
  });

  it("calls tick() when the component is mounted", () => {
    const spy = jest.spyOn(wrapper.instance(), "tick");
    wrapper.instance().componentDidMount();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    window.requestAnimationFrame.mockRestore();
  });
});
