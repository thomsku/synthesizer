import React from "react";
import {shallow} from "enzyme";
import Tuning from "./Tuning";

describe("Tuning", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<Tuning setTuning={jest.fn()} tuning="just"/>));

  it("should render correctly", () => expect(wrapper).toMatchSnapshot());

  it("should render a <div />", () => {
    expect(wrapper.find("div")).toHaveLength(1);
  });
});
