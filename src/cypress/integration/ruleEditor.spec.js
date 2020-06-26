describe('Test rule editor', () => {
    it('open rule editor', () => {
        cy.visit('/')

        cy.contains('Rule Editor').click()
        cy.get('#diagram').should('not.be.visible')
        cy.get('#ruleEditorComponent').should('be.visible')
    })

    it('create new rule', () => {
        cy.get('.new-rule-btn').first().click()

        cy.get('.field-input.name').type('New super rule')

        cy.get('.react-codemirror2').first().type('Rule target')

        cy.contains('Rule script').click()

        cy.get('.react-codemirror2').last().type('Rule script')

        cy.get('button').contains('Create').click()

        cy.wait(1000)

        cy.get('.rule-item-button.selected').should(($r) => {
            expect($r.last()).to.contain('New super rule')
        })
    })

    it('update rule', () => {
        cy.get('.rule-item-button').first().click()
        cy.wait(1000)

        cy.get('.field-input.name').clear().type('Edited super rule')

        cy.get('button').contains('Save').click()

        cy.wait(1000)

        cy.get('#ruleEditorComponent .rule-item-button').first().should(($r) => {
            expect($r).to.contain('Edited super rule')
        })
    })

    it('delete rule', () => {
        cy.get('.rule-item-button').first().click()

        cy.get('button').contains('Delete').click()

        cy.wait(1000)

        cy.get('.rule-item-button').first().should(($r) => {
            expect($r.last()).not.to.contain('Edited super rule')
        })
    })
});
