<template>
  <div class="q-pa-md dark">
    <div class="q-gutter-y-md height: 10vh">
      <div class="row justify-center q-pt-xl">
        <q-layout
          view="hHh Lpr lff"
          container
          style="height: calc(100vh - 100px)"
          class="shadow-2"
        >
          <q-page-container>
            <div class="border-radius-inherit q-px-xl">
              <div class="row justify-center">
                <q-radio
                  v-if="loadPreSessionData.length"
                  v-model="customConfig"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="generate"
                  label="Generate New Session"
                />
                <q-radio
                  v-if="loadPreSessionData.length"
                  v-model="customConfig"
                  checked-icon="task_alt"
                  class="q-ml-xl"
                  unchecked-icon="panorama_fish_eye"
                  val="load"
                  label="Restore Unsaved Session"
                />
              </div>
              <p
                class="text-center"
                v-if="isMultiplePackage && customConfig === 'generate'"
              >
                There are multiple packages of ZCL metadata loaded. Please
                select the one you wish to use with this configuration.
              </p>
              <p class="text-center" v-else-if="customConfig === 'load'">
                These are sessions found in the database that were not saved
                into a .zap file. You can select them here, and continue the
                work with the configuration.
              </p>

              <template v-if="customConfig === 'generate'">
                <q-table
                  title="Zigbee Cluster Library metadata"
                  :data="zclPropertiesRow"
                  :columns="newSessionCol"
                  row-key="name"
                  :pagination.sync="newGenerationPagination"
                  hide-bottom
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props" class="table_body">
                      <q-td key="select" :props="props">
                        <q-radio
                          v-model="selectedZclPropertiesData"
                          checked-icon="task_alt"
                          unchecked-icon="panorama_fish_eye"
                          :val="props.row"
                        />
                      </q-td>
                      <q-td key="category" :props="props">
                        <div>{{ props.row.category }}</div>
                      </q-td>
                      <q-td key="description" :props="props">
                        <div>{{ props.row.description }}</div>
                      </q-td>
                      <q-td key="version" :props="props">
                        <div>{{ props.row.version }}</div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
                <q-table
                  title="Zap Generation Templates"
                  :data="zclGenRow"
                  :columns="newSessionCol"
                  row-key="name"
                  :pagination.sync="newGenerationPagination"
                  hide-bottom
                >
                  <template v-slot:top>
                    <div class="q-table__title q-mr-md">
                      Zap Generation Templates
                    </div>
                    <small>( Please select a package for generation )</small>
                  </template>
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props" class="table_body">
                      <q-td key="select" :props="props">
                        <q-checkbox
                          v-model="selectedZclGenData"
                          :val="props.row.id"
                          data-test="gen-template"
                        />
                      </q-td>
                      <q-td key="category" :props="props">
                        <div>{{ props.row.category }}</div>
                      </q-td>
                      <q-td key="description" :props="props">
                        <div>{{ props.row.description }}</div>
                      </q-td>
                      <q-td key="version" :props="props">
                        <div>{{ props.row.version }}</div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </template>
              <template v-else>
                <q-table
                  title=""
                  :data="loadPreSessionData"
                  :columns="loadPreSessionCol"
                  row-key="name"
                  :pagination.sync="pagination"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props" class="table_body">
                      <q-td key="select" :props="props">
                        <q-radio
                          v-model="selectedZclSessionData"
                          checked-icon="task_alt"
                          unchecked-icon="panorama_fish_eye"
                          :val="props.row"
                        />
                      </q-td>
                      <q-td key="zclproperty" :props="props">
                        <div>{{ props.row.zclProperty.description }}</div>
                      </q-td>
                      <q-td key="gen template file" :props="props">
                        <div>{{ props.row.genTemplateFile.version }}</div>
                      </q-td>
                      <q-td key="creation time" :props="props">
                        <div>
                          {{ new Date(props.row.creationTime).toDateString() }}
                        </div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </template>

              <div class="row justify-end q-mt-xl">
                <q-btn
                  :disable="disableSubmitButton"
                  :color="disableSubmitButton ? 'blue-grey' : 'primary'"
                  @click="submitForm"
                  label="Submit"
                  data-test="login-submit"
                />
              </div>
            </div>
          </q-page-container>
        </q-layout>
      </div>
    </div>
  </div>
</template>

<script>
import restApi from '../../src-shared/rest-api.js'

const generateNewSessionCol = [
  {
    name: 'select',
    label: '',
    align: 'center',
    style: 'width: 25%',
  },
  {
    name: 'category',
    align: 'left',
    label: 'Category',
    style: 'width: 25%',
  },
  {
    name: 'description',
    label: 'Description',
    align: 'left',
    style: 'width: 25%',
  },
  {
    name: 'version',
    label: 'version',
    align: 'left',
    style: 'width: 25%',
  },
]
const loadPreSessionCol = [
  {
    name: 'select',
    label: 'Session',
    align: 'center',
  },
  {
    name: 'zclproperty',
    label: 'ZCL Property',
    align: 'center',
  },
  {
    name: 'gen template file',
    align: 'left',
    label: 'Generation Template File',
  },
  {
    name: 'creation time',
    label: 'Creation Time',
    align: 'left',
  },
]

export default {
  name: 'ZapConfig',
  data() {
    return {
      customConfig: 'generate',
      selected: [],
      selectedZclPropertiesData: null,
      selectedZclGenData: [],
      selectedZclSessionData: null,
      zclPropertiesRow: [],
      newSessionCol: generateNewSessionCol,
      loadPreSessionCol: loadPreSessionCol,
      zclGenRow: [],
      loadPreSessionData: [],
      pagination: {
        rowsPerPage: 10,
      },
      newGenerationPagination: {
        rowsPerPage: 0,
      },
    }
  },
  computed: {
    disableSubmitButton: function () {
      if (this.customConfig === 'generate')
        return (
          this.selectedZclPropertiesData == null ||
          this.selectedZclGenData.length == 0
        )
      else return this.selectedZclSessionData == null
    },
    isMultiplePackage: function () {
      return this.zclPropertiesRow.length > 1
    },
  },
  methods: {
    submitForm() {
      if (this.customConfig === 'generate') {
        if (
          this.selectedZclPropertiesData != null &&
          this.selectedZclGenData.length != 0
        ) {
          let data = {
            zclProperties: this.selectedZclPropertiesData.id,
            genTemplate: this.selectedZclGenData,
          }
          this.$serverPost(restApi.uri.initializeSession, data).then(
            (result) => {
              this.$store.commit('zap/selectZapConfig', true)
            }
          )
        }
      } else {
        this.$serverPost(restApi.uri.reloadSession, {
          sessionId: this.selectedZclSessionData.id,
        }).then((result) => {
          this.$store.commit('zap/selectZapConfig', true)
        })
      }
    },
  },
  beforeCreate() {
    this.$serverGet(restApi.uri.initialPackagesSessions).then((result) => {
      this.zclPropertiesRow = result.data.zclProperties
      this.selectedZclPropertiesData = result.data.zclProperties[0]
      this.zclGenRow = result.data.zclGenTemplates

      if (this.zclPropertiesRow.length == 1 && this.zclGenRow.length == 1) {
        // We shortcut this page, if there is exactly one of each,
        // since we simply assume that they are selected and move on.
        this.selectedZclGenData[0] = this.zclGenRow[0].id
        this.customConfig = 'generate'
        this.submitForm()
      }

      result.data.sessions.forEach((item) => {
        let atts = null
        let gen = null
        item.packageRef.forEach((element) => {
          !atts
            ? (atts = this.zclPropertiesRow.find((data) => data.id === element))
            : ''
          !gen ? (gen = this.zclGenRow.find((data) => data.id === element)) : ''
        })
        this.loadPreSessionData.push({
          zclProperty: atts,
          genTemplateFile: gen,
          creationTime: item.creationTime,
          id: item.sessionId,
        })
      })
      this.selectedZclSessionData = this.loadPreSessionData[0]
    })
  },
}
</script>

<style scoped></style>