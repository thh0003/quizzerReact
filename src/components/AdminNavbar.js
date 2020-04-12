import React from "react";
import {Col, Button} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import {withFirebase} from "./Firebase";
import {withAuthUser} from "./Session";
import { compose } from "recompose";
import { useDispatch } from "react-redux";
import {H3} from "./StyledHeaders";
import StyledNavBarRow from "./StyledNavBarRow"

function AdminNavbarForm(props) {
	const dispatch = useDispatch();
	const showReport = (areport) =>{
		dispatch ({
			type:'UPDATE_REPORTS',
			qreport:(areport)?false:true,
			areport:(areport)?true:false
		});
	}

	const exportAdminReport = () =>{
		dispatch ({
			type:'EXPORT_AREPORT',
			areport:true
		});
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
