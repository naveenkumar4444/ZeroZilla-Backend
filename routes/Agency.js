const router = require("express").Router();
const AgencyModel = require("../models/AgencyModel");
const Joi = require("joi");
const HttpException = require("../middlewares/HttpException");
const ClientModel = require("../models/ClientModel");
const { AddClient } = require("../controllers/ClientController");
const { AddAgency } = require("../controllers/AgencyController");

router.post("/add", async (request, response, next) => {
  try {
    const body = request.body;
    if (body.AgencyId) {
      const client = await AddClient(body.clientsData, body.AgencyId);
      response.status(201).send({
        status: true,
        message: "Client added successfully.",
        client: client,
      });
    } else {
      const checkAgency = await AgencyModel.findOne({
        PhoneNumber: body.phoneNumber,
      });
      
      if (checkAgency) {
         return response.status(400).send({
            status: false,
            message: "Agency phoneNumber already existed.",
          });
      }
      const agency = await AddAgency(body);
      const client = await AddClient(body.clientsData, agency._id);

      response.status(201).send({
        status: true,
        message: "Agency and Clients added successfully.",
        agency: agency,
        clients: client,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
