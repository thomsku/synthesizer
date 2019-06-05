import React from "react";
import {shallow} from "enzyme";
import Envelope from "./Envelope";

describe("Envelope", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<Envelope setEnvelope={jest.fn()} />));

  it("should render 3 <div />", () => {
    expect(wrapper.find("div")).toHaveLength(3);
  });
});