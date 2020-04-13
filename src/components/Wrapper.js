import React from "react";
import styled from 'styled-components'

const UnStyledWrapper = ({ className, children }) => (
  <div className={className}>
    {children}
  </div>
);

const Wrapper = styled(UnStyledWrapper)`
	background-image: url('${props=>props.img}'); 
	background-position: top center;
	background-size: contain;
	background-repeat: repeat;
	background-color: darken($dark, 5%);
	display: flex;
    width: 100%;
	align-items: stretch;

`;

export default Wrapper;
