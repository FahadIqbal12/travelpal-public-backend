const {Airports} = require('./Airports')

const getDateAndMonth = (date,month)=>{
    const m = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
    const i = m.indexOf(month.toLowerCase())
    const numMonth = i+1
    let comDate = `${('0' + numMonth).slice(-2)}/${('0' + date).slice(-2)}/2024 00:00:00`
    var datum = Date.parse(comDate);
    const r = datum
   
    return r
  }
 // strDate=  'MM/DD/YYYY HH:MM:SS'

 
const getCityCode = (city)=>{
  let a =  Airports[Airports.findIndex(x=>x.city.toLocaleLowerCase()===city.toLocaleLowerCase())]
  return a.code
}

 module.exports = {getDateAndMonth,getCityCode}