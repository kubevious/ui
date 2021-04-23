describe('Test marker editor', () => {
    it('open marker editor', () => {
        cy.visit('/');

        cy.contains('Marker Editor').click();
        cy.get('#diagram').should('not.be.visible');
        cy.get('#markerEditorComponent').should('be.visible');
    });

    it('create new marker', () => {
        cy.wait(1000);

        cy.get('#markerEditorComponent').contains('New marker').first().click();

        cy.get('#markerEditorComponent #fieldInput').type('!New super marker');

        cy.get('#markerCreateButton').contains('Create').click();

        cy.wait(1000);

        cy.get('#markerEditorComponent #ruleItemButton').should(($r) => {
            expect($r.last()).to.contain('!New super marker');
        });
    });

    it('update marker', () => {
        cy.get('#markerEditorComponent #ruleItemButton').last().click();
        cy.wait(2000);

        cy.get('#markerEditorComponent #fieldInput')
            .clear()
            .type('!Edited super marker');

        cy.get('button').contains('Save').click();

        cy.wait(1000);

        cy.get('#markerEditorComponent #ruleItemButton').should(($r) => {
            expect($r.last()).to.contain('!Edited super marker');
        });
    });

    it('delete marker', () => {
        cy.get('#markerEditorComponent #ruleItemButton').last().click();

        cy.get('button').contains('Delete').click();

        cy.wait(1000);

        cy.get('#markerEditorComponent #ruleItemButton').should(($r) => {
            expect($r.last()).to.not.contain('!Edited super marker');
        });
    });

    it('export markers', () => {
        cy.get('#markerEditorComponent [data-testid="burger-menu"]').trigger(
            'mouseover'
        );

        cy.contains('Export markers').click();

        cy.get('#exportAnchor').should('have.attr', 'download', 'markers.json');
    });

    // TODO find a way to handle this
    // it('import markers', () => {
    //     cy.fixture('markers.json').then((fileContent) => {
    //         cy.get(
    //             '#markerEditorComponent [data-testid="burger-menu"]'
    //         ).trigger('mouseover');
    //
    //         cy.contains('Import markers').click();
    //
    //         const initLength = Cypress.$(
    //             '#markerEditorComponent #ruleItemButton'
    //         ).length;
    //         const contentLength = fileContent.items.length;
    //
    //         cy.get('#upload-marker-import').attachFile({
    //             fileContent: fileContent,
    //             fileName: 'markers.json',
    //         });
    //
    //         cy.wait(2000);
    //
    //         cy.get('#markerEditorComponent #ruleItemButton').should(
    //             'have.length',
    //             initLength + contentLength
    //         );
    //     });
    // });
    //
    // it('replace markers', () => {
    //     cy.fixture('markers.json').then(fileContent => {
    //         cy.get('#markerEditorComponent .BurgerMenu-container').trigger('mouseover')
    //
    //         cy.contains('Replace markers').click()
    //
    //         const contentLength = fileContent.items.length
    //
    //         cy.get('#upload-marker').attachFile({
    //             fileContent: fileContent,
    //             fileName: 'markers.json',
    //         })
    //
    //         cy.wait(2000)
    //
    //         cy.get('#markerEditorComponent .rule-item-button').should('have.length', contentLength)
    //     })
    // })
});
