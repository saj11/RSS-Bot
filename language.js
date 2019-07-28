const cld = require('cld')
const util = require('./utilities')

//Local cache
let languageFile = null
let configureFile = null

const init = () => {
    //If file exist read it, if not create file
    if(languageFile === null){
        try{
            languageFile = util.readFile('./languages.json')
            configureFile = util.readFile('./config.json')
        }catch(e){

            const msg = `Error - languages.json is not found, creating it. \n ${e}`
            util.writeFile('./log.txt', msg)
            languageFile = {}
        }
        return languageFile
    }
}

const addLanguage = (id, languages) => {
    let newValue = false
    let listLanguage = languageFile[id] === undefined ? init() : languageFile

    if(listLanguage === undefined){
        listLanguage = {...languageFile, [id]: []}
    }

    languages.forEach(language => {
        try{
            if(!listLanguage[id].includes(language)){
                newValue = true
                listLanguage[id].push(language)
            }
        }catch{
            newValue = true
            listLanguage = {[id]: [language]}
        }
        
    })

    if(newValue){
        languageFile = {...listLanguage}
        util.writeFile('./languages.json', languageFile)
    }   
}

const removeLanguage = (id, languages) => {
    let newValue = false
    let listLanguage = languageFile[id]
    
    if(listLanguage !== undefined){
        languages.forEach( language => {
            if(listLanguage && listLanguage.includes(language)){
                newValue = true
                listLanguage.splice(listLanguage.findIndex(lang => lang === language),1)
            }
        })
    
        if(newValue){
            languageFile[id] = listLanguage
            util.writeFile('./languages.json', languageFile)
        }   
        console.log(languageFile, listLanguage)
    }
}

const getLanguage = id => {
    return languageFile[id]
}

const isDesireLanguage = (id, text) => {
    // T: True | F: False | M: Maybe
    init()
    return new Promise( (resolve, reject) => {
        cld.detect(text, function(err, result) {
            if(err){
                resolve('M')
            }
        
            for(let i = 0; i < Math.min(result.languages.length,configureFile["numberOfLanguagesToCheck"]); i++){
                if(languageFile[id].includes(result.languages[i].name)){
                    resolve('T')
                }
            }
            
            resolve('F')
        })
    })
}

module.exports = {
    addLanguage,
    removeLanguage, 
    getLanguage,
    isDesireLanguage
}