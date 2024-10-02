const {db} = require('./config')
const {collection,getDocs,query,where,orderBy,addDoc,setDoc,doc,updateDoc,getDoc,increment} = require('firebase/firestore')
const {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword} = require('firebase/auth')


const addNewUser =async (email,password,res) =>{
    const data = {
        email:email,
        password:password,
        name:'',
        age:0,
        passport_number:0,
        travelPrefrences:{
            airline:'',
            destinations:['Delhi','Dubai','Singapore','Tokyo','Istanbul'],
            class:'',
            seat_choice:''
        },
        bookings:[]
    }
    const ref = await addDoc(collection(db, "users"), data);
    await setDoc(doc(db, "users",ref.id,"wallet","wallet_info"), {remaining_credits:0})
    res.send({user_id:ref.id,user_data:data})
}

const UpdateUserInfo = async(user_id,data,res) =>{
    const docRef = doc(db,"users",user_id)
    await updateDoc(docRef,data).then(()=>{
        res.send('Updated Sucessfully!')
    }).catch((e)=>{
        res.send('Something went worng.')
    })
}

const AddCredit = async(user_id,credits,title)=>{
    const walletRef = doc(db,"users",user_id,"wallet","wallet_info")
    await updateDoc(walletRef,{
        remaining_credits:increment(credits),
    }).then(async()=>{
        const historyRef = collection(db,"users",user_id,"wallet","wallet_info","history")
        await addDoc(historyRef,{
            name:title,
            amount:credits,
            timestamp:Date.now()
        })
    })
    
}

const DeductCredit = async(user_id,credits,title)=>{
    const walletRef = doc(db,"users",user_id,"wallet","wallet_info")
    await updateDoc(walletRef,{
        remaining_credits:increment(-credits),
    }).then(async()=>{
        const historyRef = collection(db,"users",user_id,"wallet","wallet_info","history")
        await addDoc(historyRef,{
            name:title,
            amount:-credits,
            timestamp:Date.now()
        })
    })
    
}

const GetCreditsInfo =async (user_id) =>{
    const walletRef =  doc(db,"users",user_id,"wallet","wallet_info")
    const historyRef =query(collection(db,"users",user_id,"wallet","wallet_info","history"),orderBy('timestamp','desc'))
    const docSnap = await getDoc(walletRef);
    let wallet_info;
    let history = []
    if (docSnap.exists()) {
    wallet_info = docSnap.data()
    const querySnapshot = await getDocs(historyRef);
    querySnapshot.forEach((doc) => {
    history.push(doc.data())
    })
        return {wallet_info,history}

    } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    }
}

const GetBookings = async(user_id,res)=>{
    const q = query(collection(db,"bookings"),where("user_id","==",user_id),orderBy("createdAt","desc"))
    let data=[]

    const querySnap = await getDocs(q)
    querySnap.forEach((doc)=>{
        data.push({booking_id:doc.id,data:doc.data()})
    })
    res.send(data)
}

const GetSpecificBooking = async(booking_id,res) =>{
    const bookingRef = doc(db,"bookings",booking_id)
    const docSnap = await getDoc(bookingRef)
    if(docSnap.exists()){
        res.send({data:docSnap.data(),booking_id:docSnap.id})
    }
}

const getUserData = async(email,res) =>{
    const q = query(collection(db,'users'),where("email","==",email));
    let data=[]

    const querySnap = await getDocs(q)
    querySnap.forEach((doc)=>{
        data.push({user_id:doc.id,user_data:doc.data()})
    })
    res.send(data)
  
}


const Authentication = async(email,password,isNewUser,res)=>{
    const auth = getAuth()
    if(isNewUser==true){
    await createUserWithEmailAndPassword(auth,email,password).then((userCredentials)=>{
        addNewUser(email,password,res)
    }).catch(async(e)=>{
        let err = e.customData._tokenResponse.error.message
        if(err == "EMAIL_EXISTS"){
            await signInWithEmailAndPassword(auth,email,password).then((userCredentials)=>{
                getUserData(email,res)
            }).catch((e)=>{
                let err = e.code
                if(err == "auth/invalid-credential"){
                    res.sendStatus(404)
                }else{
                    console.log(e)
                }
                
            })
        }else{
        console.log(e.message)}
    })
    }else{
       await signInWithEmailAndPassword(auth,email,password).then((userCredentials)=>{
            getUserData(email,res)
        }).catch((e)=>{
            let err = e.code
            if(err == "auth/invalid-credential"){
                res.sendStatus(404)
            }else{
                console.log(e)
            }
            
        })
    }
}


module.exports = {Authentication,UpdateUserInfo,GetBookings,GetSpecificBooking,AddCredit,GetCreditsInfo,DeductCredit}