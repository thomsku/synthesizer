import React from "react";
import {shallow} from "enzyme";
import Waveform from "./Waveform";

describe("Waveform", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<Waveform setWaveform={jest.fn()} waveform="sine"/>));

  it("should render a <div />", () => {
    expect(wrapper.find("div")).toHaveLength(1);
  });
});
