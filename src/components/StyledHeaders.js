import styled from 'styled-components'

const H1 = styled.h1`
	background-color: rgba(255, 255, 255, .7);
	color: ${process.env.REACT_APP_BLUE}
`;

const H3 = styled.h3`
	background-color: rgba(255, 255, 255, .7);
	color: ${process.env.REACT_APP_BLUE}
`;

const P = styled.p`
	background-color: rgba(255, 255, 255, .7);
	color: ${process.env.REACT_APP_BLUE}
`;

const Answer = styled.p`
	background-color: rgba(255, 255, 255, .7);
	color: #ff0000;
`;

export {H1, H3 ,P , Answer};