const express = require('express');
const cors = require('cors');
const mysql2 = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const database = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {rejectUnauthorized: true} 
});

app.post('/register', (req,res)=> {
    const{name,email,password,blood_type,sub_division,quarter,phone,status} = req.body;
  if (!name || !email || !password || !blood_type || !sub_division || !quarter || !phone || !status){
   return res.json({ success: false, error: 'missing fields'});
  }
  database.query('SELECT id FROM user WHERE email = ?', [email], (error, credentials) => {
    if (error){
        console.log(error);
     return res.json({ success:false, message: 'data base error'});}
    if (credentials.length > 0 ){return res.json({success: false, message: 'Email already used'});}
    database.query('INSERT INTO user (name, email, password, phone, sub_division, quarter, blood_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [name, email, password, phone, sub_division, quarter, blood_type, status],
     (error2, result) => { 
        if (error2){
            console.log(error2);
         return res.json({success:false, message:'data base error'});
       }
 res.json({ success: true, message: 'account created'});
             });
        });
  });  


app.post('/login',(req,res) =>{
    const {email,password} = req.body;
    if (!email || !password){
        return res.json({success: false, error:'Fill in the missing fields'});
    } 
    database.query('SELECT * FROM user WHERE email = ? AND password = ?', [email,password], (error, credentials)=> {
        if (error) return res.json({success: false, message: 'data base error'});
        if (credentials.length === 0){ return res.json({success: false, message:'email or password incorrect'});
     }
      return res.json({success: true, message:'Login successful',user_id:credentials[0].id, status: credentials[0].status});
     });
});
app.post('/referdonor',(req,res)=>{
 const {contact_name, blood_type,sub_division,quarter,phone} = req.body;
 if (!contact_name || !blood_type || !sub_division || !quarter || !phone){
    return res.json({success: false, message: 'please fill in all the contact information'});
 }
 database.query('INSERT INTO contact (contact_name,contact_phone,contact_sub_division,contact_blood_type,contact_quarter) VALUES (?, ?, ?, ?, ?)', [contact_name,phone,sub_division,blood_type,quarter], (error, result) => {
    if (error)
       return res.json({success:false, message:'data base error'});
    
    res.json({success:true, message: 'Contact added successfully'})
 });
});

app.post('/requestblood', (req, res) =>{
    const {user_id,blood_type,sub_division, quarter,phone,urgency,date} = req.body;
    if (!user_id || !blood_type || !sub_division || !quarter || !phone || !urgency || !date){
       return res.json({success: false , message: 'Please fill in every fields'});
    }
    database.query('INSERT INTO blood_request (user_id,blood_needed,sub_division_needed,quarter_needed,urgency,date_needed,phone) VALUES (?, ?, ?, ?, ?, ?, ?)', [user_id,blood_type,sub_division,quarter,urgency,date,phone], (error, result) => {
     if (error)
       return res.json({success: false , message: 'data base error'});
     
     res.json({success: true, message: 'request sent successfully'});
    });
});

app.get('/view-donors', (req, res) =>{
    const user_id = req.query.user_id;
database.query("SELECT blood_needed,sub_division_needed FROM blood_request WHERE user_id = ? ORDER BY blood_request_id DESC LIMIT 1", [user_id], (error,request)=>{
    if(error)return res.json({success:false, message: 'database error'});
    if(request.length === 0)return res.json({success:false , message: 'no blood request found'});

 database.query(`SELECT name, blood_type, sub_division, quarter, phone FROM user WHERE status = 'DONOR' AND blood_type = ? AND sub_division = ?`, [request[0].blood_needed,request[0].sub_division_needed], (error, result)=>{
    if(error)return res.json({success:false, message:'database error'});
    res.json({success:true, data:result});
    });
 });
});
app.get('/view-contacts', (req, res)=>{
    const user_id = req.query.user_id;
    database.query("SELECT blood_needed, sub_division_needed FROM blood_request WHERE user_id = ? ORDER BY blood_request_id DESC LIMIT 1", [user_id], (error,request)=>{
        if (error)return res.json({success:false, message:'database error'});
        if(request.length === 0 )return res.json({success:false, message:'No blood request found'});
    
    database.query(`SELECT contact_name, contact_phone,contact_sub_division,contact_blood_type,contact_quarter FROM contact WHERE contact_blood_type = ? AND contact_sub_division = ?`, [request[0].blood_needed,request[0].sub_division_needed],(error,result)=>{
        if(error)return res.json({success:false, message:'database error'});
        res.json({success:true, data:result});
      });
    });
});
app.get('/view-patients',(req, res)=>{
    const user_id = req.query.user_id;
    database.query("SELECT blood_type, sub_division FROM user WHERE id = ? AND status = 'DONOR'",[user_id],(error, user)=>{
        if (error)return res.json({success:false, message:'database error'});
        if (user.length === 0)return res.json({success:false, message:'Donor not found, you must be a registered donor to view requests '});
    
    database.query(`SELECT user_id,blood_needed,sub_division_needed,quarter_needed, urgency,date_needed,phone FROM blood_request WHERE blood_needed = ? AND sub_division_needed = ?`,[user[0].blood_type,user[0].sub_division],(error,result)=>{
        if (error)return res.json({success:false,message:'database error'});
        res.json({success:true, data:result});
        });
    });
});
app.listen(process.env.PORT || 3000, '0.0.0.0', () =>{
    console.log('server running');
});