const getAirport = (airport,terminal,func)=>{
    let r = {airportName:airport||null,
            terminal:terminal||null,
            funct:func,
            }

    if(r.funct == 'getLoungeInfo'){
      let type = 'data'
      let message = 'Here you go ...'
      let screen = '/(profile)/airLounge'
      return {type,screen,r,message}
    }

    return r
  }

module.exports={getAirport}