const { getConnection } = require("../../cloud-sql-serve/index.js");
module.exports = {
  orgUnit: {
    insert: async (payload) => {
      const connection = await getConnection();
      return await connection.query(
        `INSERT INTO OrgUnit (
                      name,
                      email,
                      mobile,
                      address,
                      codeValueId,
                      dateOfCreation,
                      dateLastModified,
                      lastUpdatedBy
                  ) VALUES (
                      '${payload.orgUnitName}',
                      '${payload.orgUnitEmail}',
                      '${payload.orgUnitMobile}',
                      '${payload.orgUnitAddress}',
                      ${payload.orgUnitTypeId},
                      NOW(),
                      NOW(),
                      1
                  )`
      );
    },
  },
  person: {
    insert: async (payload) => {
      const connection = await getConnection();
      return await connection.query(
        `INSERT INTO Person (
                          name,
                          email,
                          userName,
                          password,
                          mobile,
                          address,
                          dateOfCreation,
                          dateLastModified,
                          lastUpdatedBy
                      ) VALUES (
                          '${payload.primPersonName}',
                          '${payload.primPersonEmail}',
                          '${payload.primPersonUserName}',
                          '${payload.primPersonPassword}',
                          '${payload.primPersonMobile}',
                          '${payload.primPersonAddress}',
                          NOW(),
                          NOW(),
                          1
                      )`
      );
    },
  },
  orgUnitPerson: {
    insert: async (payload) => {
      const connection = await getConnection();
      return await connection.query(
        `INSERT INTO OrgUnitPerson (
                              orgUnitId,
                              personId,
                              codeValueId,
                              isActive,
                              dateOfCreation,
                              dateLastModified,
                              lastUpdatedBy
                          ) VALUES (
                              '${payload.orgUnitId}',
                              '${payload.personId}',
                              '${payload.codeValueId}',
                              false,
                              NOW(),
                              NOW(),
                              1
                          )`
      );
    },
  },
  select: {
    getOrgUnitPersonByUserName: async (payload) => {
      const connection = await getConnection();
      return await connection.query(
        `select oup.*
            , ou.name as orgUnitName
            , ou.email as orgUnitEmail
            , ou.mobile as orgUnitMobile
            , ou.address as orgUnitAddress
            , ou.parentOrgUnitId as orgUnitParentOrgUnitId
            , p.id as personId
            , p.name as personName
            , p.email as personEmail
            , p.mobile as personMobile
            , p.userName as personUserName
            , p.address as personAddress
            , cv.id as codeValueId
            , cv.name as role
            , cv.description
            , cv.codeId
            from OrgUnitPerson oup
                ,OrgUnit ou
                ,Person p
                ,CodeValue cv
            where ou.id = oup.orgUnitId
            and p.id = oup.personId
            and cv.id = oup.codeValueId
            and p.userName='${payload.userName}'
            and p.password='${payload.password}'
                `
      );
    },
    getOrgUnitPersonById: async (payload) => {
      const connection = await getConnection();
      return await connection.query(
        `select oup.*
            , ou.name as orgUnitName
            , ou.email as orgUnitEmail
            , ou.mobile as orgUnitMobile
            , ou.address as orgUnitAddress
            , ou.parentOrgUnitId as orgUnitParentOrgUnitId
            , p.id as personId
            , p.name as personName
            , p.email as personEmail
            , p.mobile as personMobile
            , p.userName as personUserName
            , p.address as personAddress
            , cv.id as codeValueId
            , cv.name as role
            , cv.description
            , cv.codeId
            from OrgUnitPerson oup
                ,OrgUnit ou
                ,Person p
                ,CodeValue cv
            where ou.id = oup.orgUnitId
            and p.id = oup.personId
            and cv.id = oup.codeValueId
            and oup.id=${payload.id}
                `
      );
    },
    getCodeValueByCodeId: async (payload) => {
      const connection = await getConnection();
      return await connection.query(
        `select * from CodeValue where codeId = ${payload.codeId}`
      );
    },
    getRowsByTableAndColName: async (payload) => {
      const connection = await getConnection();
      const query = `select * from ${payload.tblName} where ${payload.colName} = '${payload.val}'`;
      console.log('--=*-*-=> getRowsByTableAndColName ', query)
      return await connection.query(query);
    }
    //----
  },
};
