describe('SummaryAlertsTest', () => {


    it.only('TopNamespacesWithIssues', () => {
        cy.visit('/');
        cy.contains('Summary').click();

        cy.get('.summary-container')
          .children('label')
          .contains("Top Namespaces with Issues")
          .parents('.summary-container')
          .find('.dn-shortcut')
          .contains('16')

          // addr -> 16 error, 0 warning

          // cy.get('.summary-container-inner')
          // .find('div')
          // .contains('11')

    });
});