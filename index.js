const express = require('express');
const cors = require('cors')
// const bodyParser = require('body-parser')
// const jwt = require('jsonwebtoken');
require('./DB/config');
const Members = require('./DB/Members')
const Collection = require('./DB/Collection')
const User = require("./DB/User")
const jwt = require('jsonwebtoken');



const app = express();
app.use(cors());
app.use(express.json())


app.get("/", async (req, res) => {
    res.send("Milk Dairy");
})

app.post('/add-members', async (req, res) => {
    const { userId, name, mobileNo } = req.body;
    const memberCount = await Members.countDocuments();
  const newUserId = memberCount + 1;
    // const newMember = new Members({
    //     userId,
    //     name,
    //     mobileNo,
    // });

    try {
        // Create a new member instance
        const newMember = new Members({
            userId :  newUserId,
            name,
            mobileNo,
        });

        const result = await newMember.save();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    // Save the member to the database
    // await newMember.save((err, member) => {
    //   if (err) {
    //     console.error(err);
    //     return res.status(500).send('Error adding member.');
    //   }
    //   res.status(201).json(member);
    // });
});

app.get("/members", async (req, res) => {
    let membreList = await Members.find()
    res.send(membreList);
})

// Add this to your app.js
app.post('/add-collection', async (req, res) => {
    const { userId, milk, snf, fat, animal, date, amount } = req.body;
  
    try {
      // 1. Validate userId
      const member = await Members.findOne({ userId });
      const date_time = new Date();
      const currentTime = date_time.getHours(); // Get the current hour
  
      if (!member) {
        return res.status(400).json({ error: 'Invalid userId. Member not found.' });
      }
  
      // 2. Determine whether it's "morning" or "evening" based on the current time
      let timeOfDay;
      if (currentTime >= 0 && currentTime < 12) {
        timeOfDay = 'morning';
      } else {
        timeOfDay = 'evening';
      }
  
      // 3. Create a new collection entry associated with the specified user (userId)
      const newCollection = new Collection({
        userId: userId, // Assign the ObjectId of the member
        memberName: member.name, // Add member's name to the collection
        milk,
        snf,
        fat,
        animal,
        date: date_time,
        amount,
        time: timeOfDay, // Assign "morning" or "evening" based on current time
      });
  
      const result = await newCollection.save();
      res.status(201).json(result);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  // Fetch all collections
app.get('/collections', async (req, res) => {
    try {
      const collectionList = await Collection.find();
      res.json(collectionList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Middleware function to verify tokens
function verifyToken(req, res, next) {
    console.log("verify token called")
    const token = req.headers['authorization']; // Assuming the token is in the 'Authorization' header

    if (!token) {
        return res.status(403).json({ error: 'Token is missing' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token is invalid' });
        }
        req.user = decoded;
        next(); // Proceed to the protected route
    });
}

// Generate a token when the user registers or logs in
function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email, // Include any relevant user data in the payload
    };

    return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
}

// Example usage in the login route
app.post("/login", async (req, res) => {
    if (req.body.email && req.body.password) {
    console.log("login")

        const user = await User.findOne(req.body).select('-password');
        if (user) {
            // If user exists and credentials are valid, generate a token
            const token = generateToken(user);

            // Send the token as a response
            res.json({user, token });
        } else {
            res.status(401).json({ error: 'Authentication failed' });
        }
    } else {
        res.status(400).json({ error: 'Invalid request' });
    }
});


app.get("/", async (req, res) => {
    res.send("Hello");
})

app.post("/register", async (req, res) => {
    let user = new User(req.body)
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send(result);
})

const PORT = process.env.port || 3000


app.listen(PORT, ()=>console.log("Server is running on 3000 port"))