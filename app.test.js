const request = require("supertest")
//const app = require("./app")
//resets the app module for each test
let app
beforeEach(() => {
  jest.resetModules();
  app = require("./app")
});

describe("Get gigs endpoint returns the expected data", ()=>{
    test("the status code returns ok", async () =>{
        const response = await request(app).get("/gigs");
        expect(response.statusCode).toBe(200)
        expect(response.body.gigs[0].name).toBe("Gorillaz")
        expect(response.body.gigs.length).toBe(3)
    })
})

describe("Should return a gig given a valid id", ()=>{
    test("the status code returns ok", async () =>{
        //now returning 1 object
        const response = await request(app).get("/gigs/1");

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty("gig")
        expect(response.body.gig.name).toBe("Gorillaz")
      
    })

    test("should return 404 if gig does not exist", async () => {
        const response = await request(app).get("/gigs/66");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Gig not found");
    });
})

describe("Delete /gigs/:id ", ()=>{
    test("should delete a gig and return a message along with the updated gigs array ", async () => {
        const response = await request(app).delete("/gigs/1")
        expect(response.statusCode).toBe(200)

        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Successfully deleted gig");

        expect(response.body).toHaveProperty("gigs");
        expect(Array.isArray(response.body.gigs)).toBe(true);

        expect(response.body.gigs.length).toBe(2)

    })

    test("should return 404 if array length not altered", async () => {
        const response = await request(app).delete("/gigs/10");

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Gig not found");
    });
})

describe("POST /gigs", ()=> {
    test("Adds a new gig and returns the updated list of gigs", async ()=>{
        const newGig =  {
            id: 4,
            name: "Fleetfoxes",
            description: "Myconos Tour",
            date: "2026-03-24",
            location: "Birmingham NEC",
            image: "https://www.shutterstock.com/image-photo/barcelona-jul-1-fleet-foxes-folk-1143764111?trackingId=63f5f533-2a32-4683-93b2-dcebbfdccbdc&listId=searchResults"

    }
        const response = await request(app).post("/gigs").send({gig: newGig});
        console.log(response.body.gigs)

        expect(response.statusCode).toBe(201)
        expect(response.body.gigs.length).toBe(4);

    })

    test("Should return 400 status if gig object is empty contains no properties", async () =>{
        const response = await request(app).post("/gigs").send({gig:{}});
        
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Request must include a gig object with properties")
    })

    test("Should return 400 status no gig object is passed", async () =>{
        const response = await request(app).post("/gigs").send();
        
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Request must include a gig object with properties")
    })

    test("should return 400 if a required property field is missing", async () => {
        const invalidGig = {
        name: "Fleetfoxes",
        description: "Myconos Tour",
        date: "2026-03-24",
        location: "Birmingham NEC"
        // no image passed
        };

        const response = await request(app)
        .post("/gigs")
        .send({ gig: invalidGig });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Missing property value: image");
  });
})

  describe("DELETE /gigs", () => {
     test("should delete all gigs and return an empty gigs aray with a message", async() => {
        const response = await request(app).delete("/gigs");

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message")
        expect(response.body.message).toBe("Successfully deleted all the gigs")

        expect(response.body.gigs.length).toBe(0);
    })

    test("should still return success when gigs array is already empty", async () => {
        // First delete - to set base condition for test case
        await request(app).delete("/gigs");

        // Second delete - for required test scenario
        const response = await request(app).delete("/gigs");

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Successfully deleted all the gigs");
        expect(response.body.gigs.length).toBe(0);
    });

  })

  describe("PUT /gigs:id", () => {
    test("Updates the date property of the gig object with matching id", async () => {
        const response = await request(app).put("/gigs/1").send({date: "2026-12-31"});

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("gig")
        expect(response.body.gig.id).toBe(1)
        expect(response.body.gig.date).toBe("2026-12-31")

    })

    test("should return 400 if no date is provided", async () => {
        const response = await request(app)
            .put("/gigs/1")
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Request must include a date");
    });

    test("should return 404 if gig does not exist", async () => {
    const response = await request(app)
        .put("/gigs/666")
        .send({ date: "2026-12-31" });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Gig not found");

    });
  })

  describe("PATCH /gigs/:id", () => {
    test("Updates the a property of the gig object with matching id", async () => {
        const response = await request(app).patch("/gigs/1").send({name: "The Doors"});

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("gig")
        expect(response.body.gig.id).toBe(1)
        expect(response.body.gig.name).toBe("The Doors")

    })

    test("Updates multiple properties of the gig object with matching id", async () => {
        const response = await request(app).patch("/gigs/1")
        .send(
            {
                name: "The Doors",
                description: "Riders on The Storm Tour"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("gig")
        expect(response.body.gig.id).toBe(1)
        expect(response.body.gig.name).toBe("The Doors")
        expect(response.body.gig.description).toBe("Riders on The Storm Tour")

    })

    test("should return 400 if no properties are provided", async () => {
        const response = await request(app)
            .patch("/gigs/1")
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("No properties were provided to update");
    });

    test("should return 404 if gig does not exist", async () => {
    const response = await request(app)
        .patch("/gigs/666")
        .send({ date: "2026-12-31" });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Gig not found");

    });
   });
   
