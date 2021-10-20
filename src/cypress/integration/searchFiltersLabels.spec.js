describe('Test Search Filters, Labels', () => {

  it('filter list, Label/Value Autocomplete', () => {
    cy.visit('https://demo.kubevious.io/');
    cy.get('#btnHeaderSearch').click();

    cy.get(".filter-list")
      .find("details")
      .contains('summary', "Labels")
      .parents("details")
      .find('input')
      .eq(0)
      .click()
      .type("a")

    cy.get('.autocomplete')
      .should('have.class', 'autocomplete')


    cy.get(".filter-list")
      .find("details")
      .contains('summary', "Labels")
      .parents("details")
      .find('input')
      .eq(1)
      .click({ force: true })
      .type("o")
    cy.get('.autocomplete')
      .should('have.class', 'autocomplete')

  });


  const labelList = [
    { label: "app", value: "openfaas", expectedCount: 39 },
    { label: "k8s-app", value: "kube-dns", expectedCount: 16 },
    { label: "release", value: "gitlab", expectedCount: 184 }
  ]

  for (let label of labelList) {

    `Testing Search Filter: ${label.label} / ${label.value}`
    it('Testing Search Filter: ' + label.label + '/' + label.value, () => {

      cy.visit('https://demo.kubevious.io/');
      cy.get('#btnHeaderSearch').click();

      cy.get(".filter-list")
        .find("details")
        .contains('summary', "Labels")
        .parents("details")
        .find('input')
        .eq(0)
        .click()
        .type(label.label)
        .type('{enter}')

      cy.get(".filter-list")
        .find("details")
        .contains('summary', "Labels")
        .parents("details")
        .find('input')
        .eq(1)
        .click()
        .type(label.value)
        .type('{enter}')


      cy.get('.add-filter-btn')
        .contains('button', "Add")
        .click()

      cy.get('.active-filter-box')
        .contains('labels')
        .parents('.active-filter-box')
        .contains(`${label.label}: ${label.value}`)
        //.parents('.active-filter-box')
        //.contains(label.label)
        //.parents('.active-filter-box')
        //.contains(label.value)
        .should('have.class', 'filter-val')


      cy.get('.search-results').children()
        .should('have.length', label.expectedCount)


      //.should('have.class', 'filter-btn')

      //if(label.expectedCount > 0){
      //cy.get('.search-results').children()
      //.should('have.length', label.expectedCount)
      //} else {
      //cy.get('.search-results')
      //.find(".result-placeholder")
      //.should('have.text', "No items matching search criteria")
      //}

      //}
    });
  }



  const labelLists = [
    { label: "app", value: "openfaas", expectedCount: 39 },
    { label: "k8s-app", value: "kube-dns", expectedCount: 0 }
  ]



  it('filter list, Multiple Labels', () => {
    cy.visit('https://demo.kubevious.io/');
    cy.get('#btnHeaderSearch').click();

    for (let label of labelLists) {
      cy.get(".filter-list")
        .find("details")
        .contains('summary', "Labels")
        .parents("details")
        .find('input')
        .eq(0)
        .click()
        .type(label.label)
        .type('{enter}')

      cy.get(".filter-list")
        .find("details")
        .contains('summary', "Labels")
        .parents("details")
        .find('input')
        .eq(1)
        .click()
        .type(label.value)
        .type('{enter}')


      cy.get('.add-filter-btn')
        .contains('button', "Add")
        .click()

      if (label.expectedCount > 0) {
        cy.get('.active-filter-box')
          .contains('labels')
          .parents('.active-filter-box')
          .contains(`${label.label}: ${label.value}`)
        //.parents('.active-filter-box')
        //.contains(label.label)
        //.parents('.active-filter-box')
        //.contains(label.value)
        //.should('have.class', 'filter-val')
      } else {
        cy.get('.search-results')
          .contains('No items matching search criteria')
          .should('be.visible')
      }
    }
  });


  it('Testing Search filter lists, Labels with Kind(Ingress)', () => {
    cy.visit('https://demo.kubevious.io/');
    cy.get('#btnHeaderSearch').click();

    cy.get(".filter-list")
      .find("details")
      .contains('summary', "Labels")
      .parents("details")
      .find('input')
      .eq(0)
      .click()
      .type("app")
      .type('{enter}')

    cy.get(".filter-list")
      .find("details")
      .contains('summary', "Labels")
      .parents("details")
      .find('input')
      .eq(1)
      .click()
      .type("openfaas")
      .type('{enter}')


    cy.get('.add-filter-btn')
      .contains('button', "Add")
      .click()

    cy.get(".filter-list")
      .find("details")
      .contains('summary', "Kind")
      .parents("details")
      .find("button")
      .contains("Ingress").click()

    cy.get('.search-results').children()
      .its('length')
      .should('be.gte', 1)


  });

  it('Testing Search filter lists, Labels with Kind(Cluster Role)', () => {
    cy.visit('https://demo.kubevious.io/');
    cy.get('#btnHeaderSearch').click();

    cy.get(".filter-list")
      .find("details")
      .contains('summary', "Labels")
      .parents("details")
      .find('input')
      .eq(0)
      .click()
      .type("app")
      .type('{enter}')

    cy.get(".filter-list")
      .find("details")
      .contains('summary', "Labels")
      .parents("details")
      .find('input')
      .eq(1)
      .click()
      .type("openfaas")
      .type('{enter}')


    cy.get('.add-filter-btn')
      .contains('button', "Add")
      .click()

    cy.get(".filter-list")
      .find("details")
      .contains('summary', "Kind")
      .parents("details")
      .find("button")
      .contains("Cluster Role").click()

    cy.get('.search-results')
      .contains('No items matching search criteria')
      .should('be.visible')

  });


  it('Testing Search filter lists, Labels with Errors', () => {
    cy.visit('https://demo.kubevious.io/');
    cy.get('#btnHeaderSearch').click();

    cy.get(".filter-list")
      .find("details")
      .contains('summary', "Labels")
      .parents("details")
      .find('input')
      .eq(0)
      .click()
      .type("app")
      .type('{enter}')

    cy.get(".filter-list")
      .find("details")
      .contains('summary', "Labels")
      .parents("details")
      .find('input')
      .eq(1)
      .click()
      .type("openfaas")
      .type('{enter}')


    cy.get('.add-filter-btn')
      .contains('button', "Add")
      .click()

    cy.get(".filter-list")
      .find("details")
      .contains('summary', "Errors")
      .parents("details")
      .find("button")
      .contains("With errors").click()

    cy.get('.search-results').children()
      .its('length')
      .should('be.gte', 1)


  });

  it.only('Testing filter boxes', () => {
    cy.visit('https://demo.kubevious.io/');
    cy.get('#btnHeaderSearch').click();

    cy.get(".filter-list")
      .find("details")
      .contains('summary', "Labels")
      .parents("details")
      .find('input')
      .eq(0)
      .click()
      .type("app")
      .type('{enter}')

    cy.get(".filter-list")
      .find("details")
      .contains('summary', "Labels")
      .parents("details")
      .find('input')
      .eq(1)
      .click()
      .type("openfaas")
      .type('{enter}')

    cy.get('.add-filter-btn')
      .contains('button', "Add")
      .click()

    cy.get('.active-filter-box')
      .contains('labels')
      .parents('.active-filter-box')
      .contains('openfaas')
    
    cy.get('filter-btn toggle')

  });




});