import React from "react";
import { Form, Image } from "react-bootstrap";
import {withTranslator} from './index';
import googleTranslate from "../../assets/color-regular.png";

function LanguageChooser(props) {
    const languageChoices = props.translator.getToLanguages();
    const selectedLanguage = props.translator.getSelectedToLanguage();
    const languageID = Object.keys(selectedLanguage)[0];
    let displayChoices = [];
    displayChoices.push(<option key={`selected_${selectedLanguage[languageID]}`} value={languageID}>{languageID}</option>);
    for (let l in languageChoices){
        displayChoices.push(<option key={languageChoices[l]} value={l}>{l}</option>);
    }

    const onSelectLanguageChange = (event) => {
        let selectedLang = {};
        selectedLang[event.target.value] = languageChoices[event.target.value];
        props.updatetranslator(selectedLang);
    }

    return (
		<React.Fragment>
			<Form.Control as="select" key={'LanguageChoice'} onChange={onSelectLanguageChange}>
				{displayChoices}
			</Form.Control>
			<a href="https://translate.google.com/" rel="noopener noreferrer" target="_blank"><Image src={googleTranslate} alt="Powered by Google Translate" /></a>
		</React.Fragment>
    );
}

export default withTranslator(LanguageChooser);
