const fetchDepAndDesFunctionDeclaration = {
  name:"fetchDepAndDes",
  description:"Get departure, destination and date from any sentence if provided.",
  parameters:{
    type:"OBJECT",
    properties:{
      dep:{
        type:"STRING",
        description:"Departure"
      },
      des:{
        type:"STRING",
        description:"Destination"
      },
      passengers:{
        type:"NUMBER",
        description:"Number of people/travellers/passengers"
      },
      date:{
        type:"OBJECT",
        properties:{
          d:{
            type:"NUMBER",
            description:"Date"
          },
          m:{
            type:"STRING",
            description:"MONTH"
          }
        }
      },
      func:{
        type:"STRING",
        description:'Based on the prompt should we use `getFlightInfo`, `modifyFlightInfo`, `getOtherInfoAboutFlight`, `bookFlight` function'
      }
    },
    required:["dep","des","func"]
  }
}


const fetchAirportFuctionDeclaration = {
  name:"fetchAirport",
  description:"Get airport and terminal name from any sentence if provided.",
  parameters:{
    type:"OBJECT",
    properties:{
      airport:{
        type:"STRING",
        description:"Airport name",
      },
      terminal:{
        type:"STRING",
        description:"Terminal name if provided"
      },
      func:{
        type:'STRING',
        description:'Based on the prompt should we use `getLoungeInfo`,`getOtherInfoAboutAirport` function'
      }
    },
    required:["airport","func"]
  }
}

 

const fetchTravelTipsAndRecommendationFunctionDeclaration = {
  name:"fetchTravelTipsAndRecommendation",
  description:"Get name of the place from any sentence if provided",
  parameters:{
    type:"OBJECT",
    properties:{
      place:{
        type:"STRING",
        description:"Name of the city or country"
      },
      recom:{
        type:"STRING",
        description:"what the recommendation is about"
      },
      month:{
        type:"STRING",
        description:"Month name if provided"
      },
      prompt:{
        type:"STRING",
        description:"write the complete prompt."
      },
      func:{
        type:"STRING",
        description:"Based on the prompt should we use `getAttractions`, `getWeatherInfo`, `getRecommendation`, `getTravelTip` function"
      }
    },
    required:["place","prompt","func"]
  }
}

const fetchFuncFunctionDeclaration = {
  name:"fetchFunction",
  description:"Based on the prompt return the most suitable function to use",
  parameters:{
    type:"OBJECT",
    properties:{
      func:{
        type:"STRING",
        description:"Based on the prompt should we use `getTerminalInfo`, `getOtherInfoAboutFlight`, `getHelp`, `getCheckInInfo`, `getSecurityCheckInfo`, `getBoardingInfo` ,`orderFoodOnFlight`,`orderFoodOnAirport`,`getLuggageInfo` function"
      }
    },
    required:["func"]
  }

}


module.exports={fetchDepAndDesFunctionDeclaration,fetchAirportFuctionDeclaration,fetchTravelTipsAndRecommendationFunctionDeclaration,fetchFuncFunctionDeclaration}