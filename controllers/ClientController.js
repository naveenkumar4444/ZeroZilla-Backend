const Joi = require("joi");
const HttpException = require("../middlewares/HttpException");
const ClientModel = require("../models/ClientModel");

async function AddClient(clientsData, agencyId) {
  try {
    const createdClients = [];

    for (const body of clientsData) {
      const checkClient = await ClientModel.findOne({
        Email: body.clientEmailId,
        PhoneNumber: body.clientPhoneNo,
      });

      if (!checkClient) {
        const clientData = {
          Name: body.clientName,
          Email: body.clientEmailId,
          PhoneNumber: body.clientPhoneNo,
          TotalBill: body.totalBill,
        };

        const clientSchema = Joi.object().keys({
          Name: Joi.string().required(),
          Email: Joi.string().email().required(),
          PhoneNumber: Joi.string().required(),
          TotalBill: Joi.number().required(),
        });

        const { error: clientError, value: validatedClientData } =
          clientSchema.validate(clientData);

        if (clientError) {
          throw new HttpException(false, 400, clientError.details[0].message);
        }

        const client = await ClientModel.create({
          ...validatedClientData,
          AgencyId: body.AgencyId ? body.AgencyId : agencyId,
        });
        createdClients.push(client);
        // return client;
      }
    }
    return createdClients;
  } catch (error) {
    throw new HttpException(false, 400, error.message);
  }
}

async function UpdateClient(body) {

  try {
    const updatedData = await ClientModel.findByIdAndUpdate(
      body.id,
      { $set: body },
      { new: true }
    );
    return updatedData;
  } catch (error) {
    throw new HttpException(false, 400, error.message);
  }
}

module.exports = { AddClient, UpdateClient };
