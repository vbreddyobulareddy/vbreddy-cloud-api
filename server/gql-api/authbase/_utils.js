module.exports = {
  buildOrgUnitPersonModal: (orgUnitPerson) => {
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
  },
};
