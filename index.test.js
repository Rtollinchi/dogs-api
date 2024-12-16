const request = require("supertest");
// express app
const app = require("./index");

// db setup
const { sequelize, Dog } = require("./db");
const seed = require("./db/seedFn");
const { dogs } = require("./db/seedData");

describe("Endpoints", () => {
  // to be used in POST test
  const testDogData = {
    breed: "Poodle",
    name: "Sasha",
    color: "black",
    description:
      "Sasha is a beautiful black pooodle mix.  She is a great companion for her family.",
  };

  beforeAll(async () => {
    // rebuild db before the test suite runs
    await seed();
  });

  beforeEach(async () => {
    // reset the db before each test
    await seed();
  });

  describe("POST /dogs", () => {
    it("should ceate a new dog and return the dog data", async () => {
      const response = await request(app).post("/dogs").send(testDogData);

      expect(response.body).toMatchObject(testDogData);

      const createdDog = await Dog.findByPk(response.body.id);
      expect(createdDog).toMatchObject(testDogData);
    });
  });

  describe("DELETE /dogs/:id", () => {
    it("should delete a dog with the given id", async () => {
      await request(app).delete("/dogs/1");

      const deletedDog = await Dog.findAll({ where: { id: 1 } });
      expect(deletedDog).toEqual([]);
    });
  });

  describe("GET /dogs", () => {
    it("should return list of dogs with correct data", async () => {
      // make a request
      const response = await request(app).get("/dogs");
      // assert a response code
      expect(response.status).toBe(200);
      // expect a response
      expect(response.body).toBeDefined();
      // toEqual checks deep equality in objects
      expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
    });
  });
});
