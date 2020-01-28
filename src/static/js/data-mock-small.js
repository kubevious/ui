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

function fetchAbout(cb) {
    Logger.info("[MOCK::fetchAbout]");
    cb(ABOUT_DATA);
}  
  
  
const GRAPH_DATA = {
  "rn": "root",
  "kind": "root",
  "order": 100,
  "errorCount": 0,
  "children": [
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
      }
      
  ]
}
;

const PROPERTIES_DATA = [
    {
        "kind": "dn-list",
        "id": "shared-with",
        "title": "Shared With",
        "tooltip": "Other objects that also use this configuration.",
        "order": 5,
        "config": [
            "root/ns-kube-system/app-kube-dns/cont-kubedns/vol-kube-dns-config/configmap-kube-dns"
        ]
    },
    {
      "kind": "yaml",
      "id": "config",
      "title": "Config",
      "tooltip": "Kubernetes YAML Configuration",
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
      "tooltip": "Environment variables applied to this container. Also contains variables defined in related ConfigMaps.",
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

const ABOUT_DATA = {
    "version":"v4.5.6",
    "backend version":"v1.2.3"
};