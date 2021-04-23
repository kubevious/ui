describe('Test rule editor', () => {
    it('open rule editor', () => {
        cy.visit('/');

        cy.contains('Rule Editor').click();
        cy.get('#diagram').should('not.be.visible');
        cy.get('#ruleEditorComponent').should('be.visible');
    });

    it('create new rule', () => {
        cy.wait(1000);

        cy.get('#ruleEditorComponent').contains('New rule').first().click();

        cy.wait(2000);

        cy.get('#rule-editor [data-testid="rule-name-input"]').type(
            '!New super rule'
        );

        cy.get('.react-codemirror2').first().type('Rule target');

        cy.contains('Rule script').click();

        cy.get('.react-codemirror2').last().type('Rule script');

        cy.get('#checkmark').click();

        cy.get('#ruleEditorComponent button').contains('Create').click();

        cy.wait(1000);

        cy.get('#ruleEditorComponent #ruleItemButton').should(($r) => {
            expect($r.last()).to.contain('!New super rule');
        });
    });

    it('update rule', () => {
        cy.get('#ruleEditorComponent #ruleItemButton').last().click();

        cy.wait(1000);

        cy.get('#rule-editor [data-testid="rule-name-input"]')
            .clear()
            .type('!Edited super rule');

        cy.get('button').contains('Save').click();

        cy.wait(1000);

        cy.get('#ruleEditorComponent #ruleItemButton').should(($r) => {
            expect($r.last()).to.contain('!Edited super rule');
        });
    });

    it('delete rule', () => {
        cy.get('#ruleEditorComponent #ruleItemButton').last().click();

        cy.get('button').contains('Delete').click();

        cy.wait(1000);

        cy.get('#ruleEditorComponent #ruleItemButton').should(($r) => {
            expect($r.last()).to.not.contain('!Edited super rule');
        });
    });

    it('export rules', () => {
        cy.get('#ruleEditorComponent [data-testid="burger-menu"]').trigger(
            'mouseover'
        );

        cy.contains('Export rules').click();

        cy.get('#exportAnchor').should('have.attr', 'download', 'rules.json');
    });

    // TODO find a way to handle this
    // it('import rules', () => {
    //     cy.fixture('rules.json').then(fileContent => {
    //         cy.get('#ruleEditorComponent .BurgerMenu-container').trigger('mouseover')
    //
    //         cy.contains('Import rules').click()
    //
    //         const initLength = Cypress.$('#ruleEditorComponent .rule-item-button').length
    //         const contentLength = fileContent.items.length
    //
    //         cy.get('#upload-rule').attachFile({
    //             fileContent: fileContent,
    //             fileName: 'rules.json',
    //         })
    //
    //         cy.wait(1000)
    //
    //         cy.get('#ruleEditorComponent .rule-item-button').should('have.length', initLength + contentLength)
    //     })
    // })
    //
    // it('replace rules', () => {
    //     cy.fixture('rules.json').then(fileContent => {
    //         cy.get('#ruleEditorComponent .BurgerMenu-container').trigger('mouseover')
    //
    //         cy.contains('Replace rules').click()
    //
    //         const initLength = Cypress.$('#ruleEditorComponent .rule-item-button').length
    //         const contentLength = fileContent.items.length
    //
    //         cy.get('#upload-rule').attachFile({
    //             fileContent: fileContent,
    //             fileName: 'rules.json',
    //         })
    //
    //         cy.wait(1000)
    //
    //         cy.get('#ruleEditorComponent .rule-item-button').should('have.length', contentLength)
    //     })
    // })
});
