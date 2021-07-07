describe('SearchSection', () => {

    it('Open Search', () => {
        cy.visit('/');
        cy.get('#btnHeaderSearch').click();
        cy.get('#popup').should('be.visible')
    });

    it('Search', () => {
        cy.visit('/');
        cy.get('#btnHeaderSearch').click();
        cy.get('.tooltiptext').should('not.be.visible')
        cy.get('.form-control')
        cy.contains('Search').should('be.visible')
    });


    it('NoSearchCriteriaDefined', () => {
        cy.visit('/');
        cy.get('#btnHeaderSearch').click();
        cy.get('.search-results')
        cy.contains('No search criteria defined').should('be.visible')
    });

});