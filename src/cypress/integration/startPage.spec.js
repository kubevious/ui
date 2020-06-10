describe('Open application', () => {
    it('Open diagram', () => {
        cy.visit('/')

        cy.get('#diagram').should('be.visible')
        cy.get('#ruleEditorComponent').should('not.be.visible')
        cy.get('#markerEditorComponent').should('not.be.visible')
        cy.get('#propertiesComponent').should('be.empty')

        cy.contains('Rule Editor').click()
        cy.get('#diagram').should('not.be.visible')
        cy.get('#ruleEditorComponent').should('be.visible')

        cy.contains('Marker Editor').click()
        cy.get('#diagram').should('not.be.visible')
        cy.get('#markerEditorComponent').should('be.visible')
    })
})