
const KIND_LIST = [
  "Container",
  "Cluster Role",
  "Role Binding",
  "Config Map",
  "Container",
  "Horizontal Pod AutoScaler",
  "Image",
  "Ingress",
  "Init Container",
  "Launcher",
  "Namespace",
  "Network Policy",
  "Node",
  "Persistent Volume",
  "Persistent Volume Claim",
  "Pod",
  "Pod Security Policy",
  "Replica Set",
  "Role",
  "Role Binding",
  "Service",
  "Service Account",
  "Sidecar Container",
  "Storage",
  "Storage Class",
  "Volume"
]

const KIND_LIST_WITH_RESULTS = [
  "Container",
]

const KIND_LIST_NO_RESULTS = [
  "Config Map",
]


const KIND_LIST_X = [
  { name: "Container", hasResults: true },
  { name: "Config Map", hasResults: false }
]

describe('SearchFilters', () => {

    // for(let kindName of KIND_LIST)
    // {

    //   it(`filter list, Kind ${kindName}`, () => {
    //     cy.visit('https://demo.kubevious.io/');
    //     cy.get('#btnHeaderSearch').click();
    //     cy.get(".filter-list")
    //       .find("details")
    //       .contains('summary', "Kind")
    //       .parents("details")
    //       .find("button")
    //       .contains(kindName).click()

    //     // case 1 :: has results
    //     // case 2 :: no results
    //   });

    // }


    for(let kind of KIND_LIST_X)
    {

      it(`NEW filter list, Kind ${kind.name}`, () => {
        cy.visit('/');
        cy.get('#btnHeaderSearch').click();
        cy.get(".filter-list")
          .find("details")
          .contains('summary', "Kind")
          .parents("details")
          .find("button")
          .contains(kind.name).click()

        // kind.hasResults
        // case 1 :: has results
        // case 2 :: no results
      });

    }

});