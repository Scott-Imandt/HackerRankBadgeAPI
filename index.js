import 'dotenv/config';
import express from 'express'
import cors from 'cors'


const port = process.env.PORT || 4000;
const app = express();

//register view engine
app.set('view engine', 'ejs');

app.listen(port);


var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }


//Middle Ware
app.use(cors(corsOptions))

app.use("/public", express.static('public'));

app.get('/', (req, res)=>{
    res.setHeader('content-type','image/svg+xml')
    res.render('index', {title: "Python"});
})

app.use((req,res) =>{
    res.status(404).send("Incorrect URL")
})


