import React, { useState } from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import {
    Button,
    Row,
    Form,
	Col
  } from "react-bootstrap";
import {useDispatch} from "react-redux";
import {H1, H3, P} from "../StyledHeaders";
import StyledStrapForm from "../StyledStrapForm";
import { TranslateTag } from '../Translator';

const ImageUploadForm = (props) =>{

	const [image, setImage] = useState(null);
	const [error, setError] = useState('');
	const [confirm, setConfirm] = useState(false);
	const dispatch = useDispatch();
	const confirmmsg = 'Image Updated Successfully';

	const onSubmit = async (event) => {
		try{
			await props.firebase.doImageUpdate(image);
			setImage(null);
			setConfirm(true);
			dispatch({
				type:'UPDATE_PROFILE',
				profileUpdate:true
			});
		} catch(error){
        	setError(error);
        }
//        event.preventDefault();
    };

    const onChange = event => {
        if (event.target.files[0]){
            setImage(event.target.files[0]);
        }
    };
    

	return (
			<StyledStrapForm>
				<Row>
					<Col>
						<H1 className="text-center"><TranslateTag>Change Profile Image</TranslateTag></H1>					
					</Col>
				</Row>
				<Row>
					<Col className="text-right">
						<Form.Label><TranslateTag>Image Path</TranslateTag></Form.Label>
					</Col>
					<Col>
						<Form.Control
						type="file"
						name="image"
						placeholder="Choose Profile Image"
						onChange={onChange}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="text-center">
						<Button color="primary" onClick={onSubmit} size="lg"><TranslateTag>Change Image</TranslateTag></Button>
					</Col>
				</Row>
				<Row>
					<Col>
						<H3 id="ERROR" className="warning">{error && <P>{error.message}</P>}</H3>
						<H3 id="CONFIRM" className="info">{confirm && <P>{confirmmsg}</P>}</H3>
					</Col>
				</Row>
			</StyledStrapForm>
	)
}

const ImageUpload = compose(withFirebase,withRouter)(ImageUploadForm);
export default ImageUpload;