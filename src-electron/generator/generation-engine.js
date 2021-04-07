/**
 *
 *    Copyright (c) 2020 Silicon Labs
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

/**
 * @module JS API: generator logic
 */
const _ = require('lodash')
const fs = require('fs')
const fsPromise = fs.promises
const path = require('path')
const util = require('../util/util.js')
const queryPackage = require('../db/query-package.js')
const dbEnum = require('../../src-shared/db-enum.js')
const env = require('../util/env.js')
const templateEngine = require('./template-engine.js')
const dbApi = require('../db/db-api.js')

/**
 * Given a path, it will read generation template object into memory.
 *
 * @param {*} context.path
 * @returns context.templates, context.crc
 */
async function loadGenTemplate(context) {
  context.data = await fsPromise.readFile(context.path, 'utf8')
  await util.calculateCrc(context)
  context.templateData = JSON.parse(context.data)

  let requiredFeatureLevel = 0
  if ('requiredFeatureLevel' in context.templateData) {
    requiredFeatureLevel = context.templateData.requiredFeatureLevel
  }
  let status = util.matchFeatureLevel(requiredFeatureLevel)
  if (status.match) {
    return context
  } else {
    throw status.message
  }
}

async function recordPackageIfNonexistent(
  db,
  packagePath,
  parentId,
  packageType,
  version
) {
  let pkg = await queryPackage.getPackageByPathAndParent(
    db,
    packagePath,
    parentId
  )

  if (pkg == null) {
    // doesn't exist
    return queryPackage.insertPathCrc(
      db,
      packagePath,
      null,
      packageType,
      parentId,
      version
    )
  } else {
    // Already exists
    return pkg.id
  }
}

/**
 * Given a loading context, it records the package into the packages table and adds the packageId field into the resolved context.
 *
 * @param {*} context
 * @returns promise that resolves with the same context passed in, except packageId added to it
 */
async function recordTemplatesPackage(context) {
  return queryPackage
    .registerTopLevelPackage(
      context.db,
      context.path,
      context.crc,
      dbEnum.packageType.genTemplatesJson,
      context.templateData.version
    )
    .then((packageId) => {
      context.packageId = packageId
    })
    .then(() => {
      let promises = []
      env.logDebug(
        `Loading ${context.templateData.templates.length} templates.`
      )

      // Add templates queries to the list of promises
      context.templateData.templates.forEach((template) => {
        let templatePath = path.resolve(
          path.join(path.dirname(context.path), template.path)
        )
        promises.push(
          recordPackageIfNonexistent(
            context.db,
            templatePath,
            context.packageId,
            dbEnum.packageType.genSingleTemplate,
            template.output
          )
        )
      })

      // Add options to the list of promises
      if (context.templateData.options != null) {
        for (const category in context.templateData.options) {
          let data = context.templateData.options[category]

          if (_.isString(data)) {
            // Data is a string, so we will treat it as a relative path to the JSON file.
            let externalPath = path.resolve(
              path.join(path.dirname(context.path), data)
            )
            let promise = fsPromise
              .readFile(externalPath, 'utf8')
              .then((content) => JSON.parse(content))
              .then((jsonData) => {
                let codeLabels = []
                for (const code in jsonData) {
                  codeLabels.push({ code: code, label: jsonData[code] })
                }
                return codeLabels
              })
              .then((codeLabels) =>
                queryPackage.insertOptionsKeyValues(
                  context.db,
                  context.packageId,
                  category,
                  codeLabels
                )
              )
            promises.push(promise)
          } else {
            // Treat this data as an object.
            let codeLabelArray = []
            for (const code in data) {
              codeLabelArray.push({ code: code, label: data[code] })
            }
            promises.push(
              queryPackage.insertOptionsKeyValues(
                context.db,
                context.packageId,
                category,
                codeLabelArray
              )
            )
          }
        }
      }

      // Deal with helpers
      if (context.templateData.helpers != null) {
        context.templateData.helpers.forEach((helper) => {
          let helperPath = path.join(path.dirname(context.path), helper)
          promises.push(
            recordPackageIfNonexistent(
              context.db,
              helperPath,
              context.packageId,
              dbEnum.packageType.genHelper,
              null
            )
          )
        })
      }

      // Deal with overrides
      if (context.templateData.override != null) {
        let overridePath = path.join(
          path.dirname(context.path),
          context.templateData.override
        )
        promises.push(
          recordPackageIfNonexistent(
            context.db,
            overridePath,
            context.packageId,
            dbEnum.packageType.genOverride,
            null
          )
        )
      }
      // Deal with partials
      if (context.templateData.partials != null) {
        context.templateData.partials.forEach((partial) => {
          let partialPath = path.join(path.dirname(context.path), partial.path)
          promises.push(
            queryPackage.insertPathCrc(
              context.db,
              partialPath,
              null,
              dbEnum.packageType.genPartial,
              context.packageId,
              partial.name
            )
          )
        })
      }

      // Deal with zcl extensions
      if (context.templateData.zcl != null) {
        let zclExtension = context.templateData.zcl
        promises.push(
          loadZclExtensions(
            context.db,
            context.packageId,
            zclExtension,
            context.path
          )
        )
      }
      return Promise.all(promises)
    })
    .then(() => context)
}

function decodePackageExtensionEntity(entityType, entity) {
  switch (entityType) {
    case dbEnum.packageExtensionEntity.cluster:
      return {
        entityCode: entity.clusterCode,
        parentCode: null,
        value: entity.value,
      }
    case dbEnum.packageExtensionEntity.command:
      return {
        entityCode: entity.commandCode,
        parentCode: entity.clusterCode,
        value: entity.value,
      }
    case dbEnum.packageExtensionEntity.attribute:
      return {
        entityCode: entity.attributeCode,
        parentCode: entity.clusterCode,
        value: entity.value,
      }
    case dbEnum.packageExtensionEntity.deviceType:
      return {
        entityCode: entity.device,
        parentCode: null,
        value: entity.value,
      }
    default:
      // We don't know how to process defaults otherwise
      return null
  }
}

/**
 * Returns a promise that will load the zcl extensions.
 *
 * @param {*} zclExt
 * @returns Promise of loading the zcl extensions.
 */
async function loadZclExtensions(db, packageId, zclExt, defaultsPath) {
  let promises = []
  for (const entity in zclExt) {
    let entityExtension = zclExt[entity]
    let propertyArray = []
    let defaultArrayOfArrays = []
    for (const property in entityExtension) {
      let prop = entityExtension[property]
      propertyArray.push({
        property: property,
        type: prop.type,
        configurability: prop.configurability,
        label: prop.label,
        globalDefault: prop.globalDefault,
      })
      if ('defaults' in prop) {
        if (
          typeof prop.defaults === 'string' ||
          prop.defaults instanceof String
        ) {
          // Data is a string, so we will treat it as a relative path to the JSON file.
          let externalPath = path.resolve(
            path.join(path.dirname(defaultsPath), prop.defaults)
          )
          let data = await fsPromise
            .readFile(externalPath, 'utf8')
            .then((content) => JSON.parse(content))
            .catch((err) => {
              env.logInfo(
                `Invalid file! Failed to load defaults from: ${prop.defaults}`
              )
            })

          if (data) {
            if (!Array.isArray(data)) {
              env.logInfo(
                `Invalid file format! Failed to load defaults from: ${prop.defaults}`
              )
            } else {
              defaultArrayOfArrays.push(
                data.map((x) => decodePackageExtensionEntity(entity, x))
              )
            }
          }
        } else {
          defaultArrayOfArrays.push(
            prop.defaults.map((x) => decodePackageExtensionEntity(entity, x))
          )
        }
      } else {
        defaultArrayOfArrays.push(null)
      }
    }
    promises.push(
      queryPackage.insertPackageExtension(
        db,
        packageId,
        entity,
        propertyArray,
        defaultArrayOfArrays
      )
    )
  }
  return Promise.all(promises)
}

/**
 * Main API async function to load templates from a gen-template.json file.
 *
 * @param {*} db Database
 * @param {*} genTemplatesJson Path to the JSON file
 * @returns the loading context, contains: db, path, crc, packageId and templateData, or error
 */
async function loadTemplates(db, genTemplatesJson) {
  let context = {
    db: db,
  }
  if (genTemplatesJson == null) {
    context.error = 'No templates file specified.'
    env.logWarning(context.error)
    return Promise.resolve(context)
  }

  let file = path.resolve(genTemplatesJson)
  if (!fs.existsSync(file)) {
    context.error = `Can't locate templates file: ${file}`
    env.logWarning(context.error)
    return Promise.resolve(context)
  }

  context.path = file
  return dbApi
    .dbBeginTransaction(db)
    .then(() => fsPromise.access(context.path, fs.constants.R_OK))
    .then(() => {
      env.logDebug(`Loading generation templates from: ${context.path}`)
      return loadGenTemplate(context)
    })
    .then((ctx) => recordTemplatesPackage(ctx))
    .catch((err) => {
      env.logInfo(`Can not read templates from: ${context.path}`)
      throw err
    })
    .finally(() => {
      dbApi.dbCommit(db)
    })
}

/**
 * Generates all the templates inside a toplevel package.
 *
 * @param {*} genResult
 * @param {*} genTemplateJsonPkg Package that points to genTemplate.json file
 * @param {*} generateOnly if NULL then generate all templates, else only generate template whose out file name matches this.
 * @returns Promise that resolves with genResult, that contains all the generated templates, keyed by their 'output'
 */
async function generateAllTemplates(
  genResult,
  genTemplateJsonPkg,
  options = {
    generateOnly: null,
    disableDeprecationWarnings: false,
  }
) {
  return queryPackage
    .getPackageByParent(genResult.db, genTemplateJsonPkg.id)
    .then((packages) => {
      let generationTemplates = []
      let helperPromises = []
      let partialPromises = []
      let overridePath = null

      // First extract overridePath if one exists, as we need to
      // pass it to the generation.
      packages.forEach((singlePkg) => {
        if (singlePkg.type == dbEnum.packageType.genOverride) {
          overridePath = singlePkg.path
        }
      })

      // Next load the partials
      packages.forEach((singlePkg) => {
        if (singlePkg.type == dbEnum.packageType.genPartial) {
          partialPromises.push(
            templateEngine.loadPartial(singlePkg.version, singlePkg.path)
          )
        }
      })

      // Initialize global helpers
      templateEngine.initializeGlobalHelpers()

      // Next load the addon helpers
      packages.forEach((singlePkg) => {
        if (singlePkg.type == dbEnum.packageType.genHelper) {
          helperPromises.push(templateEngine.loadHelper(singlePkg.path))
        }
      })

      // Next prepare the templates
      packages.forEach((singlePkg) => {
        if (singlePkg.type == dbEnum.packageType.genSingleTemplate) {
          if (
            options.generateOnly == null ||
            options.generateOnly == singlePkg.version
          ) {
            generationTemplates.push(singlePkg)
          }
        }
      })

      // And finally go over the actual templates.
      return Promise.all(helperPromises).then(() =>
        Promise.all(partialPromises).then(() => {
          let templates = generationTemplates.map((pkg) =>
            generateSingleTemplate(genResult, pkg, genTemplateJsonPkg.id, {
              overridePath: overridePath,
              disableDeprecationWarnings: options.disableDeprecationWarnings,
            })
          )
          return Promise.all(templates)
        })
      )
    })
    .then(() => {
      genResult.partial = false
      return genResult
    })
}

/**
 * Function that generates a single package and adds it to the generation result.
 *
 * @param {*} genResult
 * @param {*} singleTemplatePkg Single template package.
 * @returns promise that resolves with the genResult, with newly generated content added.
 */
async function generateSingleTemplate(
  genResult,
  singleTemplatePkg,
  genTemplateJsonPackageId,
  options = {
    overridePath: null,
    disableDeprecationWarnings: false,
  }
) {
  return templateEngine
    .produceContent(
      genResult.db,
      genResult.sessionId,
      singleTemplatePkg,
      genTemplateJsonPackageId,
      options
    )
    .then((data) => {
      genResult.content[singleTemplatePkg.version] = data
      genResult.partial = true
      return genResult
    })
    .catch((err) => {
      genResult.errors[singleTemplatePkg.version] = err
      genResult.hasErrors = true
    })
}

/**
 * Main API async function to generate stuff.
 *
 * @param {*} db Database
 * @param {*} packageId packageId Template package id. It can be either single template or gen template json.
 * @returns Promise that resolves into a generation result.
 */
async function generate(
  db,
  sessionId,
  templatePackageId,
  templateGeneratorOptions = {},
  options = {
    generateOnly: null,
    disableDeprecationWarnings: false,
  }
) {
  return queryPackage
    .getPackageByPackageId(db, templatePackageId)
    .then((pkg) => {
      if (pkg == null) throw `Invalid packageId: ${templatePackageId}`
      let genResult = {
        db: db,
        sessionId: sessionId,
        content: {},
        errors: {},
        hasErrors: false,
        generatorOptions: templateGeneratorOptions,
        templatePath: path.dirname(pkg.path),
      }
      if (pkg.type === dbEnum.packageType.genTemplatesJson) {
        return generateAllTemplates(genResult, pkg, options)
      } else {
        throw `Invalid package type: ${pkg.type}`
      }
    })
}

/**
 * Promise to write out a file, optionally creating a backup.
 *
 * @param {*} fileName
 * @param {*} content
 * @param {*} doBackup
 * @returns promise of a written file.
 */
async function writeFileWithBackup(fileName, content, doBackup) {
  if (doBackup && fs.existsSync(fileName)) {
    let backupName = fileName.concat('~')
    fsPromise
      .rename(fileName, backupName)
      .then(() => fsPromise.writeFile(fileName, content))
  } else {
    return fsPromise.writeFile(fileName, content)
  }
}

/**
 * Returns a promise that resolves into a content that should be written out to gen result file.
 *
 * @param {*} genResult
 */
async function generateGenerationContent(genResult) {
  let out = {
    writeTime: new Date().toString(),
    featureLevel: env.zapVersion().featureLevel,
    creator: 'zap',
    content: [],
  }
  for (const f in genResult.content) {
    out.content.push(f)
  }
  return Promise.resolve(JSON.stringify(out))
}

/**
 * Generate files and write them into the given directory.
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} packageId
 * @param {*} outputDirectory
 * @returns a promise which will resolve when all the files are written.
 */
async function generateAndWriteFiles(
  db,
  sessionId,
  templatePackageId,
  outputDirectory,
  options = {
    logger: (msg) => {},
    backup: false,
    genResultFile: false,
    skipPostGeneration: false,
  }
) {
  return queryPackage
    .selectAllOptionsValues(
      db,
      templatePackageId,
      dbEnum.packageOptionCategory.generator
    )
    .then((genOptions) => {
      // Reduce the long array from query into a single object
      let templateGeneratorOptions = genOptions.reduce((acc, current) => {
        acc[current.optionCode] = current.optionLabel
        return acc
      }, {})
      return templateGeneratorOptions
    })
    .then((templateGeneratorOptions) =>
      generate(db, sessionId, templatePackageId, templateGeneratorOptions)
    )
    .then((genResult) => {
      if (!fs.existsSync(outputDirectory)) {
        options.logger(`✅ Creating directory: ${outputDirectory}`)
        fs.mkdirSync(outputDirectory, { recursive: true })
      }
      options.logger('🤖 Generating files:')
      let promises = []
      for (const f in genResult.content) {
        let content = genResult.content[f]
        let fileName = path.join(outputDirectory, f)
        options.logger(`    ✍  ${fileName}`)
        env.logDebug(`Preparing to write file: ${fileName}`)
        promises.push(writeFileWithBackup(fileName, content, options.backup))
      }
      if (genResult.hasErrors) {
        options.logger('⚠️  Errors:')
        for (const f in genResult.errors) {
          let err = genResult.errors[f]
          let fileName = path.join(outputDirectory, f)
          options.logger(`    👎  ${fileName}: ⛔ ${err}\nStack trace:\n`)
          options.logger(err)
        }
      }
      promises.push(
        generateGenerationContent(genResult).then((generatedContent) => {
          if (options.genResultFile) {
            return writeFileWithBackup(
              path.join(outputDirectory, 'genResult.json'),
              generatedContent,
              options.backup
            )
          } else {
            return
          }
        })
      )

      return Promise.all(promises)
        .then(() => genResult)
        .then((gr) => {
          if (options.skipPostGeneration) {
            return gr
          } else {
            return postProcessGeneratedFiles(
              outputDirectory,
              gr,
              options.logger
            )
          }
        })
    })
}

/**
 * Executes post processing actions as defined by the gen-templates.json
 *
 * @param {*} outputDirectory
 * @param {*} genResult
 * @returns promise of a dealt-with post processing actions
 */
async function postProcessGeneratedFiles(
  outputDirectory,
  genResult,
  logger = (msg) => {}
) {
  let doExecute = true
  let isEnabledS = genResult.generatorOptions[dbEnum.generatorOptions.enabled]
  let f =
    genResult.generatorOptions[
      dbEnum.generatorOptions.postProcessConditionalFile
    ]

  let isEnabled = true
  if (isEnabledS == 'false' || isEnabledS == '0') isEnabled = false
  if (!isEnabled) {
    // If `enabled` is false, then we do nothing.
    doExecute = false
  } else if (f != null) {
    // If `postProcessConditionalFile' doesn't exist, we also do nothing.
    f = path.join(genResult.templatePath, f)
    if (!fs.existsSync(f)) doExecute = false
  }

  // Now we deal with postProcessing
  let postProcessPromises = []
  if (
    doExecute &&
    dbEnum.generatorOptions.postProcessMulti in genResult.generatorOptions
  ) {
    let cmd =
      genResult.generatorOptions[dbEnum.generatorOptions.postProcessMulti]
    for (const genFile in genResult.content) {
      let fileName = path.join(outputDirectory, genFile)
      cmd = cmd + ' ' + fileName
    }
    postProcessPromises.push(
      util.executeExternalProgram(cmd, genResult.templatePath, {
        rejectOnFail: false,
        routeErrToOut:
          genResult.generatorOptions[dbEnum.generatorOptions.routeErrToOut],
      })
    )
  }
  if (
    doExecute &&
    dbEnum.generatorOptions.postProcessSingle in genResult.generatorOptions
  ) {
    let cmd =
      genResult.generatorOptions[dbEnum.generatorOptions.postProcessSingle]
    for (const genFile in genResult.content) {
      let fileName = path.join(outputDirectory, genFile)
      let singleCmd = cmd + ' ' + fileName
      postProcessPromises.push(
        util.executeExternalProgram(singleCmd, genResult.templatePath, {
          rejectOnFail: false,
        })
      )
    }
  }
  if (postProcessPromises.length > 0)
    logger('🤖 Executing post-processing actions:')
  return Promise.all(postProcessPromises).then(() => genResult)
}

/**
 * This async function takes a string, and resolves a preview object out of it.
 *
 * @param {*} content String to form into preview.
 */
async function contentIndexer(content, linesPerIndex = 2000) {
  let index = 0
  let indexedResult = {}
  let code = content.split(/\n/)
  let loc = code.length

  if (content == null || content.length == 0) {
    return Promise.resolve(indexedResult)
  }

  // Indexing the generation result for faster preview pane generation
  for (let i = 0; i < loc; i++) {
    if (i % linesPerIndex === 0) {
      index++
      indexedResult[index] = ''
    }
    indexedResult[index] = indexedResult[index].concat(code[i]).concat('\n')
  }
  return Promise.resolve(indexedResult)
}

/**
 * Generates a single file and feeds it back for preview.
 *
 * @param {*} db
 * @param {*} sessionId
 * @param {*} fileName
 * @returns promise that resolves into a preview object.
 */
async function generateSingleFileForPreview(db, sessionId, outFileName) {
  return queryPackage
    .getSessionPackagesByType(
      db,
      sessionId,
      dbEnum.packageType.genTemplatesJson
    )
    .then((pkgs) => {
      let promises = []
      pkgs.forEach((pkg) => {
        promises.push(
          generate(
            db,
            sessionId,
            pkg.id,
            {},
            {
              generateOnly: outFileName,
              disableDeprecationWarnings: true,
            }
          )
        )
      })
      return Promise.all(promises)
    })
    .then((genResultArrays) => {
      let content = ''
      genResultArrays.forEach((gr) => {
        if (outFileName in gr.content) {
          content = gr.content[outFileName]
        }
      })
      return content
    })
    .then((content) => contentIndexer(content))
}

exports.loadTemplates = loadTemplates
exports.generateAndWriteFiles = generateAndWriteFiles
exports.generateSingleFileForPreview = generateSingleFileForPreview
exports.contentIndexer = contentIndexer
exports.generate = generate
