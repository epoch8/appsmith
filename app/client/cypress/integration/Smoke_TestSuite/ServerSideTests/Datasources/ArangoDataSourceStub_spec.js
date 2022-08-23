const datasource = require("../../../../locators/DatasourcesEditor.json");
const datasourceEditor = require("../../../../locators/DatasourcesEditor.json");

import { ObjectsRegistry } from "../../../../support/Objects/Registry";

let agHelper = ObjectsRegistry.AggregateHelper,
  dataSources = ObjectsRegistry.DataSources;

let datasourceName;

describe("Arango datasource test cases", function() {
  beforeEach(() => {
    cy.startRoutesForDatasource();
  });

  it("1. Create, test, save then delete a Arango datasource", function() {
    cy.NavigateToDatasourceEditor();
    cy.get(datasource.ArangoDB).click();
    cy.getPluginFormsAndCreateDatasource();
    cy.fillArangoDBDatasourceForm();
    cy.generateUUID().then((UUID) => {
      datasourceName = `Arango MOCKDS ${UUID}`;
      cy.renameDatasource(datasourceName);
    });

    cy.get("@createDatasource").then((httpResponse) => {
      datasourceName = httpResponse.response.body.data.name;
    });
    cy.intercept("POST", "/api/v1/datasources/test", {
      fixture: "testAction.json",
    }).as("testDatasource");
    cy.testSaveDatasource(false);
  });

  it("2. Create with trailing white spaces in host address and database name, test, save then delete a Arango datasource", function() {
    cy.NavigateToDatasourceEditor();
    cy.get(datasource.ArangoDB).click();
    cy.getPluginFormsAndCreateDatasource();
    cy.fillArangoDBDatasourceForm(true);
    cy.get("@createDatasource").then((httpResponse) => {
      datasourceName = httpResponse.response.body.data.name;
    });
    cy.intercept("POST", "/api/v1/datasources/test", {
      fixture: "testAction.json",
    }).as("testDatasource");
    cy.testSaveDatasource(false);
  });

  it("3. Create a new query from the datasource editor", function() {
    // cy.get(datasource.createQuery).click();
    cy.get(`${datasourceEditor.datasourceCard} ${datasource.createQuery}`)
      .last()
      .click();
    cy.wait("@createNewApi").should(
      "have.nested.property",
      "response.body.responseMeta.status",
      201,
    );
    cy.deleteQueryUsingContext();
    cy.deleteDatasource(datasourceName);
  });

  it("4. Arango Default name change", () => {
    dataSources.NavigateToDSCreateNew();
    dataSources.CreatePlugIn("ArangoDB", false);
    agHelper.RenameWithInPane("ArangoDefaultDBName", false);
    agHelper
      .GetText(dataSources._databaseName, "val")
      .then(($dbName) => expect($dbName).to.eq("default"));
    dataSources.DeleteDatasouceFromWinthinDS("ArangoDefaultDBName");
  });
});
