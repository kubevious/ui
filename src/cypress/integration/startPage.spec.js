describe('Open application', () => {
    it('Open diagram', () => {
        cy.visit('/')

        cy.get('#summary').should('be.visible')
        cy.get('#diagram').should('not.be.visible')
        cy.get('#ruleEditorComponent').should('not.be.visible')
        cy.get('#markerEditorComponent').should('not.be.visible')

        cy.get('#propertiesComponent').should(($el) => {
            expect($el).to.contain.text('No object selected.')
        })

        cy.get('#alertsComponent').should(($el) => {
            expect($el).to.contain.text('No object selected.')
        })

        cy.contains('Rule Editor').click()
        cy.get('#diagram').should('not.be.visible')
        cy.get('#ruleEditorComponent').should('be.visible')

        cy.contains('Marker Editor').click()
        cy.get('#diagram').should('not.be.visible')
        cy.get('#markerEditorComponent').should('be.visible')
    })
})
