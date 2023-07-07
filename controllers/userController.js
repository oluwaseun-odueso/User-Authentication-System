const emailValidator = require('email-validator')
const {generateToken} = require('../authentication/userAuth');
const {
   schema,
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
         res.status(400).json({ 
               success: false, 
               message: "Please enter all required fields"
         });
         return;
      };
      const {username, email, password} = req.body;
      // Validate email and password
      const validateEmail = emailValidator.validate(email)
      const validatePassword = schema.validate(password)
      if (!validateEmail) {
         return res.status(400).json({success: false, message: 'Please enter a valid email address'})
      }
      if (!validatePassword) {
         return res.status(400).json({success: false, message: "Password must be at least 10 characters containing lowercase(s), uppercase(s), digit(s), special character(s), and must not contain spaces"})
      }
      
      // Check if email is already registered
      if (await checkEmail(email)) { 
         res.status(400).json({ success: false, message: "Email is already registered"}) 
         return;
      };

      // Check if phone number is already registered
      if (await checkUsername(username)) {
         res.status(400).json({ success: false, message: "Please choose another username"}) 
         return;
      };

      // Hash password, create user and return message to user
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
      if (!req.body.email || !req.body.password) {
         res.status(400).json({ 
            success: false, 
            message: "Please enter email and password"
         });
         return;
      };
      const {email, password} = req.body;

      const user = await getUserByEmail(email);
      if (!user) {
         res.status(404).json({ success: false, message: "Invalid email address entered"})
         return;
      };

      const collectedPassword = await retrieveHashedPassword(email)
      if (await confirmRetrievedPassword(password, collectedPassword) !== true) {
         res.status(404).json({ success: false, message: "You have entered an incorrect password"})
         return;
      };
      
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
         res.status(401).json({ 
            success: false, 
            message: "Please enter all required fields"
         });
         return;
      };

      // Deconstruct username and email
      const {username, email} = req.body;
      const user = await getUserById(req.user.id)
      if ( await checkEmail (email) && ! checkIfEntriesMatch(user.email, email)) {
         res.status(400).json({
            success: false,
            message: "Email already exists"
         });
         return;
      };

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
         const user = await getUserById(req.user.id);
         if (!user) {
            res.status(400).json({
                  success: false,
                  message: "Oops! You do not have an account, sign up to continue."
            });
            return;
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