{
  "fileFormat": 2,
  "featureLevel": 103,
  "creator": "zap",
  "keyValuePairs": [
    {
      "key": "commandDiscovery",
      "value": "1"
    },
    {
      "key": "defaultResponsePolicy",
      "value": "always"
    },
    {
      "key": "manufacturerCodes",
      "value": "0x1002"
    }
  ],
  "package": [
    {
      "pathRelativity": "relativeToZap",
      "path": "../../../zcl-builtin/matter/zcl.json",
      "type": "zcl-properties",
      "category": "matter",
      "version": 1,
      "description": "Matter SDK ZCL data"
    },
    {
      "pathRelativity": "relativeToZap",
      "path": "../../gen-template/matter/gen-test.json",
      "type": "gen-templates-json",
      "category": "matter",
      "version": "test-matter"
    },
    {
      "pathRelativity": "relativeToZap",
      "path": "matter-custom.xml",
      "type": "zcl-xml-standalone"
    }
  ],
  "endpointTypes": [
    {
      "id": 1,
      "name": "Anonymous Endpoint Type",
      "deviceTypeRef": {
        "code": 256,
        "profileId": 259,
        "label": "MA-onofflight",
        "name": "MA-onofflight"
      },
      "deviceTypes": [
        {
          "code": 256,
          "profileId": 259,
          "label": "MA-onofflight",
          "name": "MA-onofflight"
        }
      ],
      "deviceVersions": [
        1
      ],
      "deviceIdentifiers": [
        256
      ],
      "deviceTypeName": "MA-onofflight",
      "deviceTypeCode": 256,
      "deviceTypeProfileId": 259,
      "clusters": [
        {
          "name": "Identify",
          "code": 3,
          "mfgCode": null,
          "define": "IDENTIFY_CLUSTER",
          "side": "server",
          "enabled": 1,
          "commands": [
            {
              "name": "Identify",
              "code": 0,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "TriggerEffect",
              "code": 64,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            }
          ],
          "attributes": [
            {
              "name": "IdentifyTime",
              "code": 0,
              "mfgCode": null,
              "side": "server",
              "type": "int16u",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0x0",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "IdentifyType",
              "code": 1,
              "mfgCode": null,
              "side": "server",
              "type": "enum8",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0x0",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "GeneratedCommandList",
              "code": 65528,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "AcceptedCommandList",
              "code": 65529,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "EventList",
              "code": 65530,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "AttributeList",
              "code": 65531,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "FeatureMap",
              "code": 65532,
              "mfgCode": null,
              "side": "server",
              "type": "bitmap32",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "ClusterRevision",
              "code": 65533,
              "mfgCode": null,
              "side": "server",
              "type": "int16u",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "4",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            }
          ]
        },
        {
          "name": "Groups",
          "code": 4,
          "mfgCode": null,
          "define": "GROUPS_CLUSTER",
          "side": "server",
          "enabled": 1,
          "commands": [
            {
              "name": "AddGroup",
              "code": 0,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "AddGroupResponse",
              "code": 0,
              "mfgCode": null,
              "source": "server",
              "isIncoming": 0,
              "isEnabled": 1
            },
            {
              "name": "ViewGroup",
              "code": 1,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "ViewGroupResponse",
              "code": 1,
              "mfgCode": null,
              "source": "server",
              "isIncoming": 0,
              "isEnabled": 1
            },
            {
              "name": "GetGroupMembershipResponse",
              "code": 2,
              "mfgCode": null,
              "source": "server",
              "isIncoming": 0,
              "isEnabled": 1
            },
            {
              "name": "GetGroupMembership",
              "code": 2,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "RemoveGroup",
              "code": 3,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "RemoveGroupResponse",
              "code": 3,
              "mfgCode": null,
              "source": "server",
              "isIncoming": 0,
              "isEnabled": 1
            },
            {
              "name": "RemoveAllGroups",
              "code": 4,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "AddGroupIfIdentifying",
              "code": 5,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            }
          ],
          "attributes": [
            {
              "name": "NameSupport",
              "code": 0,
              "mfgCode": null,
              "side": "server",
              "type": "bitmap8",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "GeneratedCommandList",
              "code": 65528,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "AcceptedCommandList",
              "code": 65529,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "EventList",
              "code": 65530,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "AttributeList",
              "code": 65531,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "FeatureMap",
              "code": 65532,
              "mfgCode": null,
              "side": "server",
              "type": "bitmap32",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "ClusterRevision",
              "code": 65533,
              "mfgCode": null,
              "side": "server",
              "type": "int16u",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "4",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            }
          ]
        },
        {
          "name": "Scenes",
          "code": 5,
          "mfgCode": null,
          "define": "SCENES_CLUSTER",
          "side": "server",
          "enabled": 1,
          "commands": [
            {
              "name": "AddScene",
              "code": 0,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "AddSceneResponse",
              "code": 0,
              "mfgCode": null,
              "source": "server",
              "isIncoming": 0,
              "isEnabled": 1
            },
            {
              "name": "ViewScene",
              "code": 1,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "ViewSceneResponse",
              "code": 1,
              "mfgCode": null,
              "source": "server",
              "isIncoming": 0,
              "isEnabled": 1
            },
            {
              "name": "RemoveScene",
              "code": 2,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "RemoveSceneResponse",
              "code": 2,
              "mfgCode": null,
              "source": "server",
              "isIncoming": 0,
              "isEnabled": 1
            },
            {
              "name": "RemoveAllScenes",
              "code": 3,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "RemoveAllScenesResponse",
              "code": 3,
              "mfgCode": null,
              "source": "server",
              "isIncoming": 0,
              "isEnabled": 1
            },
            {
              "name": "StoreSceneResponse",
              "code": 4,
              "mfgCode": null,
              "source": "server",
              "isIncoming": 0,
              "isEnabled": 1
            },
            {
              "name": "StoreScene",
              "code": 4,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "RecallScene",
              "code": 5,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "GetSceneMembership",
              "code": 6,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "GetSceneMembershipResponse",
              "code": 6,
              "mfgCode": null,
              "source": "server",
              "isIncoming": 0,
              "isEnabled": 1
            }
          ],
          "attributes": [
            {
              "name": "SceneCount",
              "code": 0,
              "mfgCode": null,
              "side": "server",
              "type": "int8u",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0x00",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "CurrentScene",
              "code": 1,
              "mfgCode": null,
              "side": "server",
              "type": "int8u",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0x00",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "CurrentGroup",
              "code": 2,
              "mfgCode": null,
              "side": "server",
              "type": "group_id",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0x0000",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "SceneValid",
              "code": 3,
              "mfgCode": null,
              "side": "server",
              "type": "boolean",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0x00",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "NameSupport",
              "code": 4,
              "mfgCode": null,
              "side": "server",
              "type": "bitmap8",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0x00",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "GeneratedCommandList",
              "code": 65528,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "AcceptedCommandList",
              "code": 65529,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "EventList",
              "code": 65530,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "AttributeList",
              "code": 65531,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "FeatureMap",
              "code": 65532,
              "mfgCode": null,
              "side": "server",
              "type": "bitmap32",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "ClusterRevision",
              "code": 65533,
              "mfgCode": null,
              "side": "server",
              "type": "int16u",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "4",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            }
          ]
        },
        {
          "name": "On/Off",
          "code": 6,
          "mfgCode": null,
          "define": "ON_OFF_CLUSTER",
          "side": "server",
          "enabled": 1,
          "commands": [
            {
              "name": "Off",
              "code": 0,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "On",
              "code": 1,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "Toggle",
              "code": 2,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "OffWithEffect",
              "code": 64,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "OnWithRecallGlobalScene",
              "code": 65,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            },
            {
              "name": "OnWithTimedOff",
              "code": 66,
              "mfgCode": null,
              "source": "client",
              "isIncoming": 1,
              "isEnabled": 1
            }
          ],
          "attributes": [
            {
              "name": "OnOff",
              "code": 0,
              "mfgCode": null,
              "side": "server",
              "type": "boolean",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "GlobalSceneControl",
              "code": 16384,
              "mfgCode": null,
              "side": "server",
              "type": "boolean",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "1",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "OnTime",
              "code": 16385,
              "mfgCode": null,
              "side": "server",
              "type": "int16u",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "OffWaitTime",
              "code": 16386,
              "mfgCode": null,
              "side": "server",
              "type": "int16u",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "StartUpOnOff",
              "code": 16387,
              "mfgCode": null,
              "side": "server",
              "type": "OnOffStartUpOnOff",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "GeneratedCommandList",
              "code": 65528,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "AcceptedCommandList",
              "code": 65529,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "EventList",
              "code": 65530,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "AttributeList",
              "code": 65531,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "FeatureMap",
              "code": 65532,
              "mfgCode": null,
              "side": "server",
              "type": "bitmap32",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "ClusterRevision",
              "code": 65533,
              "mfgCode": null,
              "side": "server",
              "type": "int16u",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "4",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            }
          ]
        },
        {
          "name": "Descriptor",
          "code": 29,
          "mfgCode": null,
          "define": "DESCRIPTOR_CLUSTER",
          "side": "server",
          "enabled": 1,
          "attributes": [
            {
              "name": "DeviceTypeList",
              "code": 0,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "ServerList",
              "code": 1,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "ClientList",
              "code": 2,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "PartsList",
              "code": 3,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 0,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "GeneratedCommandList",
              "code": 65528,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "AcceptedCommandList",
              "code": 65529,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "EventList",
              "code": 65530,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "AttributeList",
              "code": 65531,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "FeatureMap",
              "code": 65532,
              "mfgCode": null,
              "side": "server",
              "type": "bitmap32",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "ClusterRevision",
              "code": 65533,
              "mfgCode": null,
              "side": "server",
              "type": "int16u",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            }
          ]
        },
        {
          "name": "Sample Custom Cluster",
          "code": 4294048800,
          "mfgCode": null,
          "define": "SAMPLE_MEI_CLUSTER",
          "side": "server",
          "enabled": 1,
          "attributes": [
            {
              "name": "GeneratedCommandList",
              "code": 65528,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "AcceptedCommandList",
              "code": 65529,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "EventList",
              "code": 65530,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "AttributeList",
              "code": 65531,
              "mfgCode": null,
              "side": "server",
              "type": "array",
              "included": 1,
              "storageOption": "External",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "FeatureMap",
              "code": 65532,
              "mfgCode": null,
              "side": "server",
              "type": "bitmap32",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "0",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            },
            {
              "name": "ClusterRevision",
              "code": 65533,
              "mfgCode": null,
              "side": "server",
              "type": "int16u",
              "included": 1,
              "storageOption": "RAM",
              "singleton": 0,
              "bounded": 0,
              "defaultValue": "1",
              "reportable": 1,
              "minInterval": 1,
              "maxInterval": 65534,
              "reportableChange": 0
            }
          ]
        }
      ]
    }
  ],
  "endpoints": [
    {
      "endpointTypeName": "Anonymous Endpoint Type",
      "endpointTypeIndex": 0,
      "profileId": 259,
      "endpointId": 1,
      "networkId": 0,
      "parentEndpointIdentifier": null
    }
  ]
}