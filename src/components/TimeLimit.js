import React, {useState, useEffect} from "react";
import {connect, useDispatch} from "react-redux";
import { Row, Col } from "react-bootstrap";
import {P} from "./StyledHeaders";

const formatTime = (time) => {
	let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((time % (1000 * 60)) / 1000);

	return `${minutes}m ${seconds}s `;
}


const TimeLimit = (props) => {
	const dispatch = useDispatch();
	const [timeLeft,setTimeLeft] = useState(props.timeLimit);

	useEffect(()=>{
		if (!props.timesUp){
			if (props.qstart && props.timeLimit>0 && !props.timesUp){
				if (timeLeft >0){
					setTimeout(()=>{
						setTimeLeft(timeLeft-1)
					},1000);
				} else {
					dispatch({
						type:'UPDATE_TIMESUP',
						timesUp:true
					});
				}
			}
		} else {
			setTimeLeft(0);
		}
	},[props.qstart,props.timeLimit, timeLeft, dispatch, props.timesUp]);

	if (props.timesUp){
		let formattedDuration = formatTime(props.quiz.getduration());
		return (
			<React.Fragment>
				<Row>
					<Col>
						<P className="text-left">Quiz Duration: {formattedDuration}</P>
					</Col>
				</Row>
			</React.Fragment>
		);
	} else if (props.qstart && props.timeLimit>0){
		let formattedTimeLeft = formatTime(timeLeft*1000);
		return (
			<React.Fragment>
				<Row>
					<Col>
						<P className="text-left">Remaining Time: {formattedTimeLeft}</P>
					</Col>
				</Row>
			</React.Fragment>
		);
	} else {
		return (

			<React.Fragment>
			<Row>
				<Col>
				</Col>
			</Row>
		</React.Fragment>

		);
	}
}

export default connect(store => ({
	timeLimit: store.quizzer.timeLimit,
	qstart:store.quizzer.qstart,
	timesUp:store.quizzer.timesUp,
	quiz:store.quizzer.quiz
}))(TimeLimit);
