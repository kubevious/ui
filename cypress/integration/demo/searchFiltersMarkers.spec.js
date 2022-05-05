describe('SearchFilters', () => {


    it('filter list, Markers', () => {
        cy.visit('https://demo.kubevious.io/');
        cy.wait(1000);
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Marker")
          .parents("details")
          .find("button")
          .contains("Bar").click()
    });


});