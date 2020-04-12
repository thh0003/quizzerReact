

var psDebug = {};

psDebug.consoleLogger = function(msg,type=0)
{
    
    const debugMode = (process.env.REACT_APP_debug==='true')?true:false;

    if (debugMode){
        if (type===1){
			console.error(msg);
        }else {
            console.log(msg);
        }

    }
};



export default psDebug;