const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');


// Set path to .env file 
dotenv.config({ path: './.env' }); 


var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getTravelTipsAndRecommendation =async (place,recom,month,prompt,func)=>{
    let r ={
      place:place||null,
      recommendation:recom||null,
      month:month||m[new Date().getMonth()],
      prompt:prompt,
      funct:func
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    let message = result.response.text()
    let type = 'text'
    let screen = null
    return {type,screen,r,message}
  }

module.exports={getTravelTipsAndRecommendation}