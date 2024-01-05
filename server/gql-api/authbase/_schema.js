module.exports = {
  AuthBaseSchema: async (pool) => {
    console.log("---> Call  Ensure AuthBaseSchema <---");
    const authBaseTables = [];
    [
      ` CREATE TABLE IF NOT EXISTS Code (
          id int,
          name varchar(255) NOT NULL,
          description varchar(255),
          dateOfCreation datetime,
          dateLastModified datetime,
          lastUpdatedBy int,
          PRIMARY KEY (id)
        );`,
      ` CREATE TABLE IF NOT EXISTS CodeValue (
          id int,
          name varchar(255) NOT NULL,
          description varchar(255),
          codeId int,
          dateOfCreation datetime,
          dateLastModified datetime,
          lastUpdatedBy int,
          PRIMARY KEY (id),
          FOREIGN KEY (codeId) REFERENCES Code(id)
        );`,
      ` CREATE TABLE IF NOT EXISTS OrgUnit (
          id int NOT NULL AUTO_INCREMENT,
          name varchar(255) NOT NULL,
          email varchar(255),
          mobile varchar(255),
          address varchar(255),
          codeValueId int,
          parentOrgUnitId int,
          dateOfCreation datetime,
          dateLastModified datetime,
          lastUpdatedBy int,
          PRIMARY KEY (id),
          FOREIGN KEY (codeValueId) REFERENCES CodeValue(id)
        );`,
      ` CREATE TABLE IF NOT EXISTS Person (
          id int NOT NULL AUTO_INCREMENT,
          name varchar(255) NOT NULL,
          email varchar(255),
          userName varchar(255),
          password varchar(255),
          mobile varchar(255),
          address varchar(255),
          dateOfCreation datetime,
          dateLastModified datetime,
          lastUpdatedBy int,
          PRIMARY KEY (id)
        );`,
      ` CREATE TABLE IF NOT EXISTS OrgUnitPerson (
          id int NOT NULL AUTO_INCREMENT,
          orgUnitId int,
          personId int,
          codeValueId int,
          isActive bool,
          dateOfCreation datetime,
          dateLastModified datetime,
          lastUpdatedBy int,
          PRIMARY KEY (id),
          FOREIGN KEY (orgUnitId) REFERENCES OrgUnit(id),
          FOREIGN KEY (personId) REFERENCES Person(id),
          FOREIGN KEY (codeValueId) REFERENCES CodeValue(id)
        );`,
    ].forEach((tblDDL) => {
      console.log("-=-*-=-AuthBase ", tblDDL);
      authBaseTables.push(pool.query(tblDDL));
    });
    /*
    [
      `delete table CodeValue`,
      `delete table Code`,
      `insert into Code values (100, 'Books', 'TheBookTaker Apps', NOW(), NOW(), 1)`,
      `insert into Code values (1000, 'Roles', 'Travels-Book-Taker Roles', NOW(), NOW(), 1)`,
      `insert into CodeValue values (101, 'Travels-Book-Taker', 'The travels Business Book Taker', 100, NOW(), NOW(), 1)`,
      `insert into CodeValue values (1001, 'Super Admin', 'Super Admin ME', 1000, NOW(), NOW(), 1)`,
      `insert into CodeValue values (1002, 'Admin', 'Admin', 1000, NOW(), NOW(), 1)`,
      `insert into CodeValue values (1003, 'Agent', 'Agent', 1000, NOW(), NOW(), 1)`,
      `insert into CodeValue values (1004, 'Driver', 'Driver', 1000, NOW(), NOW(), 1)`,
      `insert into CodeValue values (1005, 'Conductor', 'Conductor', 1000, NOW(), NOW(), 1)`,
    ].forEach((tblDML) => {
      console.log("-=-*-=-AuthBase ", tblDML);
      authBaseTables.push(pool.query(tblDML));
    });
    */
    return await Promise.all(authBaseTables);
  },
};

/***
 * 
 * 
  drop table Code;
  drop table CodeValue;
  drop table OrgUnit;
  drop table Person;
  drop table OrgUnitPerson;
  *
  *
 */
