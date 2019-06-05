import React from "react";
import {shallow} from "enzyme";
import AudioVisualiser from "../AudioVisualiser/AudioVisualiser";

describe("AudioVisualiser", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<AudioVisualiser audioData={{}}/>));

  it("should render a <canvas />", () => {
    expect(wrapper.find("canvas")).toHaveLength(1);
  });
});
