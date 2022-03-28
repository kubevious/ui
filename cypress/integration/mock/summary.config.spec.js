describe('SummaryConfigTest', () => {

    it('ConfigurationSummaryBoxes', () => {

        cy.visit('/');
        cy.contains('Summary').click();

        cy.get('.counter-block')
          .eq(0)
          .parent('.counters-container')
          .contains('Namespaces')
          .get('.counter-value')
          .eq(0)
          .contains('30')

        cy.get('.counter-block')
          .filter(':contains("Applications")')
          .find('.counter-value')
          .contains('54')

        cy.get('.counter-block')
          .filter(':contains("Pods")')
          .find('.counter-value')
          .contains('3')


    })

    it('InfrastructureSummaryBoxes', () => {
        cy.visit('/');
        cy.contains('Summary').click();

        cy.get('.counter-block')
          .filter(':contains("Nodes")')
          .find('.counter-value')
          .contains('3')

        cy.get('.counter-block')
          .filter(':contains("Volumes")')
          .find('.counter-value')
          .contains('52')

        cy.get('.counter-block')
          .filter(':contains("CPU")')
          .find('.counter-value')
          .contains('3123.86')
          .contains('cores')

        
        cy.get('.counter-block')
          .filter(':contains("RAM")')
          .find('.counter-value')
          .contains('11')
          .contains('GB')

    })

});