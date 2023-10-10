const Joi = require("joi");
const HttpException = require("../middlewares/HttpException");
const AgencyModel = require("../models/AgencyModel");

async function AddAgency(body) {
  try {
    const agencyData = {
      Name: body.agencyName,
      Address1: body.addressLine1,
      Address2: body.addressLine2,
      AgencyId: body.AgencyId,
      State: body.state,
      City: body.city,
      PhoneNumber: body.phoneNumber,
    };

    const agencySchema = Joi.object({
      Name: Joi.string().trim().required(),
      Address1: Joi.string().trim().required(),
      Address2: Joi.string().trim(),
      AgencyId: Joi.string().trim(),
      State: Joi.string().trim().required(),
      City: Joi.string().trim().required(),
      PhoneNumber: Joi.string().required(),
    });

    const { error: agencyError, value: validatedAgencyData } =
      agencySchema.validate(agencyData);

    if (agencyError) {
      throw new HttpException(false, 400, agencyError.details[0].message);
    }

    const agency = await AgencyModel.create(validatedAgencyData);
    return agency;
  } catch (error) {
    throw new HttpException(false, 400, error.message);
  }
}

module.exports = { AddAgency };
