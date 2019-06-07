import React from "react";
import {shallow, mount} from "enzyme";
import AudioVisualiser from "../AudioVisualiser/AudioVisualiser";

describe("AudioVisualiser", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<AudioVisualiser audioData={{}}/>));

  it("should render correctly", () => expect(wrapper).toMatchSnapshot());

  it("should render a <canvas />", () => {
    expect(wrapper.find("canvas")).toHaveLength(1);
  });
});

describe("draw", () => {
  let wrapper;
  let audioData;

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

  beforeEach(() => {
    wrapper = mount(<AudioVisualiser audioData={{}}/>);
    audioData = new Uint8Array(1024);
  });

  it("is executed when the audioData prop is updated", () => {
    audioData.fill(128);
    const spy = jest.spyOn(wrapper.instance(), "draw");
    wrapper.setProps({audioData: audioData});
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("handles negative audioData values", () => {
    audioData.fill(-1);
    const spy = jest.spyOn(wrapper.instance(), "draw");
    wrapper.setProps({audioData: audioData});
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("handles too high audioData values", () => {
    audioData.fill(12000);
    const spy = jest.spyOn(wrapper.instance(), "draw");
    wrapper.setProps({audioData: audioData});
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
