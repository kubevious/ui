function fetchDiagram(cb) {
    Logger.info("[MOCK:fetchDiagram] ");
    cb(GRAPH_DATA);
}

function fetchAssets(dn, cb) {
    Logger.info("[MOCK:fetchAssets] %s", dn);
    cb(_.cloneDeep({
        props: PROPERTIES_DATA,
        alerts: ALERTS_DATA
    }));
}

function fetchSearchResults(criteria, cb) {
    Logger.info("[MOCK:fetchSearchResults] ", criteria);
    cb(SEARCH_DATA);
}  

function fetchAbout(cb) {
    Logger.info("[MOCK::fetchAbout]");
    cb(ABOUT_DATA);
}  
  
function fetchHistoryRange(cb) {
    Logger.info("[MOCK::fetchHistoryRange]");
    cb(HISTORY_RANGE);
}  
  
function fetchHistoryTimeline(from, to, cb) {
    Logger.info("[MOCK::fetchHistoryTimeline]");
    cb(HISTORY_TIMELINE);
}

function fetchHistorySnapshot(date, cb) {
    Logger.info("[MOCK::fetchHistoryTimeline] %s", date);
    cb(HISTORY_GRAPH_DATA);
}

function fetchHistoryProperties(dn, date, cb) {
    Logger.info("[MOCK:fetchHistoryProperties] %s :: %s ", dn, date);
    cb(_.cloneDeep(HISTORY_PROPERTIES));
}


var MOCK_POLICY_INDEX=3;
var MOCK_POLICY_LIST = [
    {
        id: 1,
        enabled: true,
        name: 'policy 1',
        target: 'target-1',
        script: 'script-1'
    },
    {
        id: 2,
        enabled: false,
        name: 'policy 2',
        target: 'target-2',
        script: 'if (item.hasChild("Ingress")) \n { \n \t if (item.config.spec.type == \'ClusterIP\') \n \t{ \n \t\tfail(\'Use ClusterIP for Ingress exposed services\'); \n \t } \n }'
    }
];
function backendFetchPolicyList(cb) {
    Logger.info("[backendFetchPolicyList] ");
    var res = MOCK_POLICY_LIST.map(x => ({ id: x.id, name: x.name }));
    cb(res);
}

function backendFetchPolicy(id, cb) {
    Logger.info("[backendFetchPolicy] ");
    var res = MOCK_POLICY_LIST.find(policy => policy.id === id);
    cb(res);
}

function backendCreatePolicy(policy, cb) {
    Logger.info("[backendCreatePolicy] ", policy);
    policy = _.clone(policy);
    policy.id = MOCK_POLICY_INDEX;
    MOCK_POLICY_INDEX++;
    MOCK_POLICY_LIST.push(policy);
    cb(policy);
}
function backendDeletePolicy(id, cb) {
    Logger.info("[backendDeletePolicy] %s", id);
    MOCK_POLICY_LIST = MOCK_POLICY_LIST.filter(x => x.id != id);
    cb();
}
function backendUpdatePolicy(id, config, cb) {
    Logger.info("[backendUpdatePolicy] %s", id, config);
    var policy = _.head(MOCK_POLICY_LIST.filter(x => x.id == id));
    if (policy) {
        policy.name = config.name;
        policy.target = config.target;
        policy.script = config.script;
    }
    cb(policy);
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
          "errorCount": 5,
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
                  "errorCount": 3,
                  "flags": {
                      "shared": true
                  },
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
                  "errorCount": 4,
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

const HISTORY_GRAPH_DATA = {
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
            "errorCount": 2,
            "children": [
                {
                    "rn": "raw-Raw Configs",
                    "name": "Raw Configs",
                    "kind": "raw",
                    "order": 1000,
                    "errorCount": 0,
                    "children": []
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
                    "errorCount": 5,
                    "flags": {
                        "radioactive": true
                    },
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

const HISTORY_TIMELINE = [
    {
        "date": "2020-02-13T03:10:50.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T03:11:51.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T03:12:56.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T03:13:57.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T03:14:58.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T03:16:03.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T03:17:03.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T03:18:03.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T03:19:03.000Z",
        "items": 1160,
        "alerts": 56
    },
    {
        "date": "2020-02-13T03:20:09.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T03:21:10.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T03:22:14.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T03:23:19.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T03:24:21.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T03:25:23.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T03:26:23.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T03:58:16.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:00:58.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:02:03.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:03:03.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:04:05.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:05:07.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:06:15.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:07:16.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:08:17.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:09:17.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:10:18.000Z",
        "items": 1160,
        "alerts": 56
    },
    {
        "date": "2020-02-13T04:11:19.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:12:19.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:13:24.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:14:29.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:15:29.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:16:30.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:17:30.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:18:35.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:19:37.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:20:38.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:21:39.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:22:39.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:23:39.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:24:39.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:25:41.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:26:41.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:27:43.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:28:43.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:29:43.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:30:45.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:31:45.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:32:46.000Z",
        "items": 1160,
        "alerts": 56
    },
    {
        "date": "2020-02-13T04:33:52.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:34:57.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:35:59.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:37:04.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:38:09.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:39:09.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:40:10.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:41:11.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:42:12.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:43:13.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:44:15.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:45:17.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:46:22.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:47:27.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:48:33.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:49:33.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:50:33.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:51:38.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:52:38.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:53:40.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:54:40.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:55:45.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T04:56:46.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:57:48.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:58:49.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T04:59:50.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:00:52.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:01:52.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:02:57.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:03:59.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:05:01.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:06:02.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:07:04.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T05:08:05.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:09:05.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:10:11.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:11:11.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:12:12.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T05:13:13.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:14:13.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:15:19.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:16:21.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:17:26.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:18:31.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:19:32.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:20:33.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:21:34.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:22:37.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:23:37.000Z",
        "items": 1160,
        "alerts": 58
    },
    {
        "date": "2020-02-13T05:24:40.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:25:45.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:26:46.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T05:27:47.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T06:29:51.000Z",
        "items": 1160,
        "alerts": 60
    },
    {
        "date": "2020-02-13T06:48:17.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T06:49:20.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T06:50:26.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T06:51:28.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T06:52:28.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T06:53:29.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T06:54:32.000Z",
        "items": 1160,
        "alerts": 59
    },
    {
        "date": "2020-02-13T06:55:33.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T06:56:38.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T06:57:39.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T06:58:43.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T06:59:43.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T07:00:44.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T07:01:44.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T07:02:50.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T07:03:56.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T07:04:58.000Z",
        "items": 1160,
        "alerts": 61
    },
    {
        "date": "2020-02-13T07:06:00.000Z",
        "items": 1160,
        "alerts": 59
    },
    {
        "date": "2020-02-13T07:07:02.000Z",
        "items": 1260,
        "alerts": 60
    },
    {
        "date": "2020-02-13T07:08:05.000Z",
        "items": 1260,
        "alerts": 60
    },
    {
        "date": "2020-02-13T07:09:32.000Z",
        "items": 1260,
        "alerts": 58
    },
    {
        "date": "2020-02-13T07:10:41.000Z",
        "items": 1260,
        "alerts": 58
    },
    {
        "date": "2020-02-13T07:11:43.000Z",
        "items": 1260,
        "alerts": 56
    },
    {
        "date": "2020-02-13T07:12:43.000Z",
        "items": 1260,
        "alerts": 58
    },
    {
        "date": "2020-02-13T07:13:44.000Z",
        "items": 1260,
        "alerts": 58
    },
    {
        "date": "2020-02-13T07:14:45.000Z",
        "items": 1259,
        "alerts": 57
    },
    {
        "date": "2020-02-14T09:48:15.000Z",
        "items": 248,
        "alerts": 25
    },
    {
        "date": "2020-02-14T10:03:34.000Z",
        "items": 248,
        "alerts": 25
    }
];

const HISTORY_RANGE = {
    "min_date": "2020-02-13T03:10:50.000Z",
    "max_date": "2020-02-14T10:03:34.000Z"
};

const HISTORY_PROPERTIES = {
    "alerts": [
        {
            "id": "Port-3500",
            "msg": "Missing port 3500 definition.",
            "date": "2020-02-29T06:32:57.340Z",
            "severity": "warn"
        }
    ],
    "props": [
        {
            "id": "config",
            "kind": "yaml",
            "title": "Config",
            "config": {
                "kind": "Service",
                "spec": {
                    "type": "ClusterIP",
                    "ports": [
                        {
                            "port": 80,
                            "protocol": "TCP",
                            "targetPort": 3500
                        }
                    ],
                    "selector": {
                        "app": "book-web"
                    },
                    "clusterIP": "10.75.1.215",
                    "sessionAffinity": "None"
                },
                "status": {
                    "loadBalancer": {}
                },
                "metadata": {
                    "uid": "f70267ff-34c1-11ea-9cdc-42010a8001cf",
                    "name": "book-web-svc-2",
                    "labels": {
                        "name": "book-web-svc-2"
                    },
                    "selfLink": "/api/v1/namespaces/book/services/book-web-svc-2",
                    "namespace": "book",
                    "annotations": {
                        "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"v1\",\"kind\":\"Service\",\"metadata\":{\"annotations\":{},\"labels\":{\"name\":\"book-web-svc-2\"},\"name\":\"book-web-svc-2\",\"namespace\":\"book\"},\"spec\":{\"ports\":[{\"port\":80,\"protocol\":\"TCP\",\"targetPort\":3500}],\"selector\":{\"app\":\"book-web\"},\"type\":\"ClusterIP\"}}\n"
                    },
                    "resourceVersion": "206743",
                    "creationTimestamp": "2020-01-11T22:30:26Z"
                },
                "apiVersion": "v1"
            },
            "tooltip": "Kubernetes YAML Configuration"
        }
    ]
};