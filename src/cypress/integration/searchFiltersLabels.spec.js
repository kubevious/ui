describe('SearchFilters', () => {
    it('filter list, Labels', () => {
        cy.visit('https://demo.kubevious.io/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Labels")
          .parents("details")

        cy.get('.filter-input-box')
          .contains("Label").click()
          .parent("details")



    });


});