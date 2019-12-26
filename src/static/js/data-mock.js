function fetchDiagram(cb) {
    Logger.info("[MOCK:fetchDiagram] ");
    cb(GRAPH_DATA);
}

function fetchProperties(node, cb) {
    Logger.info("[MOCK:fetchProperties] ", node.id);
    cb(PROPERTIES_DATA);
}

const GRAPH_DATA = {
    "rn": "root",
    "id": "root",
    "kind": "root",
    "order": 100,
    "children": [
      {
        "rn": "ns-berlioz",
        "name": "berlioz",
        "id": "root/ns-berlioz",
        "kind": "ns",
        "order": 100,
        "children": [
          {
            "rn": "raw-Raw Configs",
            "name": "Raw Configs",
            "id": "root/ns-berlioz/raw-Raw Configs",
            "kind": "raw",
            "order": 1000,
            "children": [
              {
                "rn": "raw-ConfigMaps",
                "name": "ConfigMaps",
                "id": "root/ns-berlioz/raw-Raw Configs/raw-ConfigMaps",
                "kind": "raw",
                "order": 100,
                "children": [
                  {
                    "rn": "configmap-sql-schema",
                    "name": "sql-schema",
                    "id": "root/ns-berlioz/raw-Raw Configs/raw-ConfigMaps/configmap-sql-schema",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "rn": "app-gprod-berlioz-main-ctlr",
            "name": "gprod-berlioz-main-ctlr",
            "id": "root/ns-berlioz/app-gprod-berlioz-main-ctlr",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-Deployment",
                "name": "Deployment",
                "id": "root/ns-berlioz/app-gprod-berlioz-main-ctlr/launcher-Deployment",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-gprod-berlioz-main-ctlr",
                "name": "gprod-berlioz-main-ctlr",
                "id": "root/ns-berlioz/app-gprod-berlioz-main-ctlr/cont-gprod-berlioz-main-ctlr",
                "kind": "cont",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-berlioz/app-gprod-berlioz-main-ctlr/cont-gprod-berlioz-main-ctlr/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "vol-Volumes",
                "name": "Volumes",
                "id": "root/ns-berlioz/app-gprod-berlioz-main-ctlr/vol-Volumes",
                "kind": "vol",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-berlioz/app-gprod-berlioz-main-ctlr/vol-Volumes/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "rn": "app-gprod-berlioz-main-agent",
            "name": "gprod-berlioz-main-agent",
            "id": "root/ns-berlioz/app-gprod-berlioz-main-agent",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-DaemonSet",
                "name": "DaemonSet",
                "id": "root/ns-berlioz/app-gprod-berlioz-main-agent/launcher-DaemonSet",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-gprod-berlioz-main-agent",
                "name": "gprod-berlioz-main-agent",
                "id": "root/ns-berlioz/app-gprod-berlioz-main-agent/cont-gprod-berlioz-main-agent",
                "kind": "cont",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-berlioz/app-gprod-berlioz-main-agent/cont-gprod-berlioz-main-agent/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "vol-var-run-docker-sock",
                    "name": "var-run-docker-sock",
                    "id": "root/ns-berlioz/app-gprod-berlioz-main-agent/cont-gprod-berlioz-main-agent/vol-var-run-docker-sock",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "vol-Volumes",
                "name": "Volumes",
                "id": "root/ns-berlioz/app-gprod-berlioz-main-agent/vol-Volumes",
                "kind": "vol",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-berlioz/app-gprod-berlioz-main-agent/vol-Volumes/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "vol-var-run-docker-sock",
                    "name": "var-run-docker-sock",
                    "id": "root/ns-berlioz/app-gprod-berlioz-main-agent/vol-Volumes/vol-var-run-docker-sock",
                    "kind": "vol",
                    "order": 100,
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
        "id": "root/ns-default",
        "kind": "ns",
        "order": 100,
        "children": [
          {
            "rn": "raw-Raw Configs",
            "name": "Raw Configs",
            "id": "root/ns-default/raw-Raw Configs",
            "kind": "raw",
            "order": 1000,
            "children": [
              {
                "rn": "raw-Services",
                "name": "Services",
                "id": "root/ns-default/raw-Raw Configs/raw-Services",
                "kind": "raw",
                "order": 100,
                "children": [
                  {
                    "rn": "service-kubernetes",
                    "name": "kubernetes",
                    "id": "root/ns-default/raw-Raw Configs/raw-Services/service-kubernetes",
                    "kind": "service",
                    "order": 100,
                    "children": []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "rn": "ns-istio-system",
        "name": "istio-system",
        "id": "root/ns-istio-system",
        "kind": "ns",
        "order": 100,
        "children": [
          {
            "rn": "raw-Raw Configs",
            "name": "Raw Configs",
            "id": "root/ns-istio-system/raw-Raw Configs",
            "kind": "raw",
            "order": 1000,
            "children": [
              {
                "rn": "raw-ConfigMaps",
                "name": "ConfigMaps",
                "id": "root/ns-istio-system/raw-Raw Configs/raw-ConfigMaps",
                "kind": "raw",
                "order": 100,
                "children": [
                  {
                    "rn": "configmap-istio-crd-10",
                    "name": "istio-crd-10",
                    "id": "root/ns-istio-system/raw-Raw Configs/raw-ConfigMaps/configmap-istio-crd-10",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-istio-crd-11",
                    "name": "istio-crd-11",
                    "id": "root/ns-istio-system/raw-Raw Configs/raw-ConfigMaps/configmap-istio-crd-11",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-istio-crd-12",
                    "name": "istio-crd-12",
                    "id": "root/ns-istio-system/raw-Raw Configs/raw-ConfigMaps/configmap-istio-crd-12",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-istio-galley-configuration",
                    "name": "istio-galley-configuration",
                    "id": "root/ns-istio-system/raw-Raw Configs/raw-ConfigMaps/configmap-istio-galley-configuration",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-istio-security-custom-resources",
                    "name": "istio-security-custom-resources",
                    "id": "root/ns-istio-system/raw-Raw Configs/raw-ConfigMaps/configmap-istio-security-custom-resources",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-istio-security",
                    "name": "istio-security",
                    "id": "root/ns-istio-system/raw-Raw Configs/raw-ConfigMaps/configmap-istio-security",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-istio-sidecar-injector",
                    "name": "istio-sidecar-injector",
                    "id": "root/ns-istio-system/raw-Raw Configs/raw-ConfigMaps/configmap-istio-sidecar-injector",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-istio",
                    "name": "istio",
                    "id": "root/ns-istio-system/raw-Raw Configs/raw-ConfigMaps/configmap-istio",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-prometheus",
                    "name": "prometheus",
                    "id": "root/ns-istio-system/raw-Raw Configs/raw-ConfigMaps/configmap-prometheus",
                    "kind": "configmap",
                    "order": 100,
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
        "id": "root/ns-kube-public",
        "kind": "ns",
        "order": 100,
        "children": []
      },
      {
        "rn": "ns-kube-system",
        "name": "kube-system",
        "id": "root/ns-kube-system",
        "kind": "ns",
        "order": 100,
        "children": [
          {
            "rn": "raw-Raw Configs",
            "name": "Raw Configs",
            "id": "root/ns-kube-system/raw-Raw Configs",
            "kind": "raw",
            "order": 1000,
            "children": [
              {
                "rn": "raw-ConfigMaps",
                "name": "ConfigMaps",
                "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps",
                "kind": "raw",
                "order": 100,
                "children": [
                  {
                    "rn": "configmap-berlioz.v1",
                    "name": "berlioz.v1",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps/configmap-berlioz.v1",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-cluster-autoscaler-status",
                    "name": "cluster-autoscaler-status",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps/configmap-cluster-autoscaler-status",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-extension-apiserver-authentication",
                    "name": "extension-apiserver-authentication",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps/configmap-extension-apiserver-authentication",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-fluentd-gcp-config-old-v1.2.5",
                    "name": "fluentd-gcp-config-old-v1.2.5",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps/configmap-fluentd-gcp-config-old-v1.2.5",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-fluentd-gcp-config-v1.2.5",
                    "name": "fluentd-gcp-config-v1.2.5",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps/configmap-fluentd-gcp-config-v1.2.5",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-gke-common-webhook-lock",
                    "name": "gke-common-webhook-lock",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps/configmap-gke-common-webhook-lock",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-heapster-config",
                    "name": "heapster-config",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps/configmap-heapster-config",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-ingress-gce-lock",
                    "name": "ingress-gce-lock",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps/configmap-ingress-gce-lock",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-ingress-uid",
                    "name": "ingress-uid",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps/configmap-ingress-uid",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-istio-init.v1",
                    "name": "istio-init.v1",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps/configmap-istio-init.v1",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-istio.v1",
                    "name": "istio.v1",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps/configmap-istio.v1",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-kube-dns-autoscaler",
                    "name": "kube-dns-autoscaler",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps/configmap-kube-dns-autoscaler",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-kube-dns",
                    "name": "kube-dns",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps/configmap-kube-dns",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "configmap-metrics-server-config",
                    "name": "metrics-server-config",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-ConfigMaps/configmap-metrics-server-config",
                    "kind": "configmap",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "raw-Services",
                "name": "Services",
                "id": "root/ns-kube-system/raw-Raw Configs/raw-Services",
                "kind": "raw",
                "order": 100,
                "children": [
                  {
                    "rn": "service-default-http-backend",
                    "name": "default-http-backend",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-Services/service-default-http-backend",
                    "kind": "service",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "service-heapster",
                    "name": "heapster",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-Services/service-heapster",
                    "kind": "service",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "service-kube-dns",
                    "name": "kube-dns",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-Services/service-kube-dns",
                    "kind": "service",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "service-metrics-server",
                    "name": "metrics-server",
                    "id": "root/ns-kube-system/raw-Raw Configs/raw-Services/service-metrics-server",
                    "kind": "service",
                    "order": 100,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "rn": "app-event-exporter-v0.2.4",
            "name": "event-exporter-v0.2.4",
            "id": "root/ns-kube-system/app-event-exporter-v0.2.4",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-Deployment",
                "name": "Deployment",
                "id": "root/ns-kube-system/app-event-exporter-v0.2.4/launcher-Deployment",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-event-exporter",
                "name": "event-exporter",
                "id": "root/ns-kube-system/app-event-exporter-v0.2.4/cont-event-exporter",
                "kind": "cont",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-prometheus-to-sd-exporter",
                "name": "prometheus-to-sd-exporter",
                "id": "root/ns-kube-system/app-event-exporter-v0.2.4/cont-prometheus-to-sd-exporter",
                "kind": "cont",
                "order": 100,
                "children": []
              },
              {
                "rn": "vol-Volumes",
                "name": "Volumes",
                "id": "root/ns-kube-system/app-event-exporter-v0.2.4/vol-Volumes",
                "kind": "vol",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-ssl-certs",
                    "name": "ssl-certs",
                    "id": "root/ns-kube-system/app-event-exporter-v0.2.4/vol-Volumes/vol-ssl-certs",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "rn": "app-fluentd-gcp-scaler",
            "name": "fluentd-gcp-scaler",
            "id": "root/ns-kube-system/app-fluentd-gcp-scaler",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-Deployment",
                "name": "Deployment",
                "id": "root/ns-kube-system/app-fluentd-gcp-scaler/launcher-Deployment",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-fluentd-gcp-scaler",
                "name": "fluentd-gcp-scaler",
                "id": "root/ns-kube-system/app-fluentd-gcp-scaler/cont-fluentd-gcp-scaler",
                "kind": "cont",
                "order": 100,
                "children": []
              }
            ]
          },
          {
            "rn": "app-heapster",
            "name": "heapster",
            "id": "root/ns-kube-system/app-heapster",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-Deployment",
                "name": "Deployment",
                "id": "root/ns-kube-system/app-heapster/launcher-Deployment",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-heapster",
                "name": "heapster",
                "id": "root/ns-kube-system/app-heapster/cont-heapster",
                "kind": "cont",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-prom-to-sd",
                "name": "prom-to-sd",
                "id": "root/ns-kube-system/app-heapster/cont-prom-to-sd",
                "kind": "cont",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-heapster-nanny",
                "name": "heapster-nanny",
                "id": "root/ns-kube-system/app-heapster/cont-heapster-nanny",
                "kind": "cont",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-heapster-config-volume",
                    "name": "heapster-config-volume",
                    "id": "root/ns-kube-system/app-heapster/cont-heapster-nanny/vol-heapster-config-volume",
                    "kind": "vol",
                    "order": 100,
                    "children": [
                      {
                        "rn": "configmap-heapster-config",
                        "name": "heapster-config",
                        "id": "root/ns-kube-system/app-heapster/cont-heapster-nanny/vol-heapster-config-volume/configmap-heapster-config",
                        "kind": "configmap",
                        "order": 100,
                        "children": []
                      }
                    ]
                  }
                ]
              },
              {
                "rn": "vol-Volumes",
                "name": "Volumes",
                "id": "root/ns-kube-system/app-heapster/vol-Volumes",
                "kind": "vol",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-heapster-config-volume",
                    "name": "heapster-config-volume",
                    "id": "root/ns-kube-system/app-heapster/vol-Volumes/vol-heapster-config-volume",
                    "kind": "vol",
                    "order": 100,
                    "children": [
                      {
                        "rn": "configmap-heapster-config",
                        "name": "heapster-config",
                        "id": "root/ns-kube-system/app-heapster/vol-Volumes/vol-heapster-config-volume/configmap-heapster-config",
                        "kind": "configmap",
                        "order": 100,
                        "children": []
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "rn": "app-kube-dns-autoscaler",
            "name": "kube-dns-autoscaler",
            "id": "root/ns-kube-system/app-kube-dns-autoscaler",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-Deployment",
                "name": "Deployment",
                "id": "root/ns-kube-system/app-kube-dns-autoscaler/launcher-Deployment",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-autoscaler",
                "name": "autoscaler",
                "id": "root/ns-kube-system/app-kube-dns-autoscaler/cont-autoscaler",
                "kind": "cont",
                "order": 100,
                "children": []
              }
            ]
          },
          {
            "rn": "app-kube-dns",
            "name": "kube-dns",
            "id": "root/ns-kube-system/app-kube-dns",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-Deployment",
                "name": "Deployment",
                "id": "root/ns-kube-system/app-kube-dns/launcher-Deployment",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-kubedns",
                "name": "kubedns",
                "id": "root/ns-kube-system/app-kube-dns/cont-kubedns",
                "kind": "cont",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-kube-dns-config",
                    "name": "kube-dns-config",
                    "id": "root/ns-kube-system/app-kube-dns/cont-kubedns/vol-kube-dns-config",
                    "kind": "vol",
                    "order": 100,
                    "children": [
                      {
                        "rn": "configmap-kube-dns",
                        "name": "kube-dns",
                        "id": "root/ns-kube-system/app-kube-dns/cont-kubedns/vol-kube-dns-config/configmap-kube-dns",
                        "kind": "configmap",
                        "order": 100,
                        "children": []
                      }
                    ]
                  }
                ]
              },
              {
                "rn": "cont-dnsmasq",
                "name": "dnsmasq",
                "id": "root/ns-kube-system/app-kube-dns/cont-dnsmasq",
                "kind": "cont",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-kube-dns-config",
                    "name": "kube-dns-config",
                    "id": "root/ns-kube-system/app-kube-dns/cont-dnsmasq/vol-kube-dns-config",
                    "kind": "vol",
                    "order": 100,
                    "children": [
                      {
                        "rn": "configmap-kube-dns",
                        "name": "kube-dns",
                        "id": "root/ns-kube-system/app-kube-dns/cont-dnsmasq/vol-kube-dns-config/configmap-kube-dns",
                        "kind": "configmap",
                        "order": 100,
                        "children": []
                      }
                    ]
                  }
                ]
              },
              {
                "rn": "cont-sidecar",
                "name": "sidecar",
                "id": "root/ns-kube-system/app-kube-dns/cont-sidecar",
                "kind": "cont",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-prometheus-to-sd",
                "name": "prometheus-to-sd",
                "id": "root/ns-kube-system/app-kube-dns/cont-prometheus-to-sd",
                "kind": "cont",
                "order": 100,
                "children": []
              },
              {
                "rn": "vol-Volumes",
                "name": "Volumes",
                "id": "root/ns-kube-system/app-kube-dns/vol-Volumes",
                "kind": "vol",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-kube-dns-config",
                    "name": "kube-dns-config",
                    "id": "root/ns-kube-system/app-kube-dns/vol-Volumes/vol-kube-dns-config",
                    "kind": "vol",
                    "order": 100,
                    "children": [
                      {
                        "rn": "configmap-kube-dns",
                        "name": "kube-dns",
                        "id": "root/ns-kube-system/app-kube-dns/vol-Volumes/vol-kube-dns-config/configmap-kube-dns",
                        "kind": "configmap",
                        "order": 100,
                        "children": []
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "rn": "app-l7-default-backend",
            "name": "l7-default-backend",
            "id": "root/ns-kube-system/app-l7-default-backend",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-Deployment",
                "name": "Deployment",
                "id": "root/ns-kube-system/app-l7-default-backend/launcher-Deployment",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-default-http-backend",
                "name": "default-http-backend",
                "id": "root/ns-kube-system/app-l7-default-backend/cont-default-http-backend",
                "kind": "cont",
                "order": 100,
                "children": []
              }
            ]
          },
          {
            "rn": "app-metrics-server-v0.3.1",
            "name": "metrics-server-v0.3.1",
            "id": "root/ns-kube-system/app-metrics-server-v0.3.1",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-Deployment",
                "name": "Deployment",
                "id": "root/ns-kube-system/app-metrics-server-v0.3.1/launcher-Deployment",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-metrics-server",
                "name": "metrics-server",
                "id": "root/ns-kube-system/app-metrics-server-v0.3.1/cont-metrics-server",
                "kind": "cont",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-metrics-server-nanny",
                "name": "metrics-server-nanny",
                "id": "root/ns-kube-system/app-metrics-server-v0.3.1/cont-metrics-server-nanny",
                "kind": "cont",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-metrics-server-config-volume",
                    "name": "metrics-server-config-volume",
                    "id": "root/ns-kube-system/app-metrics-server-v0.3.1/cont-metrics-server-nanny/vol-metrics-server-config-volume",
                    "kind": "vol",
                    "order": 100,
                    "children": [
                      {
                        "rn": "configmap-metrics-server-config",
                        "name": "metrics-server-config",
                        "id": "root/ns-kube-system/app-metrics-server-v0.3.1/cont-metrics-server-nanny/vol-metrics-server-config-volume/configmap-metrics-server-config",
                        "kind": "configmap",
                        "order": 100,
                        "children": []
                      }
                    ]
                  }
                ]
              },
              {
                "rn": "vol-Volumes",
                "name": "Volumes",
                "id": "root/ns-kube-system/app-metrics-server-v0.3.1/vol-Volumes",
                "kind": "vol",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-metrics-server-config-volume",
                    "name": "metrics-server-config-volume",
                    "id": "root/ns-kube-system/app-metrics-server-v0.3.1/vol-Volumes/vol-metrics-server-config-volume",
                    "kind": "vol",
                    "order": 100,
                    "children": [
                      {
                        "rn": "configmap-metrics-server-config",
                        "name": "metrics-server-config",
                        "id": "root/ns-kube-system/app-metrics-server-v0.3.1/vol-Volumes/vol-metrics-server-config-volume/configmap-metrics-server-config",
                        "kind": "configmap",
                        "order": 100,
                        "children": []
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "rn": "app-fluentd-gcp-v3.2.0",
            "name": "fluentd-gcp-v3.2.0",
            "id": "root/ns-kube-system/app-fluentd-gcp-v3.2.0",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-DaemonSet",
                "name": "DaemonSet",
                "id": "root/ns-kube-system/app-fluentd-gcp-v3.2.0/launcher-DaemonSet",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-fluentd-gcp",
                "name": "fluentd-gcp",
                "id": "root/ns-kube-system/app-fluentd-gcp-v3.2.0/cont-fluentd-gcp",
                "kind": "cont",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-varlog",
                    "name": "varlog",
                    "id": "root/ns-kube-system/app-fluentd-gcp-v3.2.0/cont-fluentd-gcp/vol-varlog",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "vol-varlibdockercontainers",
                    "name": "varlibdockercontainers",
                    "id": "root/ns-kube-system/app-fluentd-gcp-v3.2.0/cont-fluentd-gcp/vol-varlibdockercontainers",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "vol-config-volume",
                    "name": "config-volume",
                    "id": "root/ns-kube-system/app-fluentd-gcp-v3.2.0/cont-fluentd-gcp/vol-config-volume",
                    "kind": "vol",
                    "order": 100,
                    "children": [
                      {
                        "rn": "configmap-fluentd-gcp-config-old-v1.2.5",
                        "name": "fluentd-gcp-config-old-v1.2.5",
                        "id": "root/ns-kube-system/app-fluentd-gcp-v3.2.0/cont-fluentd-gcp/vol-config-volume/configmap-fluentd-gcp-config-old-v1.2.5",
                        "kind": "configmap",
                        "order": 100,
                        "children": []
                      }
                    ]
                  }
                ]
              },
              {
                "rn": "cont-prometheus-to-sd-exporter",
                "name": "prometheus-to-sd-exporter",
                "id": "root/ns-kube-system/app-fluentd-gcp-v3.2.0/cont-prometheus-to-sd-exporter",
                "kind": "cont",
                "order": 100,
                "children": []
              },
              {
                "rn": "vol-Volumes",
                "name": "Volumes",
                "id": "root/ns-kube-system/app-fluentd-gcp-v3.2.0/vol-Volumes",
                "kind": "vol",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-varlog",
                    "name": "varlog",
                    "id": "root/ns-kube-system/app-fluentd-gcp-v3.2.0/vol-Volumes/vol-varlog",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "vol-varlibdockercontainers",
                    "name": "varlibdockercontainers",
                    "id": "root/ns-kube-system/app-fluentd-gcp-v3.2.0/vol-Volumes/vol-varlibdockercontainers",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "vol-config-volume",
                    "name": "config-volume",
                    "id": "root/ns-kube-system/app-fluentd-gcp-v3.2.0/vol-Volumes/vol-config-volume",
                    "kind": "vol",
                    "order": 100,
                    "children": [
                      {
                        "rn": "configmap-fluentd-gcp-config-old-v1.2.5",
                        "name": "fluentd-gcp-config-old-v1.2.5",
                        "id": "root/ns-kube-system/app-fluentd-gcp-v3.2.0/vol-Volumes/vol-config-volume/configmap-fluentd-gcp-config-old-v1.2.5",
                        "kind": "configmap",
                        "order": 100,
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
            "id": "root/ns-kube-system/app-metadata-proxy-v0.1",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-DaemonSet",
                "name": "DaemonSet",
                "id": "root/ns-kube-system/app-metadata-proxy-v0.1/launcher-DaemonSet",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-metadata-proxy",
                "name": "metadata-proxy",
                "id": "root/ns-kube-system/app-metadata-proxy-v0.1/cont-metadata-proxy",
                "kind": "cont",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-prometheus-to-sd-exporter",
                "name": "prometheus-to-sd-exporter",
                "id": "root/ns-kube-system/app-metadata-proxy-v0.1/cont-prometheus-to-sd-exporter",
                "kind": "cont",
                "order": 100,
                "children": []
              }
            ]
          },
          {
            "rn": "app-nvidia-gpu-device-plugin",
            "name": "nvidia-gpu-device-plugin",
            "id": "root/ns-kube-system/app-nvidia-gpu-device-plugin",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-DaemonSet",
                "name": "DaemonSet",
                "id": "root/ns-kube-system/app-nvidia-gpu-device-plugin/launcher-DaemonSet",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-nvidia-gpu-device-plugin",
                "name": "nvidia-gpu-device-plugin",
                "id": "root/ns-kube-system/app-nvidia-gpu-device-plugin/cont-nvidia-gpu-device-plugin",
                "kind": "cont",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-device-plugin",
                    "name": "device-plugin",
                    "id": "root/ns-kube-system/app-nvidia-gpu-device-plugin/cont-nvidia-gpu-device-plugin/vol-device-plugin",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "vol-dev",
                    "name": "dev",
                    "id": "root/ns-kube-system/app-nvidia-gpu-device-plugin/cont-nvidia-gpu-device-plugin/vol-dev",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "vol-Volumes",
                "name": "Volumes",
                "id": "root/ns-kube-system/app-nvidia-gpu-device-plugin/vol-Volumes",
                "kind": "vol",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-device-plugin",
                    "name": "device-plugin",
                    "id": "root/ns-kube-system/app-nvidia-gpu-device-plugin/vol-Volumes/vol-device-plugin",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "vol-dev",
                    "name": "dev",
                    "id": "root/ns-kube-system/app-nvidia-gpu-device-plugin/vol-Volumes/vol-dev",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "rn": "app-prometheus-to-sd",
            "name": "prometheus-to-sd",
            "id": "root/ns-kube-system/app-prometheus-to-sd",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-DaemonSet",
                "name": "DaemonSet",
                "id": "root/ns-kube-system/app-prometheus-to-sd/launcher-DaemonSet",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-prometheus-to-sd",
                "name": "prometheus-to-sd",
                "id": "root/ns-kube-system/app-prometheus-to-sd/cont-prometheus-to-sd",
                "kind": "cont",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-prometheus-to-sd-new-model",
                "name": "prometheus-to-sd-new-model",
                "id": "root/ns-kube-system/app-prometheus-to-sd/cont-prometheus-to-sd-new-model",
                "kind": "cont",
                "order": 100,
                "children": []
              }
            ]
          }
        ]
      },
      {
        "rn": "ns-addr",
        "name": "addr",
        "id": "root/ns-addr",
        "kind": "ns",
        "order": 100,
        "children": [
          {
            "rn": "app-gprod-addr-main-app",
            "name": "gprod-addr-main-app",
            "id": "root/ns-addr/app-gprod-addr-main-app",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-Deployment",
                "name": "Deployment",
                "id": "root/ns-addr/app-gprod-addr-main-app/launcher-Deployment",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-gprod-addr-main-app",
                "name": "gprod-addr-main-app",
                "id": "root/ns-addr/app-gprod-addr-main-app/cont-gprod-addr-main-app",
                "kind": "cont",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-addr/app-gprod-addr-main-app/cont-gprod-addr-main-app/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "vol-gprod-addr-main-app-consumes",
                    "name": "gprod-addr-main-app-consumes",
                    "id": "root/ns-addr/app-gprod-addr-main-app/cont-gprod-addr-main-app/vol-gprod-addr-main-app-consumes",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "vol-gprod-addr-main-app-consumesdatabase",
                    "name": "gprod-addr-main-app-consumesdatabase",
                    "id": "root/ns-addr/app-gprod-addr-main-app/cont-gprod-addr-main-app/vol-gprod-addr-main-app-consumesdatabase",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "cont-cloudsql-proxy-gprod-addr-uswest1c-main-book",
                "name": "cloudsql-proxy-gprod-addr-uswest1c-main-book",
                "id": "root/ns-addr/app-gprod-addr-main-app/cont-cloudsql-proxy-gprod-addr-uswest1c-main-book",
                "kind": "cont",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-addr/app-gprod-addr-main-app/cont-cloudsql-proxy-gprod-addr-uswest1c-main-book/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "vol-Volumes",
                "name": "Volumes",
                "id": "root/ns-addr/app-gprod-addr-main-app/vol-Volumes",
                "kind": "vol",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-addr/app-gprod-addr-main-app/vol-Volumes/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "vol-gprod-addr-main-app-consumes",
                    "name": "gprod-addr-main-app-consumes",
                    "id": "root/ns-addr/app-gprod-addr-main-app/vol-Volumes/vol-gprod-addr-main-app-consumes",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "vol-gprod-addr-main-app-consumesdatabase",
                    "name": "gprod-addr-main-app-consumesdatabase",
                    "id": "root/ns-addr/app-gprod-addr-main-app/vol-Volumes/vol-gprod-addr-main-app-consumesdatabase",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "service-Service",
                "name": "Service",
                "id": "root/ns-addr/app-gprod-addr-main-app/service-Service",
                "kind": "service",
                "order": 200,
                "children": []
              }
            ]
          },
          {
            "rn": "app-gprod-addr-main-web",
            "name": "gprod-addr-main-web",
            "id": "root/ns-addr/app-gprod-addr-main-web",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-Deployment",
                "name": "Deployment",
                "id": "root/ns-addr/app-gprod-addr-main-web/launcher-Deployment",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-gprod-addr-main-web",
                "name": "gprod-addr-main-web",
                "id": "root/ns-addr/app-gprod-addr-main-web/cont-gprod-addr-main-web",
                "kind": "cont",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-addr/app-gprod-addr-main-web/cont-gprod-addr-main-web/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "vol-Volumes",
                "name": "Volumes",
                "id": "root/ns-addr/app-gprod-addr-main-web/vol-Volumes",
                "kind": "vol",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-addr/app-gprod-addr-main-web/vol-Volumes/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "service-Service",
                "name": "Service",
                "id": "root/ns-addr/app-gprod-addr-main-web/service-Service",
                "kind": "service",
                "order": 200,
                "children": []
              }
            ]
          },
          {
            "rn": "raw-Raw Configs",
            "name": "Raw Configs",
            "id": "root/ns-addr/raw-Raw Configs",
            "kind": "raw",
            "order": 1000,
            "children": [
              {
                "rn": "raw-Services",
                "name": "Services",
                "id": "root/ns-addr/raw-Raw Configs/raw-Services",
                "kind": "raw",
                "order": 100,
                "children": [
                  {
                    "rn": "service-gprod-addr-main-app-default",
                    "name": "gprod-addr-main-app-default",
                    "id": "root/ns-addr/raw-Raw Configs/raw-Services/service-gprod-addr-main-app-default",
                    "kind": "service",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "service-gprod-addr-main-web-default",
                    "name": "gprod-addr-main-web-default",
                    "id": "root/ns-addr/raw-Raw Configs/raw-Services/service-gprod-addr-main-web-default",
                    "kind": "service",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "raw-Ingresses",
                "name": "Ingresses",
                "id": "root/ns-addr/raw-Raw Configs/raw-Ingresses",
                "kind": "raw",
                "order": 100,
                "children": [
                  {
                    "rn": "ingress-gprod-addr-web",
                    "name": "gprod-addr-web",
                    "id": "root/ns-addr/raw-Raw Configs/raw-Ingresses/ingress-gprod-addr-web",
                    "kind": "ingress",
                    "order": 100,
                    "children": []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "rn": "ns-sprt",
        "name": "sprt",
        "id": "root/ns-sprt",
        "kind": "ns",
        "order": 100,
        "children": [
          {
            "rn": "app-gprod-sprt-main-dtrace",
            "name": "gprod-sprt-main-dtrace",
            "id": "root/ns-sprt/app-gprod-sprt-main-dtrace",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-Deployment",
                "name": "Deployment",
                "id": "root/ns-sprt/app-gprod-sprt-main-dtrace/launcher-Deployment",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-gprod-sprt-main-dtrace",
                "name": "gprod-sprt-main-dtrace",
                "id": "root/ns-sprt/app-gprod-sprt-main-dtrace/cont-gprod-sprt-main-dtrace",
                "kind": "cont",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-sprt/app-gprod-sprt-main-dtrace/cont-gprod-sprt-main-dtrace/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "vol-Volumes",
                "name": "Volumes",
                "id": "root/ns-sprt/app-gprod-sprt-main-dtrace/vol-Volumes",
                "kind": "vol",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-sprt/app-gprod-sprt-main-dtrace/vol-Volumes/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "service-Service",
                "name": "Service",
                "id": "root/ns-sprt/app-gprod-sprt-main-dtrace/service-Service",
                "kind": "service",
                "order": 200,
                "children": []
              },
              {
                "rn": "service-Service [object Object]1",
                "name": "Service [object Object]1",
                "id": "root/ns-sprt/app-gprod-sprt-main-dtrace/service-Service [object Object]1",
                "kind": "service",
                "order": 200,
                "children": []
              }
            ]
          },
          {
            "rn": "app-gprod-sprt-main-grfna",
            "name": "gprod-sprt-main-grfna",
            "id": "root/ns-sprt/app-gprod-sprt-main-grfna",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-Deployment",
                "name": "Deployment",
                "id": "root/ns-sprt/app-gprod-sprt-main-grfna/launcher-Deployment",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-gprod-sprt-main-grfna",
                "name": "gprod-sprt-main-grfna",
                "id": "root/ns-sprt/app-gprod-sprt-main-grfna/cont-gprod-sprt-main-grfna",
                "kind": "cont",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-sprt/app-gprod-sprt-main-grfna/cont-gprod-sprt-main-grfna/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "vol-Volumes",
                "name": "Volumes",
                "id": "root/ns-sprt/app-gprod-sprt-main-grfna/vol-Volumes",
                "kind": "vol",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-sprt/app-gprod-sprt-main-grfna/vol-Volumes/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "service-Service",
                "name": "Service",
                "id": "root/ns-sprt/app-gprod-sprt-main-grfna/service-Service",
                "kind": "service",
                "order": 200,
                "children": []
              }
            ]
          },
          {
            "rn": "app-gprod-sprt-main-prmts",
            "name": "gprod-sprt-main-prmts",
            "id": "root/ns-sprt/app-gprod-sprt-main-prmts",
            "kind": "app",
            "order": 100,
            "children": [
              {
                "rn": "launcher-Deployment",
                "name": "Deployment",
                "id": "root/ns-sprt/app-gprod-sprt-main-prmts/launcher-Deployment",
                "kind": "launcher",
                "order": 100,
                "children": []
              },
              {
                "rn": "cont-gprod-sprt-main-prmts",
                "name": "gprod-sprt-main-prmts",
                "id": "root/ns-sprt/app-gprod-sprt-main-prmts/cont-gprod-sprt-main-prmts",
                "kind": "cont",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-sprt/app-gprod-sprt-main-prmts/cont-gprod-sprt-main-prmts/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "vol-Volumes",
                "name": "Volumes",
                "id": "root/ns-sprt/app-gprod-sprt-main-prmts/vol-Volumes",
                "kind": "vol",
                "order": 100,
                "children": [
                  {
                    "rn": "vol-google-cloud-key",
                    "name": "google-cloud-key",
                    "id": "root/ns-sprt/app-gprod-sprt-main-prmts/vol-Volumes/vol-google-cloud-key",
                    "kind": "vol",
                    "order": 100,
                    "children": []
                  }
                ]
              },
              {
                "rn": "service-Service",
                "name": "Service",
                "id": "root/ns-sprt/app-gprod-sprt-main-prmts/service-Service",
                "kind": "service",
                "order": 200,
                "children": []
              },
              {
                "rn": "service-Service [object Object]1",
                "name": "Service [object Object]1",
                "id": "root/ns-sprt/app-gprod-sprt-main-prmts/service-Service [object Object]1",
                "kind": "service",
                "order": 200,
                "children": []
              }
            ]
          },
          {
            "rn": "raw-Raw Configs",
            "name": "Raw Configs",
            "id": "root/ns-sprt/raw-Raw Configs",
            "kind": "raw",
            "order": 1000,
            "children": [
              {
                "rn": "raw-Services",
                "name": "Services",
                "id": "root/ns-sprt/raw-Raw Configs/raw-Services",
                "kind": "raw",
                "order": 100,
                "children": [
                  {
                    "rn": "service-gprod-sprt-main-dtrace-client",
                    "name": "gprod-sprt-main-dtrace-client",
                    "id": "root/ns-sprt/raw-Raw Configs/raw-Services/service-gprod-sprt-main-dtrace-client",
                    "kind": "service",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "service-gprod-sprt-main-dtrace-web",
                    "name": "gprod-sprt-main-dtrace-web",
                    "id": "root/ns-sprt/raw-Raw Configs/raw-Services/service-gprod-sprt-main-dtrace-web",
                    "kind": "service",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "service-gprod-sprt-main-grfna-default",
                    "name": "gprod-sprt-main-grfna-default",
                    "id": "root/ns-sprt/raw-Raw Configs/raw-Services/service-gprod-sprt-main-grfna-default",
                    "kind": "service",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "service-gprod-sprt-main-prmts-push",
                    "name": "gprod-sprt-main-prmts-push",
                    "id": "root/ns-sprt/raw-Raw Configs/raw-Services/service-gprod-sprt-main-prmts-push",
                    "kind": "service",
                    "order": 100,
                    "children": []
                  },
                  {
                    "rn": "service-gprod-sprt-main-prmts-server",
                    "name": "gprod-sprt-main-prmts-server",
                    "id": "root/ns-sprt/raw-Raw Configs/raw-Services/service-gprod-sprt-main-prmts-server",
                    "kind": "service",
                    "order": 100,
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
;

const PROPERTIES_DATA =[
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
