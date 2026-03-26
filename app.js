//app.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors());

///Home of gigs database - refactor later to a seperate db file
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

/* /gigs/:id delete*/
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
/* gigs post */


module.exports = app;