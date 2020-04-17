import React from 'react';
import Translator from '../../models/Translator'
const TranslatorContext = React.createContext({
  translator:new Translator(),
  updateTranslator: ()=>{}
});
TranslatorContext.displayName = 'TranslatorContext';
export const withTranslator = Component => props => (
    <TranslatorContext.Consumer>
      {({translator,updateTranslator}) => <Component {...props} translator={translator} updatetranslator={updateTranslator} />}
    </TranslatorContext.Consumer>
  );
export default TranslatorContext;