
const KIND_LIST = [
  "Container",
  "Cluster Role",
  "Role Binding"
]

describe('SearchFilters', () => {

    for(let kindName of KIND_LIST)
    {

      it(`filter list, Kind ${kindName}`, () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Kind")
          .parents("details")
          .find("button")
          .contains("Container").click()

      });

    }




});