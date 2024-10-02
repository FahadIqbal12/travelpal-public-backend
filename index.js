const express = require('express')
const {fetchFlights,getDepAndDes,BookFlight, getFunction} = require('./flights')
const {Authentication, UpdateUserInfo, GetBookings, GetSpecificBooking, AddCredit, DeductCredit, GetCreditsInfo} = require('./user')
const {getTravelTipsAndRecommendation} = require('./travel')
const {fetchAirportFuctionDeclaration,
  fetchDepAndDesFunctionDeclaration,
  fetchTravelTipsAndRecommendationFunctionDeclaration,
  fetchFuncFunctionDeclaration
} = require('./ai')
const {getAirport} = require('./airport')
var cors = require('cors');

const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');


// Set path to .env file 
dotenv.config({ path: './.env' }); 

const app = express()
app.use(cors());
app.use(express.json())

const port = 3000

app.get('/', (req, res) => {
  res.send('Connected');
})

app.post('/get-flights',async(req,res)=>{
  const {passengers,startTime,from,to} = req.body;
  const data = await fetchFlights(from,to,passengers,startTime)
  res.send(data)
})

app.post('/auth',async(req,res)=>{
  const {email,password,isNewUser} = req.body;
  await Authentication(email,password,isNewUser,res)
})

app.post('/update-user-info',async(req,res)=>{
  const {user_id,data} = req.body;
  await UpdateUserInfo(user_id,data,res)
})

app.post('/book-flight',async(req,res)=>{
  const {user_id,flight_id,flight,passengers} = req.body
  await BookFlight(user_id,flight_id,flight,passengers,res)
})

app.post('/add-credits',async(req,res)=>{
  const {user_id,credits,title} = req.body;
  let d = await AddCredit(user_id,credits,title)
  res.send(d)
})
app.post('/deduct-credits',async(req,res)=>{
  const {user_id,credits,title} = req.body;
  let d = await DeductCredit(user_id,credits,title)
  res.send(d)
})
app.post('/get-credits',async(req,res)=>{
  const {user_id} = req.body 
  let d = await GetCreditsInfo(user_id)
  res.send(d)
})

app.post('/get-bookings',async(req,res)=>{
  const {user_id} = req.body 
  await GetBookings(user_id,res)
})

app.post('/get-specific-bookings',async(req,res)=>{
  const {booking_id} = req.body 
  await GetSpecificBooking(booking_id,res)
})


app.post('/ai',async(req,res)=>{
  const functions = {
    fetchDepAndDes:({dep,des,passengers,date,func})=>{
      return getDepAndDes(dep,des,passengers,date,func)
    },
    fetchAirport:({airport,terminal,func})=>{
      return getAirport(airport,terminal,func)
    },
    fetchTravelTipsAndRecommendation:({place,recom,month,prompt,func})=>{
      return getTravelTipsAndRecommendation(place,recom,month,prompt,func)
    }
  }

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const genModel = genAI.getGenerativeModel({
    model:"gemini-1.5-flash",
    tools:{
      functionDeclarations:[fetchDepAndDesFunctionDeclaration,fetchAirportFuctionDeclaration,fetchTravelTipsAndRecommendationFunctionDeclaration]
    }
  })

  const chat = genModel.startChat();
  const {prompt} = req.body
  const result = await chat.sendMessage(prompt)

  const call = result.response.functionCalls()
  if(call !== undefined){
    const call = result.response.functionCalls()[0]
    if(call){
      const apiResponse = await functions[call.name](call.args);
    
      res.send(apiResponse)
    }
  }else{
    const result = await genModel.generateContent(prompt);
    let res_data = {
      type:'text',
      data:[],
      screen:null,
      message:result.response.text()
    }
    res.send(res_data);
  }

})


app.post('/inflight-ai',async(req,res)=>{

  const {prompt,booking} = req.body
  const functions = {
    fetchTravelTipsAndRecommendation:({place,recom,month,prompt,func})=>{
      return getTravelTipsAndRecommendation(place,recom,month,prompt,func)
    },
    fetchFunction:({func})=>{
      return getFunction(func,booking)
    }
  }

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const genModel = genAI.getGenerativeModel({
    model:"gemini-1.5-flash",
    tools:{
      functionDeclarations:[fetchTravelTipsAndRecommendationFunctionDeclaration,fetchFuncFunctionDeclaration]
    }
  })

  const chat = genModel.startChat();
  
  const result = await chat.sendMessage(prompt)

  const call = result.response.functionCalls()
  if(call !== undefined){
    const call = result.response.functionCalls()[0]
    if(call){
      const apiResponse = await functions[call.name](call.args);
    
      res.send(apiResponse)
    }
  }else{
    const result = await genModel.generateContent(prompt);
    let res_data = {
      type:'text',
      data:[],
      screen:null,
      message:result.response.text()
    }
    res.send(res_data);
  }

})




app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})