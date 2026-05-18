const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();

const uri = process.env.MONGODB_URI;

const app = express();
const PORT  = process.env.PORT;

//middlewar
app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {

    const db = client.db("wanderlust");
    const destinationCollection = db.collection('destination');


    app.get('/destinations', async(req, res)=>{
        const result =await destinationCollection.find().toArray();
        res.json(result);
    })

    app.post('/destination', async(req, res)=>{
        const destination = req.body;
        console.log(destination)
        const result = await destinationCollection.insertOne(destination);
        res.json(result);
    })

    app.get('/destination/:id', async(req, res)=>{
        const {id} = req.params;
        const result = await destinationCollection.findOne({_id: new ObjectId(id)})
        res.json(result)
    })


    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send("Server is running")
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})