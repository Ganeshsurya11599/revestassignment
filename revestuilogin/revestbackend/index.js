let express = require('express'),
    path = require('path'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    Bcrypt = require('bcryptjs'),
    client = require('./database/databasepg');


// Setting up express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

// Api root
const loginRoute = require('./Login/login.routes');
app.use('/user', loginRoute)

// Create port
const port = process.env.PORT || 8080;

// Conectting port
const server = app.listen(port, () => {
    console.log('Port connected to: ' + port)
})

// Index Route
app.get('/adduserdata/:password', async (req, response) => {
    const saltRounds = 10; // Number of salt rounds (cost factor)
    const hashedPassword = await Bcrypt.hash(req.params.password, saltRounds);
    client.query(`INSERT INTO users (username, email, password_hash,role) VALUES ('Ganeshsurya', 'ganeshsurya@gmail.com', '${hashedPassword}','admin');`, (err, res) => {
        if (err) {
            console.log(err)
            response.send('Data not Inserted!..')
        }
        else {
            response.send('Data Inserted successfully!..')
        }
    })
});

// Static build location
app.use(express.static(path.join(__dirname, 'dist')));