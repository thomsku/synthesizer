import React from "react";
import {shallow} from "enzyme";
import Synth from "./Synth";

window.AudioContext = jest.fn().mockImplementation(() => {
  return {};
});

describe("Synth", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<Synth />));

  it("should render a <div />", () => {
    expect(wrapper.find("div")).toHaveLength(1);
  });
});
