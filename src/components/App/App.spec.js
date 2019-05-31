import React from "react";
import {shallow} from "enzyme";
import App from "./App";
import Synth from "../Synth/Synth";

describe("App", () => {
  let wrapper;
  beforeEach(() => wrapper = shallow(<App />));

  it("should render correctly", () => expect(wrapper).toMatchSnapshot());

  it("should render a <div />", () => {
    expect(wrapper.find("div")).toHaveLength(1);
  });

  it("should render the Synth Component", () => {
    expect(wrapper.containsMatchingElement(<Synth />)).toEqual(true);
  });
});
