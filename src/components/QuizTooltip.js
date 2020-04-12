import React from "react";
import {Image, Popover, OverlayTrigger} from "react-bootstrap";
import tooltipImg from "../assets/tooltipi.png";
import {P} from "./StyledHeaders";

function QuizTooltip (props){
	const tipID = props.tipID;
	const tooltip = props.tooltip;
	const header = props.header;
	return (
		<OverlayTrigger
			key={tipID}
			placement='right'
			overlay={
				<Popover id={`Popover_${tipID}`}> 
					<Popover.Title>{header}</Popover.Title>
					<Popover.Content>
						<P>{tooltip}</P>
					</Popover.Content>
				</Popover>
				}
		>
			<Image height="20" width="20" src={tooltipImg} alt={tooltip}/>
		</OverlayTrigger>
	);
}

export default QuizTooltip;