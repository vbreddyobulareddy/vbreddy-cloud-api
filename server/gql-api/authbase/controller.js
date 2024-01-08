const { buildOrgUnitPersonModal } = require("./_utils.js");
const jwt = require("jsonwebtoken");
const secretKey = process.env.APP_SECRET;
const daoService = require("./dao.js");

const getToken = async (payload) => {
  console.log("--=*-1-*=getToken ", payload);
  const [record] = await daoService.select.getOrgUnitPersonByUserName(payload);
  console.log("--=*-2-*=getToken ", record);
  if (record) {
    console.log("--=*-3-*=getToken ", record);
    const orgUnitPerson = buildOrgUnitPersonModal(record);
    console.log("--=*-4-*=getToken ", orgUnitPerson);
    const token = jwt.sign(
      { id: orgUnitPerson.id, mobile: orgUnitPerson.person.mobile },
      secretKey,
      { expiresIn: "1h" }
    );
    console.log("--=*-5-*=getToken ", token);
    return {
      id: orgUnitPerson.id,
      token,
    };
  }

  return {
    id: null,
    token: null,
    message: "Invalid UserName/Password",
  };
};
const getTokenDetails = async (payload) => {
  console.log("--==getTokenDetails ", payload.authToken);
  const { id, mobile, iat, exp } = jwt.verify(payload.authToken, secretKey);
  console.log("--==decoded ", id, mobile, iat, exp);
  // { id: 1, mobile: '+918105555322', iat: 1704637327, exp: 1704640927 }
  const [orgUnitPerson] = await daoService.select.getOrgUnitPersonById({ id });
  return {
    id,
    token: payload.authToken,
    mobile,
    iat,
    exp,
    orgUnitPerson: buildOrgUnitPersonModal(orgUnitPerson),
  };
};
const getOrgUnitTypes = async () => {
  const [record] = await daoService.select.getCodeValueByCodeId({
    codeId: 100,
  });
  return record;
};
const signUpTravelBookTaker = async (payload) => {
  return new Promise(async (resolve) => {
    console.log("--=*-1-*=signUpTravelBookTaker ", payload);
    const response = await Promise.all([
      daoService.orgUnit.insert(payload),
      daoService.person.insert(payload),
    ]);
    console.log("--=*-2-*=signUpTravelBookTaker ", response);
    const [orgUnit, person] = response;
    const orgUnitPersonEntity = await daoService.orgUnitPerson.insert({
      orgUnitId: orgUnit.insertId,
      personId: person.insertId,
      codeValueId: payload.orgUnitTypeId,
    });
    console.log("--=*-3-*=signUpTravelBookTaker ", orgUnitPersonEntity);
    const [orgUnitPerson] = await daoService.select.getOrgUnitPersonById({
      id: orgUnitPersonEntity.insertId,
    });
    console.log("--=*-4-*=getOrgUnitPersonId ", orgUnitPerson);
    resolve(buildOrgUnitPersonModal(orgUnitPerson));
  });
};
module.exports = {
  getToken,
  getTokenDetails,
  getOrgUnitTypes,
  signUpTravelBookTaker,
};
