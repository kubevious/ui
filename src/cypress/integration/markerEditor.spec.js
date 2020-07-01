describe('Test marker editor', () => {
    it('open marker editor', () => {
        cy.visit('/')

        cy.contains('Marker Editor').click()
        cy.get('#diagram').should('not.be.visible')
        cy.get('#markerEditorComponent').should('be.visible')
    })

    it('create new marker', () => {
        cy.get('#markerEditorComponent .new-rule-btn').first().click()

        cy.get('.field-input.name').type('New super marker')

        cy.get('button').contains('Create').click()

        cy.wait(1000)

        cy.get('.rule-item-button.selected').should(($r) => {
            expect($r.last()).to.contain('New super marker')
        })
    })

    it('update marker', () => {
        cy.get('#markerEditorComponent .markers .rule-item-button').first().click()
        cy.wait(1000)

        cy.get('.field-input.name').clear().type('Edited super marker')

        cy.get('button').contains('Save').click()
        cy.wait(1000)

        cy.get('#markerEditorComponent .rule-item-button').last().should(($r) => {
            expect($r).to.contain('Edited super marker')
        })
    })

    it('delete marker', () => {
        cy.get('#markerEditorComponent .rule-item-button').first().click()

        cy.get('button').contains('Delete').click()

        cy.wait(1000)

        cy.get('#markerEditorComponent .rule-item-button').first().should(($r) => {
            expect($r.last()).not.to.contain('Edited super marker')
        })
    })
});
