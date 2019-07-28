const fs = require('fs')

const writeFile = (fileName, data) => {
    if(typeof(data) !== 'string'){
        data = JSON.stringify(data)
    }
    
    fs.writeFileSync(`./${fileName}`, data)
}

const readFile = (fileName) => {
    const dataBuffer = fs.readFileSync(fileName)
    const dataJSON = dataBuffer.toString()
    
    return JSON.parse(dataJSON)
}

module.exports = {
    writeFile,
    readFile
}