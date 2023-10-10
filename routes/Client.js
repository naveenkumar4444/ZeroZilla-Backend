const router = require("express").Router();
const ClientModel = require("../models/ClientModel");
const AgencyModel = require("../models/AgencyModel");
const Joi = require("joi");
const HttpException = require("../middlewares/HttpException");
const { UpdateClient } = require("../controllers/ClientController");

router.post("/add", async (request, response, next) => {
  try {
    const schema = Joi.object().keys({
      Name: Joi.string().required(),
      Email: Joi.string().email().required(),
      PhoneNumber: Joi.string().required(),
      TotalBill: Joi.string().required(),
    });

    const result = schema.validate(request.body);

    if (result.error) {
      throw new HttpException(false, 400, result.error.details[0].message);
    } else {
      const body = request.body;

      const client = await ClientModel.create(body);

      const { Name, ...newUser } = client["_doc"];

      response.status(201).send({
        status: true,
        message: "Registration successful",
        data: newUser,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/update", async (request, response, next) => {
  try {
    const body = request.body;
    const updatedData = await UpdateClient(body);
    response.status(200).send({
      status: true,
      message: "Updated successful",
      data: updatedData,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/top-clients", async (request, response, next) => {
  try {
    const topClientsByAgency = await AgencyModel.aggregate([
      {
        $lookup: {
          from: "clients",
          localField: "_id",
          foreignField: "AgencyId",
          as: "clients",
        },
      },
      {
        $unwind: "$clients",
      },
      {
        $group: {
          _id: "$_id",
          AgencyName: { $first: "$Name" },
          maxTotalBill: { $max: "$clients.TotalBill" },
          topClients: {
            $push: {
              Name: "$clients.Name",
              TotalBill: "$clients.TotalBill",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          AgencyName: 1,
          topClients: {
            $filter: {
              input: "$topClients",
              as: "client",
              cond: {
                $eq: ["$$client.TotalBill", "$maxTotalBill"],
              },
            },
          },
        },
      },
      {
        $unwind: "$topClients",
      },
    ]);

    response.status(200).send({
      status: true,
      message: "Data fetched.",
      data: topClientsByAgency,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
