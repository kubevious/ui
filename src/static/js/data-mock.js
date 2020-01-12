function fetchDiagram(cb) {
    Logger.info("[MOCK:fetchDiagram] ");
    cb(GRAPH_DATA);
}

function fetchProperties(node, cb) {
    Logger.info("[MOCK:fetchProperties] ", node.id);
    cb(_.cloneDeep(PROPERTIES_DATA));
}

function fetchAlerts(node, cb) {
  Logger.info("[MOCK:fetchAlerts] ", node.id);
  cb(ALERTS_DATA);
}

function fetchSearchResults(criteria, cb) {
    Logger.info("[MOCK:fetchSearchResults] ", criteria);
    cb(SEARCH_DATA);
}  
  
const GRAPH_DATA = {
  "rn": "root",
  "kind": "root",
  "order": 100,
  "errorCount": 0,
  "children": [
      {
          "rn": "ns-sprt",
          "name": "sprt",
          "kind": "ns",
          "order": 100,
          "errorCount": 0,
          "children": [
              {
                  "rn": "app-gprod-sprt-main-dtrace",
                  "name": "gprod-sprt-main-dtrace",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-5f66947d67",
                                  "name": "5f66947d67",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-5lhx8",
                                          "name": "5lhx8",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-gprod-sprt-main-dtrace",
                          "name": "gprod-sprt-main-dtrace",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-google-cloud-key",
                                  "name": "google-cloud-key",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "port-client (TCP-9411)",
                                  "name": "client (TCP-9411)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "service-Service 2",
                                          "name": "Service 2",
                                          "kind": "service",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "port-web (TCP-16686)",
                                  "name": "web (TCP-16686)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "service-Service",
                                          "name": "Service",
                                          "kind": "service",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "vol-Volumes",
                          "name": "Volumes",
                          "kind": "vol",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-google-cloud-key",
                                  "name": "google-cloud-key",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "service-Service",
                          "name": "Service",
                          "kind": "service",
                          "order": 200,
                          "errorCount": 0,
                          "children": []
                      },
                      {
                          "rn": "service-Service 2",
                          "name": "Service 2",
                          "kind": "service",
                          "order": 200,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              },
              {
                  "rn": "app-gprod-sprt-main-prmts",
                  "name": "gprod-sprt-main-prmts",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-65665cc8d",
                                  "name": "65665cc8d",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-27c86",
                                          "name": "27c86",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-gprod-sprt-main-prmts",
                          "name": "gprod-sprt-main-prmts",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-google-cloud-key",
                                  "name": "google-cloud-key",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "port-server (TCP-9090)",
                                  "name": "server (TCP-9090)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "service-Service",
                                          "name": "Service",
                                          "kind": "service",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "port-push (TCP-9091)",
                                  "name": "push (TCP-9091)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "service-Service 2",
                                          "name": "Service 2",
                                          "kind": "service",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "vol-Volumes",
                          "name": "Volumes",
                          "kind": "vol",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-google-cloud-key",
                                  "name": "google-cloud-key",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "service-Service",
                          "name": "Service",
                          "kind": "service",
                          "order": 200,
                          "errorCount": 0,
                          "children": []
                      },
                      {
                          "rn": "service-Service 2",
                          "name": "Service 2",
                          "kind": "service",
                          "order": 200,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              },
              {
                  "rn": "raw-Raw Configs",
                  "name": "Raw Configs",
                  "kind": "raw",
                  "order": 1000,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "raw-Services",
                          "name": "Services",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "service-gprod-sprt-main-dtrace-web",
                                  "name": "gprod-sprt-main-dtrace-web",
                                  "kind": "service",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "service-gprod-sprt-main-dtrace-client",
                                  "name": "gprod-sprt-main-dtrace-client",
                                  "kind": "service",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "service-gprod-sprt-main-grfna-default",
                                  "name": "gprod-sprt-main-grfna-default",
                                  "kind": "service",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "service-gprod-sprt-main-prmts-server",
                                  "name": "gprod-sprt-main-prmts-server",
                                  "kind": "service",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "service-gprod-sprt-main-prmts-push",
                                  "name": "gprod-sprt-main-prmts-push",
                                  "kind": "service",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "raw-ReplicaSets",
                          "name": "ReplicaSets",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-gprod-sprt-main-prmts-65665cc8d",
                                  "name": "gprod-sprt-main-prmts-65665cc8d",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-27c86",
                                          "name": "27c86",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "replicaset-gprod-sprt-main-dtrace-5f66947d67",
                                  "name": "gprod-sprt-main-dtrace-5f66947d67",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-5lhx8",
                                          "name": "5lhx8",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "raw-Pods",
                          "name": "Pods",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "pod-gprod-sprt-main-dtrace-5f66947d67-5lhx8",
                                  "name": "gprod-sprt-main-dtrace-5f66947d67-5lhx8",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-gprod-sprt-main-prmts-65665cc8d-27c86",
                                  "name": "gprod-sprt-main-prmts-65665cc8d-27c86",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      }
                  ]
              }
          ]
      },
      {
          "rn": "ns-kubevious",
          "name": "kubevious",
          "kind": "ns",
          "order": 100,
          "errorCount": 0,
          "children": [
              {
                  "rn": "app-kubevious",
                  "name": "kubevious",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-766969d494",
                                  "name": "766969d494",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-gqthz",
                                          "name": "gqthz",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-kubevious",
                          "name": "kubevious",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "port-http (TCP-4000)",
                                  "name": "http (TCP-4000)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "service-Service",
                                          "name": "Service",
                                          "kind": "service",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": [
                                              {
                                                  "rn": "ingress-kubevious",
                                                  "name": "kubevious",
                                                  "kind": "ingress",
                                                  "order": 100,
                                                  "errorCount": 0,
                                                  "children": []
                                              }
                                          ]
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "service-Service",
                          "name": "Service",
                          "kind": "service",
                          "order": 200,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "ingress-kubevious",
                                  "name": "kubevious",
                                  "kind": "ingress",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "ingress-kubevious",
                          "name": "kubevious",
                          "kind": "ingress",
                          "order": 250,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              },
              {
                  "rn": "app-kubevious-ui",
                  "name": "kubevious-ui",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-6fbc9ff959",
                                  "name": "6fbc9ff959",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-5fsp4",
                                          "name": "5fsp4",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-kubevious-ui",
                          "name": "kubevious-ui",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "port-http (TCP-3000)",
                                  "name": "http (TCP-3000)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "service-Service",
                                          "name": "Service",
                                          "kind": "service",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": [
                                              {
                                                  "rn": "ingress-kubevious",
                                                  "name": "kubevious",
                                                  "kind": "ingress",
                                                  "order": 100,
                                                  "errorCount": 0,
                                                  "children": []
                                              }
                                          ]
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "service-Service",
                          "name": "Service",
                          "kind": "service",
                          "order": 200,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "ingress-kubevious",
                                  "name": "kubevious",
                                  "kind": "ingress",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "ingress-kubevious",
                          "name": "kubevious",
                          "kind": "ingress",
                          "order": 250,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              },
              {
                  "rn": "raw-Raw Configs",
                  "name": "Raw Configs",
                  "kind": "raw",
                  "order": 1000,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "raw-Services",
                          "name": "Services",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "service-kubevious-svc",
                                  "name": "kubevious-svc",
                                  "kind": "service",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "ingress-kubevious",
                                          "name": "kubevious",
                                          "kind": "ingress",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "service-kubevious-ui-svc",
                                  "name": "kubevious-ui-svc",
                                  "kind": "service",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "ingress-kubevious",
                                          "name": "kubevious",
                                          "kind": "ingress",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "raw-Ingresses",
                          "name": "Ingresses",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "ingress-kubevious",
                                  "name": "kubevious",
                                  "kind": "ingress",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "raw-ReplicaSets",
                          "name": "ReplicaSets",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-kubevious-ui-6fbc9ff959",
                                  "name": "kubevious-ui-6fbc9ff959",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-5fsp4",
                                          "name": "5fsp4",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "replicaset-kubevious-766969d494",
                                  "name": "kubevious-766969d494",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-gqthz",
                                          "name": "gqthz",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "raw-Pods",
                          "name": "Pods",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "pod-kubevious-ui-6fbc9ff959-5fsp4",
                                  "name": "kubevious-ui-6fbc9ff959-5fsp4",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-kubevious-766969d494-gqthz",
                                  "name": "kubevious-766969d494-gqthz",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      }
                  ]
              }
          ]
      },
      {
          "rn": "ns-addr",
          "name": "addr",
          "kind": "ns",
          "order": 100,
          "errorCount": 0,
          "children": [
              {
                  "rn": "raw-Raw Configs",
                  "name": "Raw Configs",
                  "kind": "raw",
                  "order": 1000,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "raw-ConfigMaps",
                          "name": "ConfigMaps",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "configmap-addr-gprod-addr-main-app-consumes",
                                  "name": "addr-gprod-addr-main-app-consumes",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-addr-gprod-addr-main-proc-consumesdatabase",
                                  "name": "addr-gprod-addr-main-proc-consumesdatabase",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-addr-gprod-addr-main-proc-consumes",
                                  "name": "addr-gprod-addr-main-proc-consumes",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-addr-gprod-addr-main-app-consumesdatabase",
                                  "name": "addr-gprod-addr-main-app-consumesdatabase",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-addr-gprod-addr-main-app-consumesqueue",
                                  "name": "addr-gprod-addr-main-app-consumesqueue",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-addr-gprod-addr-main-proc-consumesqueue",
                                  "name": "addr-gprod-addr-main-proc-consumesqueue",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "raw-Services",
                          "name": "Services",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "service-gprod-addr-main-web-default",
                                  "name": "gprod-addr-main-web-default",
                                  "kind": "service",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "ingress-gprod-addr-web",
                                          "name": "gprod-addr-web",
                                          "kind": "ingress",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "service-gprod-addr-main-app-default",
                                  "name": "gprod-addr-main-app-default",
                                  "kind": "service",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "raw-Ingresses",
                          "name": "Ingresses",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "ingress-gprod-addr-web",
                                  "name": "gprod-addr-web",
                                  "kind": "ingress",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "raw-ReplicaSets",
                          "name": "ReplicaSets",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-gprod-addr-main-proc-995fcd496",
                                  "name": "gprod-addr-main-proc-995fcd496",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-rc8mg",
                                          "name": "rc8mg",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "replicaset-gprod-addr-main-web-c9759bc44",
                                  "name": "gprod-addr-main-web-c9759bc44",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-2vqh6",
                                          "name": "2vqh6",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "replicaset-gprod-addr-main-app-6fdb86d945",
                                  "name": "gprod-addr-main-app-6fdb86d945",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-5kd9b",
                                          "name": "5kd9b",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "replicaset-gprod-addr-main-web-544ccdf995",
                                  "name": "gprod-addr-main-web-544ccdf995",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "raw-Pods",
                          "name": "Pods",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "pod-gprod-addr-main-proc-995fcd496-rc8mg",
                                  "name": "gprod-addr-main-proc-995fcd496-rc8mg",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-gprod-addr-main-app-6fdb86d945-5kd9b",
                                  "name": "gprod-addr-main-app-6fdb86d945-5kd9b",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-gprod-addr-main-web-c9759bc44-2vqh6",
                                  "name": "gprod-addr-main-web-c9759bc44-2vqh6",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      }
                  ]
              },
              {
                  "rn": "app-gprod-addr-main-app",
                  "name": "gprod-addr-main-app",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-6fdb86d945",
                                  "name": "6fdb86d945",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-5kd9b",
                                          "name": "5kd9b",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-gprod-addr-main-app",
                          "name": "gprod-addr-main-app",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-google-cloud-key",
                                  "name": "google-cloud-key",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "vol-gprod-addr-main-app-consumes",
                                  "name": "gprod-addr-main-app-consumes",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-addr-gprod-addr-main-app-consumes",
                                          "name": "addr-gprod-addr-main-app-consumes",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "vol-gprod-addr-main-app-consumesdatabase",
                                  "name": "gprod-addr-main-app-consumesdatabase",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-addr-gprod-addr-main-app-consumesdatabase",
                                          "name": "addr-gprod-addr-main-app-consumesdatabase",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "vol-gprod-addr-main-app-consumesqueue",
                                  "name": "gprod-addr-main-app-consumesqueue",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-addr-gprod-addr-main-app-consumesqueue",
                                          "name": "addr-gprod-addr-main-app-consumesqueue",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "port-default (TCP-4000)",
                                  "name": "default (TCP-4000)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "service-Service",
                                          "name": "Service",
                                          "kind": "service",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-cloudsql-proxy-gprod-addr-uswest1c-main-book",
                          "name": "cloudsql-proxy-gprod-addr-uswest1c-main-book",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-google-cloud-key",
                                  "name": "google-cloud-key",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "vol-Volumes",
                          "name": "Volumes",
                          "kind": "vol",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-google-cloud-key",
                                  "name": "google-cloud-key",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "vol-gprod-addr-main-app-consumes",
                                  "name": "gprod-addr-main-app-consumes",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-addr-gprod-addr-main-app-consumes",
                                          "name": "addr-gprod-addr-main-app-consumes",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "vol-gprod-addr-main-app-consumesdatabase",
                                  "name": "gprod-addr-main-app-consumesdatabase",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-addr-gprod-addr-main-app-consumesdatabase",
                                          "name": "addr-gprod-addr-main-app-consumesdatabase",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "vol-gprod-addr-main-app-consumesqueue",
                                  "name": "gprod-addr-main-app-consumesqueue",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-addr-gprod-addr-main-app-consumesqueue",
                                          "name": "addr-gprod-addr-main-app-consumesqueue",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "service-Service",
                          "name": "Service",
                          "kind": "service",
                          "order": 200,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              },
              {
                  "rn": "app-gprod-addr-main-web",
                  "name": "gprod-addr-main-web",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-c9759bc44",
                                  "name": "c9759bc44",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-2vqh6",
                                          "name": "2vqh6",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "replicaset-544ccdf995",
                                  "name": "544ccdf995",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "cont-gprod-addr-main-web",
                          "name": "gprod-addr-main-web",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-google-cloud-key",
                                  "name": "google-cloud-key",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "port-default (TCP-3000)",
                                  "name": "default (TCP-3000)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "service-Service",
                                          "name": "Service",
                                          "kind": "service",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": [
                                              {
                                                  "rn": "ingress-gprod-addr-web",
                                                  "name": "gprod-addr-web",
                                                  "kind": "ingress",
                                                  "order": 100,
                                                  "errorCount": 0,
                                                  "children": []
                                              }
                                          ]
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "vol-Volumes",
                          "name": "Volumes",
                          "kind": "vol",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-google-cloud-key",
                                  "name": "google-cloud-key",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "service-Service",
                          "name": "Service",
                          "kind": "service",
                          "order": 200,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "ingress-gprod-addr-web",
                                  "name": "gprod-addr-web",
                                  "kind": "ingress",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "ingress-gprod-addr-web",
                          "name": "gprod-addr-web",
                          "kind": "ingress",
                          "order": 250,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              },
              {
                  "rn": "app-gprod-addr-main-proc",
                  "name": "gprod-addr-main-proc",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-995fcd496",
                                  "name": "995fcd496",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-rc8mg",
                                          "name": "rc8mg",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-gprod-addr-main-proc",
                          "name": "gprod-addr-main-proc",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-google-cloud-key",
                                  "name": "google-cloud-key",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "vol-gprod-addr-main-proc-consumes",
                                  "name": "gprod-addr-main-proc-consumes",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-addr-gprod-addr-main-proc-consumes",
                                          "name": "addr-gprod-addr-main-proc-consumes",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "vol-gprod-addr-main-proc-consumesdatabase",
                                  "name": "gprod-addr-main-proc-consumesdatabase",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-addr-gprod-addr-main-proc-consumesdatabase",
                                          "name": "addr-gprod-addr-main-proc-consumesdatabase",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "vol-gprod-addr-main-proc-consumesqueue",
                                  "name": "gprod-addr-main-proc-consumesqueue",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-addr-gprod-addr-main-proc-consumesqueue",
                                          "name": "addr-gprod-addr-main-proc-consumesqueue",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-cloudsql-proxy-gprod-addr-uswest1c-main-book",
                          "name": "cloudsql-proxy-gprod-addr-uswest1c-main-book",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-google-cloud-key",
                                  "name": "google-cloud-key",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "vol-Volumes",
                          "name": "Volumes",
                          "kind": "vol",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-google-cloud-key",
                                  "name": "google-cloud-key",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "vol-gprod-addr-main-proc-consumes",
                                  "name": "gprod-addr-main-proc-consumes",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-addr-gprod-addr-main-proc-consumes",
                                          "name": "addr-gprod-addr-main-proc-consumes",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "vol-gprod-addr-main-proc-consumesdatabase",
                                  "name": "gprod-addr-main-proc-consumesdatabase",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-addr-gprod-addr-main-proc-consumesdatabase",
                                          "name": "addr-gprod-addr-main-proc-consumesdatabase",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "vol-gprod-addr-main-proc-consumesqueue",
                                  "name": "gprod-addr-main-proc-consumesqueue",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-addr-gprod-addr-main-proc-consumesqueue",
                                          "name": "addr-gprod-addr-main-proc-consumesqueue",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      }
                  ]
              }
          ]
      },
      {
          "rn": "ns-berlioz",
          "name": "berlioz",
          "kind": "ns",
          "order": 100,
          "errorCount": 0,
          "children": [
              {
                  "rn": "app-gprod-berlioz-main-ctlr",
                  "name": "gprod-berlioz-main-ctlr",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-6664d965cf",
                                  "name": "6664d965cf",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-mtv55",
                                          "name": "mtv55",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-gprod-berlioz-main-ctlr",
                          "name": "gprod-berlioz-main-ctlr",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-google-cloud-key",
                                  "name": "google-cloud-key",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "vol-Volumes",
                          "name": "Volumes",
                          "kind": "vol",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-google-cloud-key",
                                  "name": "google-cloud-key",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      }
                  ]
              },
              {
                  "rn": "raw-Raw Configs",
                  "name": "Raw Configs",
                  "kind": "raw",
                  "order": 1000,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "raw-ReplicaSets",
                          "name": "ReplicaSets",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-gprod-berlioz-main-ctlr-6664d965cf",
                                  "name": "gprod-berlioz-main-ctlr-6664d965cf",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-mtv55",
                                          "name": "mtv55",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "raw-Pods",
                          "name": "Pods",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "pod-gprod-berlioz-main-ctlr-6664d965cf-mtv55",
                                  "name": "gprod-berlioz-main-ctlr-6664d965cf-mtv55",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      }
                  ]
              }
          ]
      },
      {
          "rn": "ns-default",
          "name": "default",
          "kind": "ns",
          "order": 100,
          "errorCount": 0,
          "children": [
              {
                  "rn": "app-my-nginx",
                  "name": "my-nginx",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-6cc48cd8db",
                                  "name": "6cc48cd8db",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "replicaset-7fc576d876",
                                  "name": "7fc576d876",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-62xd2",
                                          "name": "62xd2",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-jzl24",
                                          "name": "jzl24",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-ksrgs",
                                          "name": "ksrgs",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-qd7w4",
                                          "name": "qd7w4",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-6jrv4",
                                          "name": "6jrv4",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 1,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-sfr7t",
                                          "name": "sfr7t",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 1,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-ls8tn",
                                          "name": "ls8tn",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 1,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-xcxkj",
                                          "name": "xcxkj",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-gjpv9",
                                          "name": "gjpv9",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 1,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-q4s54",
                                          "name": "q4s54",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-nginx",
                          "name": "nginx",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              },
              {
                  "rn": "raw-Raw Configs",
                  "name": "Raw Configs",
                  "kind": "raw",
                  "order": 1000,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "raw-Services",
                          "name": "Services",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "service-kubernetes",
                                  "name": "kubernetes",
                                  "kind": "service",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "raw-ReplicaSets",
                          "name": "ReplicaSets",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-my-nginx-6cc48cd8db",
                                  "name": "my-nginx-6cc48cd8db",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "replicaset-my-nginx-7fc576d876",
                                  "name": "my-nginx-7fc576d876",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-62xd2",
                                          "name": "62xd2",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-jzl24",
                                          "name": "jzl24",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-ksrgs",
                                          "name": "ksrgs",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-qd7w4",
                                          "name": "qd7w4",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-6jrv4",
                                          "name": "6jrv4",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 1,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-sfr7t",
                                          "name": "sfr7t",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 1,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-ls8tn",
                                          "name": "ls8tn",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 1,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-xcxkj",
                                          "name": "xcxkj",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-gjpv9",
                                          "name": "gjpv9",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 1,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-q4s54",
                                          "name": "q4s54",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "raw-Pods",
                          "name": "Pods",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "pod-my-nginx-7fc576d876-62xd2",
                                  "name": "my-nginx-7fc576d876-62xd2",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-my-nginx-7fc576d876-jzl24",
                                  "name": "my-nginx-7fc576d876-jzl24",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-my-nginx-7fc576d876-ksrgs",
                                  "name": "my-nginx-7fc576d876-ksrgs",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-my-nginx-7fc576d876-qd7w4",
                                  "name": "my-nginx-7fc576d876-qd7w4",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-my-nginx-7fc576d876-6jrv4",
                                  "name": "my-nginx-7fc576d876-6jrv4",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 1,
                                  "children": []
                              },
                              {
                                  "rn": "pod-my-nginx-7fc576d876-sfr7t",
                                  "name": "my-nginx-7fc576d876-sfr7t",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 1,
                                  "children": []
                              },
                              {
                                  "rn": "pod-my-nginx-7fc576d876-ls8tn",
                                  "name": "my-nginx-7fc576d876-ls8tn",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 1,
                                  "children": []
                              },
                              {
                                  "rn": "pod-my-nginx-7fc576d876-xcxkj",
                                  "name": "my-nginx-7fc576d876-xcxkj",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-my-nginx-7fc576d876-gjpv9",
                                  "name": "my-nginx-7fc576d876-gjpv9",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 1,
                                  "children": []
                              },
                              {
                                  "rn": "pod-my-nginx-7fc576d876-q4s54",
                                  "name": "my-nginx-7fc576d876-q4s54",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      }
                  ]
              }
          ]
      },
      {
          "rn": "ns-kube-public",
          "name": "kube-public",
          "kind": "ns",
          "order": 100,
          "errorCount": 0,
          "children": []
      },
      {
          "rn": "ns-kube-system",
          "name": "kube-system",
          "kind": "ns",
          "order": 100,
          "errorCount": 0,
          "children": [
              {
                  "rn": "raw-Raw Configs",
                  "name": "Raw Configs",
                  "kind": "raw",
                  "order": 1000,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "raw-ConfigMaps",
                          "name": "ConfigMaps",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "configmap-fluentd-gcp-config-old-v1.2.5",
                                  "name": "fluentd-gcp-config-old-v1.2.5",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-gke-common-webhook-lock",
                                  "name": "gke-common-webhook-lock",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-ingress-uid",
                                  "name": "ingress-uid",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-kube-dns-autoscaler",
                                  "name": "kube-dns-autoscaler",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-fluentd-gcp-config-v1.2.5",
                                  "name": "fluentd-gcp-config-v1.2.5",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-ingress-gce-lock",
                                  "name": "ingress-gce-lock",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-metrics-server-config",
                                  "name": "metrics-server-config",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-kube-dns",
                                  "name": "kube-dns",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-extension-apiserver-authentication",
                                  "name": "extension-apiserver-authentication",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-heapster-config",
                                  "name": "heapster-config",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "configmap-managed-certificate-config",
                                  "name": "managed-certificate-config",
                                  "kind": "configmap",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "raw-Services",
                          "name": "Services",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "service-default-http-backend",
                                  "name": "default-http-backend",
                                  "kind": "service",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "service-metrics-server",
                                  "name": "metrics-server",
                                  "kind": "service",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "service-heapster",
                                  "name": "heapster",
                                  "kind": "service",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "service-kube-dns",
                                  "name": "kube-dns",
                                  "kind": "service",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "raw-ReplicaSets",
                          "name": "ReplicaSets",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-heapster-5b66d5bd56",
                                  "name": "heapster-5b66d5bd56",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-d74sp",
                                          "name": "d74sp",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "replicaset-kube-dns-79868f54c5",
                                  "name": "kube-dns-79868f54c5",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-494x8",
                                          "name": "494x8",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-b2kb7",
                                          "name": "b2kb7",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "replicaset-kube-dns-autoscaler-bb58c6784",
                                  "name": "kube-dns-autoscaler-bb58c6784",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-dpfv7",
                                          "name": "dpfv7",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "replicaset-l7-default-backend-fd59995cd",
                                  "name": "l7-default-backend-fd59995cd",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-97mlg",
                                          "name": "97mlg",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "replicaset-metrics-server-v0.3.1-c4cddd5f5",
                                  "name": "metrics-server-v0.3.1-c4cddd5f5",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "replicaset-event-exporter-v0.2.4-5f88c66fb7",
                                  "name": "event-exporter-v0.2.4-5f88c66fb7",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-fb7vt",
                                          "name": "fb7vt",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "replicaset-heapster-bfcb6d95",
                                  "name": "heapster-bfcb6d95",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "replicaset-fluentd-gcp-scaler-59b7b75cd7",
                                  "name": "fluentd-gcp-scaler-59b7b75cd7",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-dvtq8",
                                          "name": "dvtq8",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "replicaset-heapster-5f8f89bfbc",
                                  "name": "heapster-5f8f89bfbc",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "replicaset-metrics-server-v0.3.1-57c75779f",
                                  "name": "metrics-server-v0.3.1-57c75779f",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-9mf5l",
                                          "name": "9mf5l",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "replicaset-heapster-5b47cb49f6",
                                  "name": "heapster-5b47cb49f6",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "raw-Pods",
                          "name": "Pods",
                          "kind": "raw",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "pod-kube-proxy-gke-gprod-uswest1c-default-pool-ebeee8a5-10cx",
                                  "name": "kube-proxy-gke-gprod-uswest1c-default-pool-ebeee8a5-10cx",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-fluentd-gcp-v3.2.0-5spzr",
                                  "name": "fluentd-gcp-v3.2.0-5spzr",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-kube-dns-79868f54c5-494x8",
                                  "name": "kube-dns-79868f54c5-494x8",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-prometheus-to-sd-vsbbp",
                                  "name": "prometheus-to-sd-vsbbp",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-kube-proxy-gke-gprod-uswest1c-default-pool-ebeee8a5-5tl4",
                                  "name": "kube-proxy-gke-gprod-uswest1c-default-pool-ebeee8a5-5tl4",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-event-exporter-v0.2.4-5f88c66fb7-fb7vt",
                                  "name": "event-exporter-v0.2.4-5f88c66fb7-fb7vt",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-heapster-5b66d5bd56-d74sp",
                                  "name": "heapster-5b66d5bd56-d74sp",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-prometheus-to-sd-5hkkp",
                                  "name": "prometheus-to-sd-5hkkp",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-fluentd-gcp-v3.2.0-x8xvf",
                                  "name": "fluentd-gcp-v3.2.0-x8xvf",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-fluentd-gcp-v3.2.0-dwxwt",
                                  "name": "fluentd-gcp-v3.2.0-dwxwt",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-metrics-server-v0.3.1-57c75779f-9mf5l",
                                  "name": "metrics-server-v0.3.1-57c75779f-9mf5l",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-fluentd-gcp-scaler-59b7b75cd7-dvtq8",
                                  "name": "fluentd-gcp-scaler-59b7b75cd7-dvtq8",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-kube-dns-79868f54c5-b2kb7",
                                  "name": "kube-dns-79868f54c5-b2kb7",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-kube-dns-autoscaler-bb58c6784-dpfv7",
                                  "name": "kube-dns-autoscaler-bb58c6784-dpfv7",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-l7-default-backend-fd59995cd-97mlg",
                                  "name": "l7-default-backend-fd59995cd-97mlg",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-prometheus-to-sd-55vh2",
                                  "name": "prometheus-to-sd-55vh2",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "pod-kube-proxy-gke-gprod-uswest1c-default-pool-ebeee8a5-22xq",
                                  "name": "kube-proxy-gke-gprod-uswest1c-default-pool-ebeee8a5-22xq",
                                  "kind": "pod",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      }
                  ]
              },
              {
                  "rn": "app-fluentd-gcp-v3.2.0",
                  "name": "fluentd-gcp-v3.2.0",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-DaemonSet",
                          "name": "DaemonSet",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      },
                      {
                          "rn": "cont-fluentd-gcp",
                          "name": "fluentd-gcp",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-varlog",
                                  "name": "varlog",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "vol-varlibdockercontainers",
                                  "name": "varlibdockercontainers",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "vol-config-volume",
                                  "name": "config-volume",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-fluentd-gcp-config-old-v1.2.5",
                                          "name": "fluentd-gcp-config-old-v1.2.5",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-prometheus-to-sd-exporter",
                          "name": "prometheus-to-sd-exporter",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      },
                      {
                          "rn": "vol-Volumes",
                          "name": "Volumes",
                          "kind": "vol",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-varlog",
                                  "name": "varlog",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "vol-varlibdockercontainers",
                                  "name": "varlibdockercontainers",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "vol-config-volume",
                                  "name": "config-volume",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-fluentd-gcp-config-old-v1.2.5",
                                          "name": "fluentd-gcp-config-old-v1.2.5",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      }
                  ]
              },
              {
                  "rn": "app-metadata-proxy-v0.1",
                  "name": "metadata-proxy-v0.1",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-DaemonSet",
                          "name": "DaemonSet",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      },
                      {
                          "rn": "cont-metadata-proxy",
                          "name": "metadata-proxy",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      },
                      {
                          "rn": "cont-prometheus-to-sd-exporter",
                          "name": "prometheus-to-sd-exporter",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              },
              {
                  "rn": "app-nvidia-gpu-device-plugin",
                  "name": "nvidia-gpu-device-plugin",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-DaemonSet",
                          "name": "DaemonSet",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      },
                      {
                          "rn": "cont-nvidia-gpu-device-plugin",
                          "name": "nvidia-gpu-device-plugin",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-device-plugin",
                                  "name": "device-plugin",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "vol-dev",
                                  "name": "dev",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "vol-Volumes",
                          "name": "Volumes",
                          "kind": "vol",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-device-plugin",
                                  "name": "device-plugin",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "vol-dev",
                                  "name": "dev",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      }
                  ]
              },
              {
                  "rn": "app-prometheus-to-sd",
                  "name": "prometheus-to-sd",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-DaemonSet",
                          "name": "DaemonSet",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      },
                      {
                          "rn": "cont-prometheus-to-sd",
                          "name": "prometheus-to-sd",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      },
                      {
                          "rn": "cont-prometheus-to-sd-new-model",
                          "name": "prometheus-to-sd-new-model",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              },
              {
                  "rn": "app-l7-default-backend",
                  "name": "l7-default-backend",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-fd59995cd",
                                  "name": "fd59995cd",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-97mlg",
                                          "name": "97mlg",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-default-http-backend",
                          "name": "default-http-backend",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "port-undefined (TCP-8080)",
                                  "name": "undefined (TCP-8080)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "service-Service",
                                          "name": "Service",
                                          "kind": "service",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "service-Service",
                          "name": "Service",
                          "kind": "service",
                          "order": 200,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              },
              {
                  "rn": "app-event-exporter-v0.2.4",
                  "name": "event-exporter-v0.2.4",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-5f88c66fb7",
                                  "name": "5f88c66fb7",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-fb7vt",
                                          "name": "fb7vt",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-event-exporter",
                          "name": "event-exporter",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      },
                      {
                          "rn": "cont-prometheus-to-sd-exporter",
                          "name": "prometheus-to-sd-exporter",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      },
                      {
                          "rn": "vol-Volumes",
                          "name": "Volumes",
                          "kind": "vol",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-ssl-certs",
                                  "name": "ssl-certs",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      }
                  ]
              },
              {
                  "rn": "app-kube-dns",
                  "name": "kube-dns",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-79868f54c5",
                                  "name": "79868f54c5",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-494x8",
                                          "name": "494x8",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      },
                                      {
                                          "rn": "pod-b2kb7",
                                          "name": "b2kb7",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-kubedns",
                          "name": "kubedns",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-kube-dns-config",
                                  "name": "kube-dns-config",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-kube-dns",
                                          "name": "kube-dns",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "port-dns-local (UDP-10053)",
                                  "name": "dns-local (UDP-10053)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "port-dns-tcp-local (TCP-10053)",
                                  "name": "dns-tcp-local (TCP-10053)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "port-metrics (TCP-10055)",
                                  "name": "metrics (TCP-10055)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "cont-dnsmasq",
                          "name": "dnsmasq",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-kube-dns-config",
                                  "name": "kube-dns-config",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-kube-dns",
                                          "name": "kube-dns",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "port-dns (UDP-53)",
                                  "name": "dns (UDP-53)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "port-dns-tcp (TCP-53)",
                                  "name": "dns-tcp (TCP-53)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "service-Service",
                                          "name": "Service",
                                          "kind": "service",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-sidecar",
                          "name": "sidecar",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "port-metrics (TCP-10054)",
                                  "name": "metrics (TCP-10054)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "cont-prometheus-to-sd",
                          "name": "prometheus-to-sd",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      },
                      {
                          "rn": "vol-Volumes",
                          "name": "Volumes",
                          "kind": "vol",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-kube-dns-config",
                                  "name": "kube-dns-config",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-kube-dns",
                                          "name": "kube-dns",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "service-Service",
                          "name": "Service",
                          "kind": "service",
                          "order": 200,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              },
              {
                  "rn": "app-fluentd-gcp-scaler",
                  "name": "fluentd-gcp-scaler",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-59b7b75cd7",
                                  "name": "59b7b75cd7",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-dvtq8",
                                          "name": "dvtq8",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-fluentd-gcp-scaler",
                          "name": "fluentd-gcp-scaler",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              },
              {
                  "rn": "app-heapster",
                  "name": "heapster",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-5b66d5bd56",
                                  "name": "5b66d5bd56",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-d74sp",
                                          "name": "d74sp",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              },
                              {
                                  "rn": "replicaset-bfcb6d95",
                                  "name": "bfcb6d95",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "replicaset-5f8f89bfbc",
                                  "name": "5f8f89bfbc",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "replicaset-5b47cb49f6",
                                  "name": "5b47cb49f6",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              }
                          ]
                      },
                      {
                          "rn": "cont-heapster",
                          "name": "heapster",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      },
                      {
                          "rn": "cont-prom-to-sd",
                          "name": "prom-to-sd",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      },
                      {
                          "rn": "cont-heapster-nanny",
                          "name": "heapster-nanny",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-heapster-config-volume",
                                  "name": "heapster-config-volume",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-heapster-config",
                                          "name": "heapster-config",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "vol-Volumes",
                          "name": "Volumes",
                          "kind": "vol",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-heapster-config-volume",
                                  "name": "heapster-config-volume",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-heapster-config",
                                          "name": "heapster-config",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "service-Service",
                          "name": "Service",
                          "kind": "service",
                          "order": 200,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              },
              {
                  "rn": "app-metrics-server-v0.3.1",
                  "name": "metrics-server-v0.3.1",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-c4cddd5f5",
                                  "name": "c4cddd5f5",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": []
                              },
                              {
                                  "rn": "replicaset-57c75779f",
                                  "name": "57c75779f",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-9mf5l",
                                          "name": "9mf5l",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-metrics-server",
                          "name": "metrics-server",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "port-https (TCP-443)",
                                  "name": "https (TCP-443)",
                                  "kind": "port",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "service-Service",
                                          "name": "Service",
                                          "kind": "service",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-metrics-server-nanny",
                          "name": "metrics-server-nanny",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-metrics-server-config-volume",
                                  "name": "metrics-server-config-volume",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-metrics-server-config",
                                          "name": "metrics-server-config",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "vol-Volumes",
                          "name": "Volumes",
                          "kind": "vol",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "vol-metrics-server-config-volume",
                                  "name": "metrics-server-config-volume",
                                  "kind": "vol",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "configmap-metrics-server-config",
                                          "name": "metrics-server-config",
                                          "kind": "configmap",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "service-Service",
                          "name": "Service",
                          "kind": "service",
                          "order": 200,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              },
              {
                  "rn": "app-kube-dns-autoscaler",
                  "name": "kube-dns-autoscaler",
                  "kind": "app",
                  "order": 100,
                  "errorCount": 0,
                  "children": [
                      {
                          "rn": "launcher-Deployment",
                          "name": "Deployment",
                          "kind": "launcher",
                          "order": 100,
                          "errorCount": 0,
                          "children": [
                              {
                                  "rn": "replicaset-bb58c6784",
                                  "name": "bb58c6784",
                                  "kind": "replicaset",
                                  "order": 100,
                                  "errorCount": 0,
                                  "children": [
                                      {
                                          "rn": "pod-dpfv7",
                                          "name": "dpfv7",
                                          "kind": "pod",
                                          "order": 100,
                                          "errorCount": 0,
                                          "children": []
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "rn": "cont-autoscaler",
                          "name": "autoscaler",
                          "kind": "cont",
                          "order": 100,
                          "errorCount": 0,
                          "children": []
                      }
                  ]
              }
          ]
      }
  ]
}
;

const PROPERTIES_DATA = [
    {
        "kind": "dn-list",
        "id": "shared-with",
        "title": "Shared With",
        "order": 5,
        "config": [
            "root/ns-kube-system/app-kube-dns/cont-kubedns/vol-kube-dns-config/configmap-kube-dns"
        ]
    },
    {
      "kind": "yaml",
      "id": "config",
      "title": "Config",
      "config": {
        "name": "gprod-addr-main-app",
        "image": "gcr.io/berlioz-demo-gprod/addr-main-app@sha256:b5e6317de1171f784784f65f8b563c46c069dd6b3093547a3ee4f3cfb2ddb7e1",
        "ports": [
          {
            "name": "default",
            "containerPort": 4000,
            "protocol": "TCP"
          }
        ],
        "env": [
          {
            "name": "BERLIOZ_TASK_ID",
            "valueFrom": {
              "fieldRef": {
                "apiVersion": "v1",
                "fieldPath": "metadata.uid"
              }
            }
          },
          {
            "name": "BERLIOZ_IDENTITY",
            "valueFrom": {
              "fieldRef": {
                "apiVersion": "v1",
                "fieldPath": "metadata.name"
              }
            }
          },
          {
            "name": "BERLIOZ_ADDRESS",
            "valueFrom": {
              "fieldRef": {
                "apiVersion": "v1",
                "fieldPath": "status.podIP"
              }
            }
          },
          {
            "name": "BERLIOZ_INSTANCE_ID",
            "valueFrom": {
              "fieldRef": {
                "apiVersion": "v1",
                "fieldPath": "spec.nodeName"
              }
            }
          },
          {
            "name": "BERLIOZ_HOST_IP",
            "valueFrom": {
              "fieldRef": {
                "apiVersion": "v1",
                "fieldPath": "status.hostIP"
              }
            }
          },
          {
            "name": "BERLIOZ_CONSUMES_PATH",
            "value": "/etc/berlioz/consumes"
          },
          {
            "name": "BERLIOZ_AGENT_PATH",
            "value": "ws://${BERLIOZ_HOST_IP}:55555/${BERLIOZ_TASK_ID}"
          },
          {
            "name": "BERLIOZ_LISTEN_ADDRESS",
            "value": "0.0.0.0"
          },
          {
            "name": "BERLIOZ_INFRA",
            "value": "k8s"
          },
          {
            "name": "BERLIOZ_REGION",
            "value": "us-west1"
          },
          {
            "name": "BERLIOZ_CLUSTER",
            "value": "addr"
          },
          {
            "name": "BERLIOZ_SECTOR",
            "value": "main"
          },
          {
            "name": "BERLIOZ_SERVICE",
            "value": "app"
          },
          {
            "name": "BERLIOZ_IDENTITY_PREFIX",
            "value": "gprod-addr-main-app-"
          },
          {
            "name": "BERLIOZ_LISTEN_PORT_DEFAULT",
            "value": "4000"
          },
          {
            "name": "BERLIOZ_PROVIDED_PORT_DEFAULT",
            "value": "4000"
          },
          {
            "name": "GOOGLE_APPLICATION_CREDENTIALS",
            "value": "/var/secrets/google/service-key.json"
          },
          {
            "name": "BERLIOZ_CONSUMED_CLUSTER_SPRT_DTREP_HOST",
            "value": "gprod-sprt-main-dtrace-client"
          },
          {
            "name": "BERLIOZ_CONSUMED_CLUSTER_SPRT_DTREP_PORT",
            "value": "80"
          },
          {
            "name": "BERLIOZ_CONSUMED_CLUSTER_SPRT_DTREP_URL",
            "value": "http://gprod-sprt-main-dtrace-client:80"
          }
        ],
        "resources": {
          "requests": {
            "cpu": "100m",
            "memory": "100Mi"
          }
        },
        "volumeMounts": [
          {
            "name": "google-cloud-key",
            "mountPath": "/var/secrets/google"
          },
          {
            "name": "gprod-addr-main-app-consumes",
            "mountPath": "/etc/berlioz/consumes"
          },
          {
            "name": "gprod-addr-main-app-consumesdatabase",
            "mountPath": "/etc/berlioz/consumes/database"
          }
        ],
        "terminationMessagePath": "/dev/termination-log",
        "terminationMessagePolicy": "File",
        "imagePullPolicy": "IfNotPresent"
      }
    },
    {
      "kind": "key-value",
      "id": "env",
      "title": "Environment Variables",
      "order": 10,
      "config": {
        "BERLIOZ_TASK_ID": "<pre>fieldRef:\n  apiVersion: v1\n  fieldPath: metadata.uid\n</pre>",
        "BERLIOZ_IDENTITY": "<pre>fieldRef:\n  apiVersion: v1\n  fieldPath: metadata.name\n</pre>",
        "BERLIOZ_ADDRESS": "<pre>fieldRef:\n  apiVersion: v1\n  fieldPath: status.podIP\n</pre>",
        "BERLIOZ_INSTANCE_ID": "<pre>fieldRef:\n  apiVersion: v1\n  fieldPath: spec.nodeName\n</pre>",
        "BERLIOZ_HOST_IP": "<pre>fieldRef:\n  apiVersion: v1\n  fieldPath: status.hostIP\n</pre>",
        "BERLIOZ_CONSUMES_PATH": "/etc/berlioz/consumes",
        "BERLIOZ_AGENT_PATH": "ws://${BERLIOZ_HOST_IP}:55555/${BERLIOZ_TASK_ID}",
        "BERLIOZ_LISTEN_ADDRESS": "0.0.0.0",
        "BERLIOZ_INFRA": "k8s",
        "BERLIOZ_REGION": "us-west1",
        "BERLIOZ_CLUSTER": "addr",
        "BERLIOZ_SECTOR": "main",
        "BERLIOZ_SERVICE": "app",
        "BERLIOZ_IDENTITY_PREFIX": "gprod-addr-main-app-",
        "BERLIOZ_LISTEN_PORT_DEFAULT": "4000",
        "BERLIOZ_PROVIDED_PORT_DEFAULT": "4000",
        "GOOGLE_APPLICATION_CREDENTIALS": "/var/secrets/google/service-key.json",
        "BERLIOZ_CONSUMED_CLUSTER_SPRT_DTREP_HOST": "gprod-sprt-main-dtrace-client",
        "BERLIOZ_CONSUMED_CLUSTER_SPRT_DTREP_PORT": "80",
        "BERLIOZ_CONSUMED_CLUSTER_SPRT_DTREP_URL": "http://gprod-sprt-main-dtrace-client:80"
      }
    }
  ]
;

const ALERTS_DATA = [
  {
      "id": "Initialized-2019-12-27T19:47:53Z",
      "severity": "warn",
      "msg": "something happened",
      "date": "2019-12-27T19:47:53Z"
  },
  {
      "id": "Ready-2019-12-27T19:47:59Z",
      "severity": "warn",
      "msg": "something happened",
      "date": "2019-12-27T19:47:59Z"
  },
  {
      "id": "ContainersReady-2019-12-27T19:47:59Z",
      "severity": "warn",
      "msg": "something happened",
      "date": "2019-12-27T19:47:59Z"
  },
  {
      "id": "PodScheduled-2019-12-27T19:47:53Z",
      "severity": "warn",
      "msg": "something happened",
      "date": "2019-12-27T19:47:53Z"
  }
];

const SEARCH_DATA = [
    {
        dn: "root/ns-berlioz/app-gprod-berlioz-main-ctlr"
    },
    {
        dn: "root/ns-kubevious/app-kubevious/cont-kubevious/port-http (TCP-4000)"
    },
    {
        dn: "root/ns-kube-system/app-heapster/launcher-Deployment/replicaset-5b66d5bd56/pod-d74sp"
    },
    {
        dn: "root/ns-kubevious/app-kubevious/ingress-kubevious"
    },
    {
        dn: "root/ns-kube-system/app-kube-dns/cont-dnsmasq/vol-kube-dns-config/configmap-kube-dns"
    },
    {
        dn: "root/ns-kube-system/app-kube-dns-autoscaler/launcher-Deployment/replicaset-bb58c6784/pod-dpfv7"
    },
    {
        dn: "root/ns-addr/app-gprod-addr-main-web/cont-gprod-addr-main-web/port-default (TCP-3000)/service-Service"
    },
    {
        dn: "root/ns-addr/app-gprod-addr-main-web/ingress-gprod-addr-web"
    },
    {
        dn: "root/ns-sprt/app-gprod-sprt-main-prmts/cont-gprod-sprt-main-prmts/vol-google-cloud-key"
    },
    {
        dn: "root/ns-sprt/app-gprod-sprt-main-prmts/cont-gprod-sprt-main-prmts/vol-google-cloud-key"
    },
    {
        dn: "root/ns-kube-system/app-metrics-server-v0.3.1/cont-metrics-server-nanny/vol-metrics-server-config-volume/configmap-metrics-server-config"
    },
    {
        dn: "root/ns-berlioz/app-gprod-berlioz-main-ctlr/launcher-Deployment"
    },
    {
        dn: "root/ns-kube-system/app-heapster/cont-heapster-nanny/vol-heapster-config-volume"
    },
    {
        dn: "root/ns-kube-system/app-heapster/cont-prom-to-sd"
    }
];