import React from "react";
import { Form } from "react-bootstrap";
import {withTranslator} from './index'

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
        <Form.Control as="select" key={'LanguageChoice'} onChange={onSelectLanguageChange}>
			{displayChoices}
		</Form.Control>
    );
}

export default withTranslator(LanguageChooser);
