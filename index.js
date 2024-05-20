const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000 ;




//middleware
const corsOptions = {
    origin: ["http://localhost:5173" , "http://localhost:5174"],
    Credentials : true,
    optionSuccessStatus: 200
}
app.use(cors({corsOptions}));
app.use(express.json());
// --------------------
// solosphere    9P3JWQCpgxxstksg  
 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wkehc2o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const  jobsCollection = client.db('solosphere').collection('jobs')
    const bidsCollection = client.db('solosphere').collection('bids')
    // const  = client.db('solosphere').collection('bids')
    // await client.connect();
    // ------------


// get all jobs data from db
 app.get('/jobs' , async(req,res)=>{
      const result = await jobsCollection.find().toArray()
      res.send(result)
 })



// get singel job data
app.get('/job/:id' , async(req,res)=>{
     const id = req.params.id
     const query = {_id: new ObjectId(id)}
     const result = await jobsCollection.findOne(query)
     res.send(result)
})



// sabe bid data in database

app.post('/bid' , async(req,res)=>{
    const bidData = req.body
    const result = await bidsCollection.insertOne(bidData)
    res.send(result)
})


// sabe job data in database
app.post('/job' , async(req,res)=>{
    const jobData = req.body
    const result = await jobsCollection.insertOne(jobData)
    res.send(result)
})


// get all posted jobs

app.get('/jobs/:email' ,  async(req,res)=>{
    const email = req.params.email
    const query = { 'buyer.email': email}
    const result = await jobsCollection.find(query).toArray()
    res.send(result)
})
// --------------------------------------------------------------------deleteeee a a job data
app.delete('/job/:id' ,  async(req,res)=>{
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await jobsCollection.deleteOne(query)
    res.send(result)
})


// update

app.put('/job/:id' , async(req,res)=>{
    const id  = req.params.id
    const jobData = req.body
    const query = {_id: new ObjectId(id)}
    const options = {upsert: true}
    const updateDoc = {
       $set:{
         ...jobData , 
       }
    }
    const result = await jobsCollection.updateOne(query , updateDoc , options)
    res.send(result)
})





    // ===================================================================================================================
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// ----------------------












app.get('/' , (req ,res)=>{
    res.send('Solosphere CRUD IS  RUNNING')
})




app.listen(port , ()=>{
    console.log(`solosphereCrud is running on port , ${port}`)
})
