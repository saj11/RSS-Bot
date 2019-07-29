const feed = require('rss-to-json')
const {addLanguage, isDesireLanguage, getLanguage} = require('./language')
const util = require('./utilities')

//TODO: Crear una lista de T, F, M
//TODO: Crear una funcion que lo guarde en un json
//TODO: Mostrar los T en Slack
let allowNotice = []
let denyNotice = []
let unknownNotice = []

const getAllowNotice = () => {
    console.log("##########")
    console.log(allowNotice)
    console.log("##########")
}

const getDenyNotice = () => denyNotice
const getUnknownNotice = () => unknownNotice

const obtainFeed = (id, url) => {
    return new Promise( (resolve, reject) => {
        feed.load(url, async (err, rss) => {
            //for(item of rss.items){
            const promises = rss.items.map(async (item)=> {
                await isDesireLanguage(id, item.title).then(
                    (result)=>{
                        switch(result){
                            case 'T':
                                allowNotice.push(item.url)
                                break;
                            case 'F':
                                denyNotice.push(item.url)
                                break;
                            case 'M':
                                unknownNotice.push(item.url)
                                break;
                        }
                    }
                )
            })
            await Promise.all(promises)
            resolve(allowNotice)
        }) 
    })
}

module.exports = obtainFeed

const aa = async () => {
    await obtainFeed('1', 'https://medium.com/feed/tag/js').then(result => {
        console.log(result)
    })
}

//aa()
