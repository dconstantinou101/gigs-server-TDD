//app.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors());

///Home of gigs database - TODO refactor later to a seperate db file
let gigs = [

    {
        id: 1,
        name: "Gorillaz",
        description: "The Mountain Tour",
        date: '2026-03-28',
        location: "Nottingham, Motorpoint Arena",
        image: "https://www.shutterstock.com/image-photo/barcelona-jun-15-gorillaz-band-perform-1216910098?trackingId=362f275d-1d32-4524-9410-ae8cb561d624&listId=searchResults"

    },
    {
        id: 2,
        name: "Lilly Allen",
        description: "Mighty Hoopla",
        date: '2026-04-30',
        location:"Brockwell Park",
        image: "https://www.shutterstock.com/image-photo/prague-october-30-english-singer-lily-183903644?trackingId=2858e7a0-90a7-4228-9e49-5a1880b45890&listId=searchResults"
    },
    {
        id:3,
        name: "The Cult",
        description: "Electric Tour",
        date: "2026-06-30",
        location: "Nottingham, Royal Concert Hall",
        image: "https://www.shutterstock.com/image-photo/zagreb-croatia-june-27-2017-rockfest-669771274?trackingId=a9dfd94e-39f0-4b09-bf8e-28fe8d55eea0&listId=searchResults"
    }
]

// get route
app.get("/gigs", (req,res) =>{
    res.send({gigs})
})

/*  /gigs/:id  get*/
app.get("/gigs/:id", (req,res) =>{
    const id = parseInt(req.params.id)
    const gig = gigs.find((gig) => gig.id === id)
    
    if(!gig){
        return res.status(404).send({message: "Gig not found"});
    }
    res.send({ gig })
})

// /gigs/:id delete*/
app.delete("/gigs/:id", (req,res) =>{
    const id = parseInt(req.params.id)
    //replace in memory state - could also use splice with index
    const updatedGigs = gigs.filter((gig) => gig.id !== id);
    if (updatedGigs.length === gigs.length) {
    return res.status(404).json({ message: "Gig not found" });
  }
    gigs = updatedGigs
    res.send ({message:"Successfully deleted gig", gigs})
})

// Gigs post route

app.post("/gigs", (req, res) => {
  const newGig = req.body.gig;

// edge case - no gig object passed or gig object is empty
  if (!newGig || Object.keys(newGig).length === 0) {
    return res.status(400).send({
      message: "Request must include a gig object with properties",
    });
  }

  // edge case - catch any missing properties values in the passed object
  const requiredProps =  ["name", "description", "date", "location", "image"]
  for (const prop of requiredProps){
    if(!newGig[prop]){
        return res.status(400).send({message: `Missing property value: ${prop}`})
    }
  }

  //need an id generator - could use uuid package but this returns a string, so would need to change tests etc
  //compromise for current needs - use max value of current id's to generate new one
   //use map to loop thru gigs to return an array of ids then use spread for math.max
  const newId =
    gigs.length > 0 ? Math.max(...gigs.map((gig) => gig.id)) + 1 : 1;

  const gigToAdd = {
    id: newId,
    name: newGig.name,
    description: newGig.description,
    date: newGig.date,
    location: newGig.location,
    image: newGig.image,
  };
  //push mutates the aray and return length
  gigs.push(gigToAdd);
  
  console.log(gigs)

  //201 - created code. Respond with message and updataed gigs list
  res.status(201).send({
    message: "Successfully posted new gig",
    gigs,
  });
});

//Delete gigs array
app.delete("/gigs", (req,res) =>{

  gigs = [];
  res.send({
    message: "Successfully deleted all the gigs",
    gigs,
  })

})

//put root to meet challenge use case.  To follow REST semantics this scenario should
// ideally be implemented usign a PATCH endpoint since only 1 field is bing updated.
//PUT - full replacement contract
//PATCH - partial update contact can be 1 - to all of the fields
app.put("/gigs/:id", (req,res) =>{
  const id = parseInt(req.params.id);
  console.log(id)
  //destructure to get date from body
  const { date } = req.body;
  // console.log(req.body)
  // console.log(date)

  if (!date) {
    return res.status(400).json({ message: "Request must include a date" });
  }

  //find matching gig to update
  const gig = gigs.find((gig) => gig.id === id);

  //if no match with id send error message
  if(!gig) {
    return res.status(404).send({message: "Gig not found"})
  }

  //update gig date
  gig.date = date;

  //return update gig
  res.send({gig:gig});

}) 

//patch route: one or all of the fields can be updated - not the full resource
//only provided fields are updated
//id source of truth ---> req.params
app.patch("/gigs/:id", (req,res) => {
  const id = parseInt(req.params.id);

  const gigUpdates = req.body;

// edge case - no gig object passed or gig object is empty
  if (!gigUpdates || Object.keys(gigUpdates).length === 0) {
    return res.status(400).send({
      message: "No properties were provided to update",
    });
  }

  //find matching gig to update
  const gig = gigs.find((gig) => gig.id === id);

  //if no match with id send error message
  if(!gig) {
    return res.status(404).send({message: "Gig not found"})
  }

  Object.keys(gigUpdates).forEach((key) => {
    gig[key] = gigUpdates[key]
    console.log(`${key}:${gigUpdates[key]}`);
  })
  res.send({gig:gig});
})


module.exports = app;