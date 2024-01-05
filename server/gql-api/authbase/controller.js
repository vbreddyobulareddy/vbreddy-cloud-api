const execQuery = require("./dao.js");

const getToken = async (payload) => {
  console.log("--=*-1-*=getToken ", payload);
  const [orgUnitPerson] = await execQuery.select.getOrgUnitPersonByUserName(
    payload
  );
  console.log("--=*-2-*=getToken ", orgUnitPerson);
  return {
    id: orgUnitPerson.id,
    orgUnit: {
      id: orgUnitPerson.orgUnitId,
      name: orgUnitPerson.orgUnitName,
      email: orgUnitPerson.orgUnitEmail,
      mobile: orgUnitPerson.orgUnitMobile,
      address: orgUnitPerson.orgUnitAddress,
      parentOrgUnitId: orgUnitPerson.orgUnitParentOrgUnitId,
    },
    person: {
      id: orgUnitPerson.personId,
      name: orgUnitPerson.personName,
      email: orgUnitPerson.personEmail,
      mobile: orgUnitPerson.personMobile,
      userName: orgUnitPerson.personUserName,
      address: orgUnitPerson.personAddress,
    },
    codeValue: {
      id: orgUnitPerson.codeValueId,
      name: orgUnitPerson.role,
      description: orgUnitPerson.description,
      codeId: orgUnitPerson.codeId,
    },
    isActive: orgUnitPerson.isActive ? true : false,
  };
};
const getOrgUnitTypes = async () => {
  const [record] = await execQuery.select.getCodeValueByCodeId({ codeId: 100 });
  return record;
};
const signUpTravelBookTaker = async (payload) => {
  return new Promise(async (resolve) => {
    console.log("--=*-1-*=signUpTravelBookTaker ", payload);
    const response = await Promise.all([
      execQuery.orgUnit.insert(payload),
      execQuery.person.insert(payload),
    ]);
    console.log("--=*-2-*=signUpTravelBookTaker ", response);
    const [orgUnit, person] = response;
    const orgUnitPersonEntity = await execQuery.orgUnitPerson.insert({
      orgUnitId: orgUnit.insertId,
      personId: person.insertId,
      codeValueId: payload.orgUnitTypeId,
    });
    console.log("--=*-3-*=signUpTravelBookTaker ", orgUnitPersonEntity);
    const [orgUnitPerson] = await execQuery.select.getOrgUnitPersonById({
      id: orgUnitPersonEntity.insertId,
    });
    console.log("--=*-4-*=getOrgUnitPersonId ", orgUnitPerson);
    resolve({
      id: orgUnitPerson.id,
      orgUnit: {
        id: orgUnitPerson.orgUnitId,
        name: orgUnitPerson.orgUnitName,
        email: orgUnitPerson.orgUnitEmail,
        mobile: orgUnitPerson.orgUnitMobile,
        address: orgUnitPerson.orgUnitAddress,
        parentOrgUnitId: orgUnitPerson.orgUnitParentOrgUnitId,
      },
      person: {
        id: orgUnitPerson.personId,
        name: orgUnitPerson.personName,
        email: orgUnitPerson.personEmail,
        mobile: orgUnitPerson.personMobile,
        userName: orgUnitPerson.personUserName,
        address: orgUnitPerson.personAddress,
      },
      codeValue: {
        id: orgUnitPerson.codeValueId,
        name: orgUnitPerson.role,
        description: orgUnitPerson.description,
        codeId: orgUnitPerson.codeId,
      },
      isActive: orgUnitPerson.isActive ? true : false,
    });
  });
};
module.exports = {
  getToken,
  getOrgUnitTypes,
  signUpTravelBookTaker,
};
