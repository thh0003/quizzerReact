import React, {useState, useEffect} from "react";
import {withTranslator} from './index';

const initialState = {
	tranlate:"",
};

const TranslateTag = (props) => {

	const [componentText,setComponentText] = useState(initialState);
	const [isLoaded,setIsLoaded] = useState(false);
//	const translateText = useRef(null);
	
	useEffect (()=>{
		
		let translatetext = {translateText: props.children};

		props.translator.getCompTranslation(translatetext)
			.then ((translation)=>{
				setComponentText(translation);
				setIsLoaded(true);
			});
	},[props.translator,props.children]);

	if (!isLoaded){
		return (
			<React.Fragment>
				{props.children}
            </React.Fragment>
		);
	} else {
		return (
			<span lang={props.translator.getLangProp()}>
				{componentText.translateText}
			</span>
		);
	}
}

export default withTranslator(TranslateTag);