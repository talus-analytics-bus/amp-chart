import axios from 'axios'

// Implement simple cache in localstorage for model runs
// this version uses the state name as the key, that
// key may need to be expanded in the future to include
// interventions or other differences.

// oldest acceptable model in the cache
// (younger models will be used older will be deleted)
const LIFESPAN = 60 * 60 * 1000
const MODEL_VERSION = '1'
// const API_URL = 'http://192.168.1.33:8000/state_base_model/'
const API_URL = 'http://localhost:8000/state_base_model/'

// request a model from the server
// this should only happen if we
// don't already have a recent model locally
const requestModel = async state => {
  console.log('ModelCache: requesting model ' + state)
  const result = await axios(API_URL + state)

  const runData = parseModelDates(result.data)
  runData['dateRequested'] = new Date()

  // cache this model in case it's quickly requested again
  saveModel(runData)

  return runData
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

  try {
    console.log('ModelCache: saving model ' + modelName)
    localStorage.setItem(modelName, JSON.stringify(runData))
  } catch (err) {
    const sortedKeys = Object.keys(localStorage).sort()

    console.log('ModelCache: deleting ' + sortedKeys[0])
    console.log('ModelCache: deleting ' + sortedKeys[1])
    localStorage.removeItem(sortedKeys[0])
    localStorage.removeItem(sortedKeys[1])

    console.log('ModelCache: saving model ' + modelName)
    localStorage.setItem(modelName, JSON.stringify(runData))
  }
}

// check if there is a sufficiently recent model run to use
// if not, request a model from the server.
const loadModels = async states => {
  // If the model versions do not match, drop the entire localStorage.
  // This lets us clear the user's cache if we push an incompatible update.
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

export default loadModels
