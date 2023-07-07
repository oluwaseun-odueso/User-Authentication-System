// const emailValidator = require('email-validator')
const {generateToken} = require('../authentication/userAuth');
const {
   schema,
   validateEmail,
   createUser,
   checkEmail,
   checkUsername,
   getUserById,
   getUserByEmail,
   hashPassword,
   retrieveHashedPassword,
   confirmRetrievedPassword,
   checkIfEntriesMatch,
   updateUserAccount,
} = require('../functions/userFunctions');


async function signup(req, res) {
   try {
      // Check if all required fields are provided
      if (!req.body.username || !req.body.email || !req.body.password) {
         return res.status(400).json({ 
               success: false, 
               message: "Please enter all required fields"
         });
      };
      const {username, email, password} = req.body;
      
      // Validate email and password
      const isEmailValid = validateEmail(email)
      const isPasswordValid = schema.validate(password)
      if (!isEmailValid) {
         return res.status(400).json({success: false, message: 'Please enter a valid email address'})
      }
      if (!isPasswordValid) {
         return res.status(400).json({success: false, message: "Password must be at least 8 characters containing lowercase(s), uppercase(s), digit(s), special character(s), and must not contain spaces"})
      }
      
      // Check if email is already registered
      if (await checkEmail(email)) { 
         return res.status(400).json({ success: false, message: "Email is already registered"}) 
      };

      // Check if phone number is already registered
      if (await checkUsername(username)) {
         return res.status(400).json({ success: false, message: "Please choose another username"}) 
      };

      // Hash password, create user and return user's details
      const hashed_password = await hashPassword(password);
      await createUser({username, email, hashed_password});
      const user = await getUserByEmail(email)
      res.status(201).json({ 
          success: true,
          message : "Your account has been created successfully", 
          user}) 
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: "An error occurred while creating the user's account",
          error: error.message
      });
  };
};

async function login(req, res) {
   try {
      // Check if all required fields are provided
      if (!req.body.email || !req.body.password) {
         return res.status(400).json({ 
            success: false, 
            message: "Please enter email and password"
         });
      };
      const {email, password} = req.body;

      // Validate email 
      const isEmailValid = validateEmail(email)
      if (!isEmailValid) {
         return res.status(400).json({success: false, message: 'Please enter a valid email address'})
      }
      
      // Check if user or account exists 
      const user = await getUserByEmail(email);
      if (!user) {
         return res.status(404).json({ success: false, message: "Account does not exist"})
      };

      // Collect hashed password from database, unhash it and compare with password user entered
      const collectedPassword = await retrieveHashedPassword(email)
      if (await confirmRetrievedPassword(password, collectedPassword) !== true) {
         return res.status(404).json({ success: false, message: "You have entered an incorrect password"})
      };
      
      // Generate token upon successful login
      const token = await generateToken(user);
       res.status(200).json({
           success: true,
           message: "You have successfully logged in",
           user, 
           token
      });
   } catch (error) {
       return res.status(500).json({
           success: false,
           message: "An error occurred while logging in user",
           error: error.message
       });
   };
};

async function updateAccount(req, res) {
   try {
      // Check if necessary fields are entered
      if (!req.body.username || !req.body.email) {
         return res.status(401).json({ 
            success: false, 
            message: "Please enter all required fields"
         });
      };
      const {username, email} = req.body;

      // Check if already email is already registered
      const user = await getUserById(req.user.id)
      if ( await checkEmail (email) && ! checkIfEntriesMatch(user.email, email)) {
         return res.status(400).json({
            success: false,
            message: "Email already exists"
         });
      };

      // Update user profile and return user's new details
      await updateUserAccount(req.user.id, username, email)
      const newDetails = await getUserById(req.user.id)
      res.status(200).json({
         success: true,
         message: 'Your profile has been updated!', 
         newDetails
      });
   } catch (error) {
       return res.status(500).json({
           success: false,
           message: `Error updating user's profile`,
           error: error.message
       });
   };
};

async function getAccount(req, res) {
   try {
      // Check if user or account exists, return user's details if an account exists or return an error message if no account is found
      const user = await getUserById(req.user.id);
      if (!user) {
         return res.status(400).json({
               success: false,
               message: "Oops! You do not have an account, sign up to continue."
         });
      };

      res.status(200).json({ 
         success: true,
         user
      });
   } catch (error) {
         return res.status(500).json({
            success: false,
            message: "Error getting user's account details",
            error: error.message
         });
   };
};

async function logout(req, res, next) {
   try {
      if (req.session) {
         req.session.destroy(err => {
            if (err) {
               res.status(400).json({success: false, message: 'Unable to log out'})
            } else {
               res.redirect('/')
            }
         })
      } else {
         res.end();
      }
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Error logging user out",
         error: error.message
      });
   }
}

const controllers = {
   signup, 
   login, 
   getAccount,
   updateAccount,
   logout
}

module.exports = controllers;