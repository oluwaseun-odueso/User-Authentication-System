const {
    checkEmail,
    checkUsername,
    getUserById,
    getUserByEmail,
    hashUserPassword
} = require('../functions/userFunctions')

const signUp = async(req, res) => {
    if (req.body.username && req.body.email && req.body.password) {
        const {username, email, password} = req.body
        try {
            // Check if user email is already registered
            if (await checkEmail(email)){ res.status(400).send({message: "Email is already resigtered, use another valid email"}) 
                return
            };

            // Check if username is already taken
            if (await checkUsername(username)){ res.status(400).send({message: "Username is already taken"}) 
                return
            };

            // Hash user password, store in the database and return details back to the user
            const hashedPassword = await hashUserPassword(password)
            await createUser(username, email, phone_number, hashedPassword, address)
            const user = await getUserByEmail(email)
            res.status(201).send({ message : "Your account has been created", user})
        } catch (error) {
            res.status(400).send({message: error.message})
        }
    }
    else res.status(400).json({ errno: "101", message: "Please enter all necessary details" })
};

const controllers = {
    signUp
}

module.exports = controllers;