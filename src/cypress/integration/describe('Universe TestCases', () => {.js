describe('Universe TestCases', () => {

    it("tests an app and it's properties", () => {
        cy.visit('https://demo.kubevious.io/');
        // cy.visit('http://localhost:4000/');
        

        cy.contains('Universe').click()
        cy.wait(2000)



        // Option 2
        cy.get('#diagram > svg > g:first-child')
          .find('g[id="root/ns-[book]"]')
          .should('have.class', 'node')
          .find('.node-expander')
          .click()


    })
})
    

          

    