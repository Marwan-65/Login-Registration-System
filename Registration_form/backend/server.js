const express= require("express");
const mysql= require("mysql");
const cors= require("cors");
const bcrypt = require('bcrypt');
require('dotenv').config();
const saltRounds=10;

const app = express();
app.use(cors());
app.use(express.json());


const con= mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATANAME,
})

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  /*-----------------------------------------------------------------------------------------------------------------------*/

  app.post("/addUser", (req,res)=>{

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            throw err;
        }
        // Salt generation successful, proceed to hash the password
        let userPassword=req.body.Password;
        bcrypt.hash(userPassword, salt, (err, hash) => {
            if (err) {
                throw err;
            }
        
        // Hashing successful, 'hash' contains the hashed password
        con.query('INSERT INTO users (Username,Phone, Email, Password) VALUES ( ?, ?, ?, ?)' ,[req.body.Username,req.body.Phone,req.body.Email,hash], function (err, result) {
            if (err) throw err
            if (result[0] === undefined)
            {
              console.log(err)
              return res.json("Error has occured")
            }
            return res.json(JSON.stringify(result))
          });
        console.log('Hashed password:', hash);
        });
        });
    
    
  })

  app.post("/registerCheck", (req,res)=>{
    con.query('select * from users where Email=?' ,[req.body.Email], function (err, result) {
      if (err) throw err
      if (result[0] === undefined)
      {
        console.log(err)
        return res.json("Good to go")
      }
      return res.json("This email is already in use")
    });
  })

  app.post("/loginUser", (req,res)=>{

    con.query('select * from users where Email=?' ,[req.body.Email], function (err, result) {
        if (err) throw err
        if (result[0] === undefined)
        {
          console.log("no mail, undefined")
          return res.json("user not found")
        }
        else
        if(result.length>0)
        {
            let userPass=req.body.Password;
            let storedPass=result[0].Password;
            bcrypt.compare(userPass, storedPass, (err, result) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    throw err;
                }
            
                if (result) {
                    // Passwords match, authentication successful
                    console.log('Passwords match! User authenticated.');
                    return res.json("Success");
                } else {
                    // Passwords don't match, authentication failed
                    console.log('Passwords do not match! Authentication failed.');
                    return res.json("user not found");
                }
            });
        }
        else{
        
        console.log(err);
        return res.json("user not found");
        }
        
  
      });
  })

var listener = app.listen(4000,()=>{console.log(listener.address().port)})