const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./config');
const UserModel = require('../model/DB');



// Generate a cryptographically secure salt value
const saltRounds = 12;

//const salt = bcrypt.genSaltSync(saltRounds);



//function to register 
const authRegister = async(req, res) =>{
  try{
 const {first_name, last_name, email, user_name, password, role} = req.body
 
 if (!user_name ||  !email || !password || !last_name || !first_name){
   return res.status(422).json({msg: 'please fill in all fields'})
 } //res.status(200).json({msg: "ok up till now"})
 //password hashing
 const hashedPassword = await bcrypt.hash(password, saltRounds);
 //save users registration data
  const user = await UserModel.create({
   first_name,
   last_name,
   email,
   user_name,
   password: hashedPassword,
   role: role ?? 'member'
  });
  res.status(201).json({
     msg: "your account has been created successfully!",
     data: user
   });
  }catch(error){
   return res.status(500).json({msg : error.msg})
  };
 }


//login functions
const authLogin = async (req, res) => {
  try {
    const { username , password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid username or password' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ msg: 'Invalid username or password' });
    }
    // Generate access token
    const accessToken = jwt.sign({ userId: user._id, role: user.role }, config.accessTokenSecret, {
      expiresIn: '1d',
      subject: 'accessApi'
    });
    // Generate refresh token
    const refreshToken = jwt.sign({ userId: user._id, role: user.role }, config.refreshTokenSecret, {
      expiresIn: '1w',
      subject: 'refreshToken'
    });
    // Store refresh token securely in the database
    await UserModel.updateOne({ _id: user._id }, { $set: { refreshToken } });
    res.json({ 
      userId: user._id,
      accessToken,
       msg: 'login succesful, welcome back dear UserModel'
       });
  } catch (error) {
     res.status(500).json({ msg: error.msg });
   }
}







module.exports = {authRegister, authLogin};
