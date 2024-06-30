import React, { useState } from "react";
import styled from "styled-components";

// Define the toggle switch container
const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

// Define the custom switch element
const Switch = styled.div`
  position: relative;
  display: inline-block;
  width: 33px; /* Width of the switch */
  height: 17px; /* Height of the switch */
`;

// Define the slider for the switch
const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) =>
    props.checked
      ? "rgb(98, 127, 234)"
      : "rgb(118,147,254)"}; /* Switch background color */
  border-radius: 17px; /* Rounded corners */
  transition: 0.4s; /* Transition for smooth sliding */

  &:before {
    position: absolute;
    content: "";
    height: 14px; /* Height of the knob */
    width: 14px; /* Width of the knob */
    border-radius: 50%; /* Circular knob */
    left: 2.5px; /* Position the knob */
    bottom: 1.5px; /* Position the knob */
    background-color: rgb(153, 200, 255); /* Knob color */
    transition: 0.4s; /* Transition for smooth sliding */
    transform: ${(props) =>
      props.checked ? "translateX(26px)" : "translateX(0)"}; /* Move the knob */
  }
`;

// Define the hidden checkbox input
const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  width: 0;
  height: 0;
`;

// Main Toggle Component
const Toggle = ({ checked, onChange, ...props }) => {
  return (
    <ToggleSwitch>
      <HiddenCheckbox checked={checked} onChange={onChange} {...props} />
      <Switch>
        <Slider checked={checked} />
      </Switch>
    </ToggleSwitch>
  );
};

export default Toggle;
