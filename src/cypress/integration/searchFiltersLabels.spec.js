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
          .click({force: true})
          .type("o")
        cy.get('.autocomplete')
          .should('have.class', 'autocomplete')

    });


    const labelList = [
      {label: "app", value: "openfaas", expectedCount: 39},
      {label: "k8s-app", value: "kube-dns", expectedCount: 16},
      {label: "release", value: "gitlab", expectedCount: 0}
    ]

    for(let label of labelList ){

        it('filter list, Labels', () => {
          
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
            .parents('.active-filter-box')
            .contains(label.label)
            .parents('.active-filter-box')
            .contains(label.value)
            // .should('have.class', 'filter-val')
            
        

          cy.get('.search-results').children()
            .should('have.length', label.expectedCount)

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


          
        // contains
        // app.kubernetes.io/name</div>
        // <div>name</div>
        // <div>helm.sh/chart</div>
        // <div>app.kubernetes.io/instance</div> */}


        // type: nam

        // contains
        // app.kubernetes.io/name</div>
        // <div>name</div>

        // does not contain:
        // <div>helm.sh/chart</div>
        // <div>app.kubernetes.io/instance</div> */}

   // });

});