describe('Test marker editor', () => {
    it('open marker editor', () => {
        cy.visit('/')

        cy.contains('Marker Editor').click()
        cy.get('#diagram').should('not.be.visible')
        cy.get('#markerEditorComponent').should('be.visible')
    })

    it('create new marker', () => {
        cy.wait(1000)

        cy.get('#markerEditorComponent .new-rule-btn').first().click()

        cy.get('.field-input.name.marker').type('!New super marker')

        cy.get('.button.success.marker').contains('Create').click()

        cy.wait(1000)

        cy.get('.rule-item-button.selected').should(($r) => {
            expect($r.first()).to.contain('!New super marker')
        })
    })

    it('update marker', () => {
        cy.get('#markerEditorComponent .markers .rule-item-button').first().click()
        cy.wait(2000)

        cy.get('.field-input.name.marker').clear().type('!Edited super marker')

        cy.get('.button.success.marker').contains('Save').click()
        cy.wait(1000)

        cy.get('#markerEditorComponent .markers').should(($r) => {
            expect($r).to.contain('!Edited super marker')
        })
    })

    it('delete marker', () => {
        cy.get('#markerEditorComponent .markers .rule-item-button').first().click()
        const initLength = Cypress.$('#markerEditorComponent .markers .rule-item-button').length

        cy.get('button').contains('Delete').click()

        cy.wait(1000)
        cy.get('#markerEditorComponent .rule-item-button').should('have.length', initLength - 1)
    })

    it('export markers', () => {
        cy.get('#markerEditorComponent .BurgerMenu-container').trigger('mouseover')
        cy.get('#markerEditorComponent .BurgerMenu-container .menu').should('be.visible')

        cy.contains('Export markers').click()

        cy.get('#exportAnchor').should('have.attr', 'download', 'markers.json')
    })

    it('import markers', () => {
        cy.fixture('markers.json').then(fileContent => {
            cy.get('#markerEditorComponent .BurgerMenu-container').trigger('mouseover')

            cy.contains('Import markers').click()

            const initLength = Cypress.$('#markerEditorComponent .markers .rule-item-button').length
            const contentLength = fileContent.items.length

            cy.get('#upload-marker').attachFile({
                fileContent: fileContent,
                fileName: 'markers.json',
            })

            cy.wait(2000)

            cy.get('#markerEditorComponent .rule-item-button').should('have.length', initLength + contentLength)
        })
    })

    it('replace markers', () => {
        cy.fixture('markers.json').then(fileContent => {
            cy.get('#markerEditorComponent .BurgerMenu-container').trigger('mouseover')

            cy.contains('Replace markers').click()

            const contentLength = fileContent.items.length

            cy.get('#upload-marker').attachFile({
                fileContent: fileContent,
                fileName: 'markers.json',
            })

            cy.wait(2000)

            cy.get('#markerEditorComponent .rule-item-button').should('have.length', contentLength)
        })
    })
});
