import React from "react";
import {shallow} from "enzyme";
import AudioAnalyser from "./AudioAnalyser";
import AudioVisualiser from "../AudioVisualiser/AudioVisualiser";

describe("AudioAnalyser", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<AudioAnalyser activeOscillators={{}}/>));

  it("should render a <div />", () => {
    expect(wrapper.find("div")).toHaveLength(1);
  });

  it("should render the AudioVisualiser Component", () => {
    expect(wrapper.containsMatchingElement(<AudioVisualiser audioData={wrapper.instance().state.audioData}/>)).toEqual(true);
  });
});
