import axios from 'axios'

// Implement simple cache in localstorage for model runs
// this version uses the state name as the key, that
// key may need to be expanded in the future to include
// interventions or other differences.

// oldest acceptable model in the cache
// (younger models will be used older will be deleted)
const LIFESPAN = 60 * 60 * 1000

// If the model versions do not match, drop the entire
// localStorage. This lets us clear all client caching
// if we push an incompatible update.
const MODEL_VERSION = '1'

// const API_URL = 'http://192.168.1.33:8000/'
// const API_URL = 'http://ec2-13-58-161-197.us-east-2.compute.amazonaws.com:8080/'
const API_URL = 'http://localhost:8000/'

// request a model from the server
// this should only happen if we
// don't already have a recent model locally
const requestModel = async state => {
  console.log('ModelCache: requesting model ' + state)
  const result = await axios(API_URL + 'state_base_model/' + state)

  const runData = parseModelDates(result.data)
  runData['dateRequested'] = new Date()

  // cache this model in case it's quickly requested again
  saveModel(runData)

  return runData
}

const requestIntervention = async (state, intervention) => {
  let model = (await loadModels([state]))[0]
  console.log(model)

  console.log('\n\n')
  console.log('post')

  axios
    .post(API_URL + 'intervention_run/' + model.modelrun, intervention)
    .catch(async err => {
      // if the server returns an error,
      // delete the base model and then
      // request a new base model.
      deleteModel(model)
      model = await loadModels([state])
      console.log(model)
    })
    .then(result => {
      console.log(result)

      const runData = parseModelDates(result.data)
      const newIntervention = runData.interventions.slice(-1)[0]
      runData['dateRequested'] = new Date(model.dateRequested)
      runData['cases'] = model.cases
      runData['deaths'] = model.deaths

      console.log(newIntervention)

      // check if model interventions include the latest,
      // if not, copy the array from the old cached model
      // and then add the latest intervention from the new one
      if (
        !model.interventions.find(
          inter => inter.startdate === newIntervention.startdate
        )
      ) {
        console.log([...model.interventions, newIntervention])
        runData['interventions'] = [...model.interventions, newIntervention]
      }

      // save new model
      console.log('ModelCache: received ' + state + ' model with intervention')
      saveModel(runData)

      console.log(runData)
    })
}

// take a model run string and
// parse it, including fixing dates
const parseModelDates = runData => {
  runData.results.run = JSON.parse(runData.results[0].run).map(day => ({
    ...day,
    date: new Date(day.date),
  }))

  return runData
}

// save a model into local storage
// saveModel expects a parsed model, not the string
const saveModel = runData => {
  localStorage.setItem('MODEL_VERSION', MODEL_VERSION)

  const modelName =
    runData.dateRequested.toISOString() + '_' + runData.state + '_MR'

  // Browsers throw inconsistent errors, so catching everything...
  try {
    console.log('ModelCache: saving model ' + modelName)
    localStorage.setItem(modelName, JSON.stringify(runData))
  } catch (err) {
    // Delete oldest two models if there is an error
    const sortedKeys = Object.keys(localStorage).sort()
    console.log('ModelCache: deleting ' + sortedKeys[0])
    console.log('ModelCache: deleting ' + sortedKeys[1])
    localStorage.removeItem(sortedKeys[0])
    localStorage.removeItem(sortedKeys[1])

    // Save new model now that we've made room
    console.log('ModelCache: saving model ' + modelName)
    localStorage.setItem(modelName, JSON.stringify(runData))
  }
}

const deleteModel = model => {
  const modelName = model.dateRequested + '_' + model.state + '_MR'
  console.log('ModelCache: deleting model ' + modelName)
  localStorage.removeItem(modelName)
}

// check if there is a sufficiently recent model run to use
// if not, request a model from the server.
const loadModels = async states => {
  // only for testing!!
  // localStorage.clear()

  // Model version check, dropping the whole localStorage
  if (MODEL_VERSION !== localStorage.getItem('MODEL_VERSION')) {
    console.log('New model version ' + MODEL_VERSION + ', dropping cache')
    localStorage.clear()
  }

  let models = await Promise.all(
    states.map(async state => {
      // console.log('ModelCache: loadModel ' + state);

      const stateModelNames = Object.keys(localStorage).filter(key =>
        key.endsWith(state + '_MR')
      )

      const now = new Date()
      const modelName = stateModelNames.find(modelName => {
        if (now - new Date(modelName.split('_')[0]) < LIFESPAN) {
          return true
        } else {
          // clean up too-old models
          console.log(
            'ModelCache: deleting ' + modelName + ' from localStorage'
          )
          window.localStorage.removeItem(modelName)
          return false
        }
      })

      if (modelName) {
        console.log(
          'ModelCache: retrieving ' + modelName + ' from localStorage'
        )
        const modelString = window.localStorage.getItem(modelName)
        return parseModelDates(JSON.parse(modelString))
      } else {
        return requestModel(state)
      }
    })
  )

  return models
}
// setTimeout(() => {
//   requestIntervention('CO', {
//     name: 'First Intervention',
//     system_name: 'string',
//     description: 'string',
//     startdate: '2020-07-20',
//     params: { beta_mild: 0.0, beta_asymp: 0.0 },
//     intervention_type: 'intervention',
//   })
// }, 2000)
//
// setTimeout(() => {
//   requestIntervention('CO', {
//     name: 'Second Intervention',
//     system_name: 'test',
//     description: 'string',
//     startdate: '2020-09-08',
//     params: { beta_mild: 0.2, beta_asymp: 0.2 },
//     intervention_type: 'intervention',
//   })
// }, 5000)
//
// setTimeout(() => {
//   requestIntervention('CO', {
//     name: 'Third Intervention',
//     system_name: 'string',
//     description: 'string',
//     startdate: '2020-11-08',
//     params: { beta_mild: 0.4, beta_asymp: 0.4 },
//     intervention_type: 'intervention',
//   })
// }, 9000)

export default loadModels
