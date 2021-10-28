describe('SearchWithMultipleFilters', () => {

    
    it("search for 'openfaas' with 'gateway'", () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get('.form-control').type("openfaas{enter}");

        cy.get('.search-results')
          .find('.dn-shortcut')
          .filter(':contains("gateway")')
          .its('length')
          .should('be.gte', 10)

    });



    it.only('filter list, KindContainer, search for openfaas', () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Kind")
          .parents("details")
          .find("button")
          .contains("Container").click()

        cy.get('.form-control').type("openfaas{enter}");

        cy.get('.search-results')
          .find('.dn-shortcut')
          .filter(':contains("gateway")')
          .its('length')
          .should('be.gte', 1)


    });


    it('filter list, KindApplication, WithErrors, search for openfaas', () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Kind")
          .parents("details")
          .find("button")
          .contains("Application").click()

        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Errors")
          .parents("details")
          .find("button")
          .contains("With errors").click()

        cy.get('.form-control').type("openfaas{enter}");
        cy.get('.search-results')
          .find('.dn-shortcut')
          .filter(':contains("faas-idler")')
          .its('length')
          .should('be.gte', 1)
    });


    it('filter list, KindApplication, WithWarnings, search for openfaas', () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Kind")
          .parents("details")
          .find("button")
          .contains("Application").click()

        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Warnings")
          .parents("details")
          .find("button")
          .contains("With warnings").click()

        cy.get('.form-control').type("openfaas{enter}");
        cy.get('.search-results')
            .find('.dn-shortcut')
            .filter(':contains("faas-idler")')
            .its('length')
            .should('be.eq', 1)
    });



    it('filter list, KindApplication, WithoutWarnings, search for openfaas', () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Kind")
          .parents("details")
          .find("button")
          .contains("Application").click()

        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Warnings")
          .parents("details")
          .find("button")
          .contains("Without warnings").click()

        cy.get('.form-control').type("openfaas{enter}");
        cy.get('.search-results')
            .find('.dn-shortcut')
            .filter(':contains("gateway")')
            .its('length')
            .should('be.gte', 1)
    });


    it('filter list, KindApplication, WithoutWarnings, WithoutErrors, search for openfaas', () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Kind")
          .parents("details")
          .find("button")
          .contains("Application").click()

        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Warnings")
          .parents("details")
          .find("button")
          .contains("Without warnings").click()

        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Errors")
          .parents("details")
          .find("button")
          .contains("Without errors").click()

        cy.get('.form-control').type("openfaas{enter}");
        cy.get('.search-results')
            .find('.dn-shortcut')
            .filter(':contains("gateway")')
            .its('length')
            .should('be.gte', 1)
    });

    it('filter list, KindApplication, WithWarnings, WithErrors, search for openfaas', () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Kind")
          .parents("details")
          .find("button")
          .contains("Application").click()

        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Warnings")
          .parents("details")
          .find("button")
          .contains("With warnings").click()

        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Errors")
          .parents("details")
          .find("button")
          .contains("With errors").click()

        cy.get('.form-control').type("openfaas{enter}");
        cy.get('.search-results')
            .find('.dn-shortcut')
            .filter(':contains("faas-idler")')
            .its('length')
            .should('be.gte', 0)
    });


    it('filter list, KindApplication, WithoutWarnings, WithErrors, search for openfaas', () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Kind")
          .parents("details")
          .find("button")
          .contains("Application").click()

        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Warnings")
          .parents("details")
          .find("button")
          .contains("Without warnings").click()

        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Errors")
          .parents("details")
          .find("button")
          .contains("With errors").click()

        cy.get('.form-control').type("openfaas{enter}");
        cy.get('.search-results')
        cy.contains('No items matching search criteria').should('be.visible')
    });    




    

});