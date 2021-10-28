describe('SearchSection', () => {

    it('Open Search', () => {
        cy.visit('/');
        cy.get('#btnHeaderSearch').click();
        cy.get('#popup').should('be.visible')
    });

    it.only('Search', () => {
        cy.visit('/');
        cy.get('#btnHeaderSearch').click();
        cy.get('.tooltiptext').should('not.be.visible')
        cy.get('.form-control')
        cy.wait(1000);
        cy .contains('Search').should('be.visible')
    });


    it('NoSearchCriteriaDefined', () => {
        cy.visit('/');
        cy.get('#btnHeaderSearch').click();
        cy.get('.search-results')
        cy.contains('No search criteria defined').should('be.visible')
    });

});