describe('Universe TestCases', () => {

    it("tests an app and it's properties", () => {
        cy.visit('https://demo.kubevious.io/');
        // cy.visit('http://localhost:4000/');
        

        cy.contains('Universe').click()
        cy.wait(2000)

        // // Option 1
        // cy.get('#diagram')
        //   .find('g[id="root/ns-[book]"]')
        //   .should('have.class', 'node')
        //   .eq(0)
        //   .find('.node-header')
        //   .click()
        //   .parent() //'.node')
        //   .should('have.class', 'selected')


        // Option 2

        // verify not selected & click
        cy.get('#diagram > svg > g:first-child')
          .find('g[id="root/ns-[book]"]')
          .should('have.class', 'node')
          .find('.node-header')
          .click()

        // verify selected
        cy.get('#diagram > svg > g:first-child')
          .find('g[id="root/ns-[book]"]')
          .should('have.class', 'node selected')
          //.should('have.class', 'selected')

        // verifyAlerts
        cy.get('#diagram > svg > g:first-child')
          .find('g[id="root/ns-[gitlab]"]')
          //.should('have.class', 'node selected')
          .find('.node-severity-text')
          .eq(0)
          .should('have.text', 43)
         
        cy.get('#diagram > svg > g:first-child')
          .find('g[id="root/ns-[gitlab]"]')
          .find('.node-severity-text')
          .eq(1)
          .should('have.text', 7)

        //verify selected & properties
        cy.get('#diagram > svg > g:first-child')
          .find('g[id="root/ns-[book]"]')
          .should('have.class', 'node selected')
        
        cy.get('.lm_header')
          .parents('.lm_item')

        
        //verified expanded Node
        cy.get('#diagram > svg > g:first-child')
          .find('g[id="root/ns-[book]"]')
          .should('have.class', 'node')
          .find('.node-expander')
          .click()

        //verify properties
        cy.get('.lm_title').contains('Properties')
          
        cy.get('.message-empty')
          //.parents('.lm_items')
        //cy.contains('No object selected.')
          //.should('be.visible')


        //close properties
        cy.get('.lm_title').contains('Properties')
        cy.get('.lm_close_tab')
          .eq(4)
          .click()



        // Option 3

        verifyNotSelected("root/ns-[book]");

        clickNode("root/ns-[book]");

        verifySelected("root/ns-[book]");

        expandNode("root/ns-[book]");

        verifyAlerts("root/ns-[gitlab]", 7, 43)

        verifyProperties("root/ns-[book]", 'Properties')

    })
});



// Utilities

function clickNode(dn)
{
    cy.get('#diagram > svg > g:first-child')
      .find('g[id="' + dn + '"]')
      .click({force: true})
}

function verifyNotSelected(dn)
{
    cy.get('#diagram > svg > g:first-child')
      .find('g[id="' + dn + '"]')
      .should('have.class', 'node')   
    
}

function verifySelected(dn)
{
    cy.get('#diagram > svg > g:first-child')
      .find('g[id="' + dn + '"]')
      .should('have.class', 'node selected')
    
}


function verifyAlerts(dn, errors, warnings)
{
    cy.get('#diagram > svg > g:first-child')
      .find('g[id="' + dn, errors, warnings + '"]')
      .find('.node-severity-text')
      .eq(0)
      .should('have.text', 43)
         
    cy.get('#diagram > svg > g:first-child')
      .find('g[id="root/ns-[gitlab]"]')
      .find('.node-severity-text')
      .eq(1)
      .should('have.text', 7)
    // .should('have.class', 'node selected')
    // .should('have.class', 'lm_title')

}

function expandNode(dn)
{
    cy.get('#diagram > svg > g:first-child')
      .find('g[id="' + dn + '"]')
      .should('have.class', 'node')
      .find('.node-expander')
      .click()

}

function verifyProperties(dn, properties) 
{
    cy.get('#diagram > svg > g:first-child')
      .find('g[id="' + dn + '"]')
      .click({force: true})

    cy.get('.lm_title')
      .contains('Properties')


}