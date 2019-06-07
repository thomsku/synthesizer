import React from "react";
import {shallow} from "enzyme";
import Envelope from "./Envelope";

describe("Envelope", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<Envelope setEnvelope={jest.fn()} envelope={{attack: 0.1, decay: 0.01, sustain: 1, release: 0.1}}/>));

  it("should render correctly", () => expect(wrapper).toMatchSnapshot());

  it("should render 3 <div />", () => {
    expect(wrapper.find("div")).toHaveLength(3);
  });
});
