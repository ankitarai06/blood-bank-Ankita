const express = require("express");
const expresslayouts = require("express-ejs-layouts")
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");


const MongoURI = "mongodb+srv://AnkitaRai:AnkitaRai94420@cluster0.mqos7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(MongoURI, { useNewUrlParser: true })
    .then(() => console.log("mongodb connected ...."))
    .catch(err => {
        console.log("mongo not connected");
        console.log(err)}); 

app.use(expresslayouts);
app.set("view engine" , "ejs");

app.use(express.urlencoded({ extended: false}));

// use public folder
app.use("/public", express.static("public"));

const UserSchema  = new mongoose.Schema({
    name : {
        type : String ,
        required : true,   
    },
    email : {
        type : String ,
        required : true,   
    },
    password : {
        type : String ,
        required : true,   
    },
  
});
const USER = mongoose.model('USER', UserSchema);

const DonateSchema  = new mongoose.Schema({
    name : {
        type : String ,
        required : true,   
    },
    email : {
        type : String ,
        required : true,   
    },
    mb_num :{
        type : Number,
        required : true
    },
    bloodgroup : {
        type : String ,
        required : true ,
    },
    gender : {
        type : String ,
        required : true ,
    },
    bloodunit : {
        type : Number ,
        required : true ,
    },
    
    Status : {
        type : String ,
        required : true ,
    },
   
    date : {
        type : Date ,
       default : Date.now,
    }
});
const DONATE = mongoose.model('DONATE', DonateSchema);

const RequestSchema  = new mongoose.Schema({
    name : {
        type : String ,
        required : true,   
    },
    email : {
        type : String ,
        required : true,   
    },
    mb_num :{
        type : Number,
        required : true
    },
    bloodgroup : {
        type : String ,
        required : true ,
    },
    gender : {
        type : String ,
        required : true ,
    },
    bloodunit : {
        type : Number ,
        required : true ,
    },
    
    Status : {
        type : String ,
        required : true ,
    },
   
    date : {
        type : Date ,
       default : Date.now,
    }
});
const REQUEST = mongoose.model('REQUEST', RequestSchema);

let NAME , EMAIL;

app.get("/dashboard" , (req , res)=>{

    res.render("homepage");
})
// handle get request for doante
app.get("/donate", (req , res)=>{
    res.render("user/donate")

});
// handle post  request for donate
app.post("/donate", (req , res)=>{
    let message = [];
    console.log(req.body);
 let { name , email ,  mb_num , bloodgroup ,gender,  bloodunit } = req.body ; 
 let status = "pending";
     const new_request = new DONATE({
        name , email ,  mb_num , bloodgroup ,gender,  bloodunit, Status:status ,
       
    
     })
     new_request.save().then((u)=>{
         message.push({msg : "Your request has been send to admin"});
        res.render("user/findblood" ,{errors : message});
     }).catch(err=>{console.log(err)
    
      } );
  

});

// handle get request for find blood 
app.get("/findblood", (req , res)=>{
    res.render("user/findblood")

});
// handle post  request for find blood
app.post("/findblood", (req , res)=>{
    let message = [];
    console.log(req.body);
 let { name , email ,  mb_num , bloodgroup ,gender,  bloodunit } = req.body ; 
 let status = "pending";
     const new_donate = new REQUEST({
        name , email ,  mb_num , bloodgroup ,gender,  bloodunit, Status:status ,
       
    
     })
     new_donate.save().then((u)=>{
         message.push({msg : "Your request has been send to admin"});
        res.render("user/donate" ,{errors : message});
     }).catch(err=>{console.log(err)
    
      } );

});

// get register handle
app.get("/register" ,(req , res)=>{
    res.render("register");
})
// post register handle
app.post("/register" ,(req , res)=>{
  
    let {name , email , password , password2 } =  req.body ;
    let errors = [];
    if(password === password2){
        const new_user = new USER ({
           name , email , password 
        });
        new_user.save().then((u)=>{
            errors.push({msg : "You are successfully register"});
            res.render("login" , {errors :errors});
        }).catch((err)=>{
            console.log(err);
            errors.push({msg : "Error "});
            res.render("register" , {errors :errors});
        })
    }else{
        errors.push({msg : "password do not match "});
        res.render("register" , {errors :errors});
    }
  
   
})
// get login handle
app.get("/" ,(req , res)=>{
    res.render("login");
})
// post login handle
app.post("/" ,(req , res)=>{
    let errors = [];

    USER.findOne({email : req.body.email} ).then((u)=>{
        if(u){
            if(u.password === req.body.password)
        {
            NAME = u.name;
            EMAIL = u.email;
            res.render("homepage" );
        }else{
            errors.push({msg : "incorrect password"});
            res.render("login" , {errors :errors});
        }
        }else if(!u){
            errors.push({msg : "Email is not registered"});
            res.render("login" , {errors :errors});
        }
    }).catch((err)=>{
       console.log(err);
    })
        
        
   

   
})

app.get("/request" , (req, res)=>{
    res.render("user/request");
});

app.get("/BloodRequest" , (req, res)=>{    
    let REQ_PENDING = [];  
    console.log(NAME);

    REQUEST.find({email : EMAIL }, (err , data)=>{
        if(err){
            console.log(err)
        }else{
            data.forEach((d)=> {
                if(d.Status === 'pending')
                {
                   
                    REQ_PENDING.push(d);
                } 
               })
               res.render("user/request" , { REQ_PENDING : REQ_PENDING });
        }
    });
    



    
});

app.get("/DonateRequest" , (req, res)=>{
    let REQ_PENDING = [];  
    console.log(NAME);

    DONATE.find({email : EMAIL }, (err , data)=>{
        if(err){
            console.log(err)
        }else{
            data.forEach((d)=> {
                if(d.Status === 'pending')
                {
                   
                    REQ_PENDING.push(d);
                } 
               })
               res.render("user/request" , { REQ_PENDING : REQ_PENDING });
        }
    });
    
});
app.get("/RequestHistory" , (req, res)=>{
    let REQ_HISTORY = [];  
    console.log(NAME);

    REQUEST.find({email : EMAIL }, (err , data)=>{
        if(err){
            console.log(err)
        }else{
            data.forEach((d)=> {
                if(d.Status === 'accepted' || d.Status === 'rejected'  )
                {
                   
                    REQ_HISTORY.push(d);
                } 
               })
               res.render("user/request" , { REQ_HISTORY : REQ_HISTORY });
        }
    });

});
app.get("/Donatehistory" , (req, res)=>{
    let REQ_HISTORY = [];  
    console.log(NAME);

    DONATE.find({email : EMAIL }, (err , data)=>{
        if(err){
            console.log(err)
        }else{
            data.forEach((d)=> {
                if(d.Status === 'accepted' || d.Status === 'rejected' )
                {
                   
                    REQ_HISTORY.push(d);
                } 
               })
               res.render("user/request" , { REQ_HISTORY : REQ_HISTORY });
        }
    });
});



app.get("/exit" , (req , res)=>{
    res.redirect("/");
})


const BloodAvailableSchema  = new mongoose.Schema({
  
    blood_group : {
        type :String,
        required :true,
    },
    blood_unit : {
        type :Number,
        required :true,
    },
    

});

const BloodAvailable = mongoose.model('BloodAvailable', BloodAvailableSchema);


app.post("/adminlogin" , (req,res)=>{
 
    if(req.body.password === "Admin@123456789"){
        res.redirect("/admin");
    }
    else{
        res.send("Wrong password");
    }

    
})

app.get("/admin" , (req , res)=>{
    res.render("Admin/admin");
})

app.get("/donateREQ_ADMIN" , (req , res)=>{
    let REQ_RECORD_D = [];  
    console.log(NAME);

    DONATE.find( (err , data)=>{
        if(err){
            console.log(err)
        }else{
            data.forEach((d)=> {
                if(d.Status === 'pending')
                {var obj = {
                    ID : d._id,
                    data: d
                 } 

                 REQ_RECORD_D.push(obj);
                } 
               })
               res.render("Admin/admin" , { REQ_RECORD_D : REQ_RECORD_D });
        }
    });
});


app.get("/blood_DONATE_ACCEPT" , (req , res)=>{
  
    let REQ_RECORD = [];
    console.log(req.query.id)
    const U_id = req.query.id;
    let obj = []; 
 
    
    DONATE.findById(U_id).then(u=>{
      if(u){
        //   console.log(u);
          obj[0] = u.bloodgroup;
          obj[1] = u.bloodunit;
          console.log(obj);
          BloodAvailable.updateOne(
            { "blood_group": obj[0] }, // Filter
            { $inc: { "blood_unit" : obj[1] } }, // Update
    
    
        )
            .then((u) => {
                console.log('Updated - ');
                DONATE.updateOne(
                  { "_id": U_id }, // Filter
                  { $set: { "Status": 'accepted' } } // Update
                 
              )
                  .then((u) => {
                      console.log('Updated - ');
                      res.redirect('/admin');
                  })
                  .catch((err) => {
                      console.log(' 1 Error: ' + err);
                  })
            })
            .catch((err) => {
                console.log('Error: ' + err);
            })
      }
    }).catch(error=>console.log(error));
 
  });
    

  
app.get('/blood_DONATE_REJECT', (req, res) => {

  console.log(req.query.id)
  const U_id = req.query.id;
  //    BloodRequest.updateOne({email : U_email} , { $set :{status : 'accepted'} });

  DONATE.updateOne(
      { "_id": U_id }, // Filter
      { $set: { "Status": 'rejected' } }, // Update


  )
      .then((obj) => {
          console.log('Updated - ');
          res.redirect('/admin')
      })
      .catch((err) => {
          console.log('Error: ' + err);
      })
});

app.get("/findbloodREQ_ADMIN" , (req , res)=>{
    let REQ_RECORD = [];  
    console.log(NAME);

    REQUEST.find( (err , data)=>{
        if(err){
            console.log(err)
        }else{
            data.forEach((d)=> {
                if(d.Status === 'pending')
                {
                    var obj = {
                        ID : d._id,
                        data: d
                     } 

                     REQ_RECORD.push(obj);
                } 
               })
               res.render("Admin/admin" , { REQ_RECORD : REQ_RECORD });
        }
    });
    
})


app.get("/blood_REQ_ACCEPT" , (req , res)=>{
  
    let REQ_RECORD = [];
    console.log(req.query.id)
    const U_id = req.query.id;
    let obj = []; 
 
    
  REQUEST.findById(U_id).then(u=>{
      if(u){
        //   console.log(u);
          obj[0] = u.bloodgroup;
          obj[1] = u.bloodunit;
          console.log(obj);
          BloodAvailable.updateOne(
            { "blood_group": obj[0] }, // Filter
            { $inc: { "blood_unit" : -obj[1] } }, // Update
    
    
        )
            .then((obj) => {
                console.log('Updated - ');
                REQUEST.updateOne(
                  { "_id": U_id }, // Filter
                  { $set: { "Status": 'accepted' } } // Update
                 
              )
                  .then((u) => {
                      console.log('Updated - ');
                      res.redirect('/admin');
                  })
                  .catch((err) => {
                      console.log(' 1 Error: ' + err);
                  })
            })
            .catch((err) => {
                console.log('Error: ' + err);
            })
      }
    }).catch(error=>console.log(error));
 
  });
    

  
app.get('/blood_REQ_REJECT', (req, res) => {

  console.log(req.query.id)
  const U_id = req.query.id;
  //    BloodRequest.updateOne({email : U_email} , { $set :{status : 'accepted'} });

  REQUEST.updateOne(
      { "_id": U_id }, // Filter
      { $set: { "Status": 'rejected' } }, // Update


  )
      .then((obj) => {
          console.log('Updated - ');
          res.redirect('/admin')
      })
      .catch((err) => {
          console.log('Error: ' + err);
      })
});






app.listen(process.env.PORT || 8000 , ()=>{
    console.log("Server started...");
});

