const request = require("supertest")
const app = require("./app")

beforeEach(() => {
  jest.resetModules();
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