describe('SearchSection', () => {

    it('Search', () => {
        cy.visit('/');
        cy.get('#btnHeaderSearch').click();
        cy.get('.form-control')
        cy.contains('Search')
    });


    it('NoSearchCriteriaDefined', () => {
        cy.visit('/');
        cy.get('#btnHeaderSearch').click();
        cy.get('.search-results')
        cy.contains('No search criteria defined')
    });


    it("search for 'gitlab'", () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get('.form-control').type("openfaas{enter}");

        cy.get('.search-results')
          .find('.dn-shortcut')
          .filter(':contains("gateway")')
          .its('length')
          .should('be.gte', 10)

    });

    it.only('filter list', () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Kind")
          .parents("details")
          .find("button")
          .contains("Container").click()


    });

});