import React, {useState} from 'react';
import Routes from "./routes/Routes";
import 'bootstrap/dist/css/bootstrap.min.css';
import { withAuthentication } from './components/Session';
import Translator, {TranslatorContext} from './components/Translator';

function App() {
	const [translator, setTranslator] = useState(new Translator());
	const updateTranslator = (selectLang) =>{
		setTranslator (new Translator(
				{ENGLISH:'en'},
				selectLang
			));
	};

	const translatorValue = {
		translator: translator,
		updateTranslator:updateTranslator
	}

	return (
		<TranslatorContext.Provider value={translatorValue}>
			<Routes />
		</TranslatorContext.Provider>
	  );
	}
	
export default withAuthentication(App);
