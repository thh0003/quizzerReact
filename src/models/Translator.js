/**
 * <p>Title: Translator</p>
 * <p>Description: A class that translates text between languages
answers
 * is the offset for the correct answer.</p>
 * @author Trevor Holmes
 * @version 1.0
 */
const TRANSLATOR_API_KEY = process.env.REACT_APP_TRANSLATE_API_KEY;
const TRANSLATOR_URL = process.env.REACT_APP_TRANSLATE_API_URL;

class Translator
{
    /**
     * Constructor
     * @param tString the beginning offset of the quiz question
     * @param qEnd the ending offset of the quiz question
     */
    constructor( fromlang = {ENGLISH:'en'}, selectToLanguage={ENGLISH:'en'})
    {
        this.fromLanguage = fromlang;
        this.selectedToLanguage = selectToLanguage;
		this.toLanguage={
            ENGLISH:'en',
            ARABIC:'ar',
            CHINESE:'zh',
            FRENCH:'fr',
            GERMAN:'de',
            HEBREW:'he',
            JAPANESE:'ja',
            KOREAN:'ko',
            SPANISH:'es',
            RUSSIAN:'ru'
        };
		this.tText = '';
    }

    getToLanguages = () => this.toLanguage;
    setSelectedToLanguage = (tolang) => this.selectedToLanguage=tolang;
    getSelectedToLanguage = () => this.selectedToLanguage;

    async getCompTranslation(componentText){
        try {
//            console.log(`getCompTranslation fromLanguage: ${this.fromLanguage[Object.keys(this.fromLanguage)[0]]}, selectedToLangue: ${this.selectedToLanguage[Object.keys(this.selectedToLanguage)[0]]}`);
//            console.log(componentText);
            let translation = {};
            let numTranslations = Object.keys(componentText).length;
            if (numTranslations > 100){
                let x=0;
                let tempTranslation = [];
                let curTranslation = {};
                let keys = Object.keys(componentText);
                for(let y=0;y<numTranslations;y++){
                    if (x<100){
                        curTranslation[keys[y]]=componentText[keys[y]];
                        x++;
                    } else {
                        curTranslation[keys[y]]=componentText[keys[y]];
                        tempTranslation.push(await this.getTranslation(curTranslation));
                        curTranslation={};
                        x=0;
                    }
                }
                translation = Object.assign(translation, ...tempTranslation);

            } else {
                translation = await this.getTranslation(componentText);
            }
            return translation;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Translate specified Text
     */
    async getTranslation(text)
    {
        try {
            let returnTranslate = {};
            let toL = this.selectedToLanguage[Object.keys(this.selectedToLanguage)[0]];
            let fromLang = this.fromLanguage[Object.keys(this.fromLanguage)[0]];
            const checkInputs = (typeof toL!=='undefined' && toL!==null && typeof text!=='undefined' && text !== null);
            if (checkInputs){
                if (fromLang!==toL){
                    let myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
                    let urlencoded = new URLSearchParams();
                    urlencoded.append("key", TRANSLATOR_API_KEY);
                    urlencoded.append("target", toL);
                    urlencoded.append("source", fromLang);
                    for (let t in text ){
                        urlencoded.append("q", text[t]);
                    }
                    
                    var requestOptions = {
                      method: 'POST',
                      headers: myHeaders,
                      body: urlencoded
                    };
  //                  console.log(`url: ${TRANSLATOR_URL}`);
  //                  console.log(urlencoded);
                    let translatedText=await fetch(TRANSLATOR_URL, requestOptions)

                    if (translatedText){
                        let translatedJSON = await translatedText.json();
//                        console.log(translatedJSON);
                        let x=0;
                        for (let t in text){
                            returnTranslate[t]=translatedJSON.data.translations[x].translatedText;
                            x++;
                        }
                        return returnTranslate;
                    } 
                } else {
                    return text;
                } 
            } else {
                throw (new Error(`Language Specified is not available`))
            }
        } catch (error) {
            throw error;
        }
	}
}

export default Translator;
