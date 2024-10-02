const {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  setDoc,
  increment,
} = require("firebase/firestore");
const { db } = require("./config");

const { getDateAndMonth, getCityCode } = require("./helpers");
const { AddCredit } = require("./user");

async function fetchFlights(from, to, passengers, startTime) {
  const q = query(
    collection(db, "flights"),
    where("from", "==", from),
    where("to", "==", to),
    where("availability", ">=", passengers),
    where("departure_time", ">=", startTime),
    where("departure_time", "<=", startTime + 86399000),
    orderBy("departure_time", "asc")
  );
  let data = [];

  const querySnap = await getDocs(q);
  querySnap.forEach((doc) => {
    data.push({ flight_id: doc.id, data: doc.data() });
  });

  return data;
}

const getDepAndDes = async (dep, des, passengers, date, func) => {
  let r = {
    depCity: dep,
    departure: getCityCode(dep),
    desCity: des,
    destination: getCityCode(des),
    passengers: passengers || 1,
    date: date.d || new Date().getDate(),
    month: date.m || new Date().getMonth(),
    timestamp: getDateAndMonth(
      date.d || new Date().getDate(),
      date.m || new Date().getMonth()
    ),
    funct: func,
  };

  if (r.funct === "getFlightInfo") {
    let screen = "/(bookings)/trip";
    let type = "data";
    let message = "Here you go..";
    return { type, r, screen, message };
  }

  if (r.funct === "bookFlight") {
    let screen, message, type;
    let data = await fetchFlights(
      r.departure,
      r.destination,
      r.passengers,
      r.timestamp
    );

    if (data.length == 0) {
      screen = null;
      type = "text";
      message = `No flights on ${r.date} ${r.month} from ${r.depCity} ${r.desCity}`;
      return { type, r, screen, message };
    } else {
      (type = "data"), (message = "Here you go ...");
      screen = "/(bookings)/AiBook";
      let d = data;
      return { type, r, screen, message, d };
    }
  }

  return r;
};

const getFunction = (func,booking) => {
  let a = {"booking_id": "Lt5QK3JgrgXce9o2i21a", 
      "data": {
      "createdAt": 1727357732543, 
      "flight": {
        "aircraft": "A320", "airline": "Akasa Air", 
        "airline_logo": "https://logos-world.net/wp-content/uploads/2022/01/Akasa-Air-Emblem.png", "arrival_time": 1727676000000, 
        "availability": 176, "delay": null, "departure_time": 1727661600000, "duration": 240, "from": "DEL", "passengers": [Array], 
        "price": 210, "seats_map": [Array], "status": null, "to": "DXB", "total_capacity": 180, "total_rows": 30
      }, 
      "flight_id": "qQN9re3yRMvQl6jKNk6u", "passengers": [[Object], [Object]], 
      "status": "On Board", "user_id": "eOY3dA7xk525OYENdnkd"
      }
      } 
    if(func == 'getTerminalInfo'){
      let type = 'text'
      let screen = null
      let message = 'Please have a look on your ticket for terminal information.'
      return {type,screen,message,func}

    }else if(func == 'getOtherInfoAboutFlight'){
      let type = 'text'
      let screen = null 
      let message;
      if(booking.data.status !== "On Board"){
        message = `You will be flying with ${booking.data.flight.airline} on ${booking.data.flight.aircraft} from ${booking.data.flight.from} to ${booking.data.flight.to} with a total capacity of ${booking.data.flight.total_capacity} passengers.`
      }else{
        message = `You are flying with ${booking.data.flight.airline} on ${booking.data.flight.aircraft} from ${booking.data.flight.from} to ${booking.data.flight.to} with a total capacity of ${booking.data.flight.total_capacity} passengers.`
      }
      return {type,screen,message,func}
      
    }else if(func == 'getHelp'){
      let i = Math.floor(Math.random() * 6);
      let helpers = [
        {name:'Henry Shroff',mob:67554823,
          name:'Abdullah Karim',mob:45673433,
          name:'Ravindra Mann',mob:63548323,
          name:'Kavya Srivastava',mob:86451547,
          name:'Alina Cavel',mob:62728415,
        }
      ]
      let type = 'text'
      let screen = null
      let message = `Help is on the way. ${helpers[i].name} (${helpers[i].mob}) is comming for your assistance.`
      return {type,screen,message,func}
      
    }else if(func == 'getCheckInInfo'){
      let type = 'text'
      let screen = null
      let message = 'Please use the QR code on your ticket for superfast check in using our Airpass.'
      return {type,screen,message,func}
      
    }else if(func == 'getSecurityCheckInfo'){
      let type = 'text'
      let screen = null
      let message = 'Please use the QR code on your ticket for superfast securing check using our Airpass.'
      return {type,screen,message,func}
      
    }else if(func == 'getBoardingInfo'){
      let type = 'text'
      let screen = null
      let message = 'Please use the QR code on your ticket for superfast boarding using our Airpass.'
      return {type,screen,message,func}
      
    }else if(func == 'orderFoodOnFlight'){
      let type = 'data'
      let screen = '/(flight)/flightShop'
      let message = 'Here you go...'
      return {type,screen,message,func}
      
    }else if(func == 'orderFoodOnAirport'){
      let type = 'data'
      let screen = '/(profile)/airShop'
      let message = 'Here you go...'
      return {type,screen,message,func}
      
    }else if(func == 'getLuggageInfo'){
      let type = 'data'
      let screen = '/(flight)/BagTrack'
      let message = 'Here you go...'
      return {type,screen,message,func}
    }

};

const BookFlight = async (
  user_id,
  flight_id,
  flight_data,
  passengersData,
  res
) => {
  try {
    const bookingRef = collection(db, "bookings");
    const ref = await addDoc(bookingRef, {
      flight_id: flight_id,
      user_id: user_id,
      flight: flight_data,
      passengers: passengersData,
      status: "Not Checked In",
      createdAt: Date.now(),
    });
    const flight_ref = doc(db, "flights", flight_id);
      await updateDoc(flight_ref, {
        availability: increment(-passengersData.length),
      });

    const flightPassRef = doc(db, "flights", flight_id, "passengers", ref.id);
    await setDoc(flightPassRef, { passengers: passengersData });

    const userRef = doc(db, "users", user_id);
    await updateDoc(userRef, {
      bookings: arrayUnion(ref.id),
    });

    

    res.send("Flight Booked!");
  } catch (e) {
    console.log(e);
  }
};

module.exports = { fetchFlights, getDepAndDes, BookFlight, getFunction };
