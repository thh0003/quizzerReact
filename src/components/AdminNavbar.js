import React from "react";
import {Col, Button} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import {withFirebase} from "./Firebase";
import {withAuthUser} from "./Session";
import { compose } from "recompose";
import { useDispatch } from "react-redux";
import {H3} from "./StyledHeaders";
import StyledNavBarRow from "./StyledNavBarRow";

function AdminNavbarForm(props) {
	const dispatch = useDispatch();
	const showReport = (areport) =>{
		dispatch ({
			type:'UPDATE_REPORTS',
			qreport:(areport)?false:true,
			areport:(areport)?true:false
		});
	}
	
	const exportAdminReport = async () =>{
		let filename = 'quizLog.json';
		let jsonFile = await props.firebase.getQuizLogs(false,true,false);

		
		var blob = new Blob([JSON.stringify(jsonFile)], { type: 'application/json;charset=utf-8;' });
		if (navigator.msSaveBlob) { // IE 10+
			navigator.msSaveBlob(blob, filename);
		} else {
			var link = document.createElement("a");
			if (link.download !== undefined) { // feature detection
				// Browsers that support HTML5 download attribute
				var url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", filename);
				link.style.visibility = 'hidden';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	}

	if (props.userrole==='ADMIN'){
		return (
				<StyledNavBarRow>
					<Col>
						<H3>Administor Actions</H3>
					</Col>
					<Col>
						<Button size="xs" onClick={()=>{showReport(true)}} variant="primary">Show Admin Report</Button>
						<Button size="xs" onClick={exportAdminReport} variant="primary">Export Admin Report</Button>
					</Col>
				</StyledNavBarRow>
		);
	}else {
		return null;
	}
}

const AdminNavbar = compose(
    withRouter,
	withFirebase,
	withAuthUser)(AdminNavbarForm);

  export default AdminNavbar;
