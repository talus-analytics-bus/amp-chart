import React, { useState } from 'react'

import loadModels from './LoadModels'
import parseModels from './parseModels'

// import PolicyPlot from '../PolicyPlot/PolicyPlot';
import State from '../State/State'
import LoadingState from '../LoadingState/LoadingState'
import NavigatorPlot from '../PolicyPlot/NavigatorPlot/NavigatorPlot'

import styles from './PolicyModel.module.scss'

import states from './states'

const PolicyModel = () => {
  const [activeTab] = useState('interventions')

  // use selected states to load the required models
  const [selectedStates, setSelectedStates] = useState(['CO'])

  const [counterfactualSelected, setCounterfactualSelected] = useState(false)

  // curves selected by the user
  const [selectedCurves, setSelectedCurves] = useState([
    // 'infected_a',
    // 'infected_b',
    'R effective',
    'infected_c',
    // 'dead',
  ])

  const [curves, setCurves] = useState()
  const [zoomDateRange, setZoomDateRange] = useState([
    new Date('2020-01-01'),
    new Date('2021-01-01'),
  ])
  const [domain, setDomain] = useState([
    new Date('2020-01-01'),
    new Date('2021-01-01'),
  ])
  const [caseLoadAxis, setCaseLoadAxis] = useState([0, 10000])

  React.useEffect(() => {
    const initialSetup = async () => {
      const loadedModels = await loadModels(selectedStates)

      // get curves, max, min from models
      const modelCurves = parseModels(
        loadedModels,
        selectedCurves,
        counterfactualSelected
      )

      // console.log(modelCurves)
      setCurves(modelCurves)

      // set up axes
      const dates = Object.values(modelCurves)
        .map(state => state.dateRange)
        .flat()

      // Initialize the zoom range as all dates
      setZoomDateRange([
        dates.reduce((prev, curr) => (prev > curr ? curr : prev)),
        dates.reduce((prev, curr) => (prev < curr ? curr : prev)),
      ])

      // set overall domain; this will be used for the navigator plot.
      setDomain([
        dates.reduce((prev, curr) => (prev > curr ? curr : prev)),
        dates.reduce((prev, curr) => (prev < curr ? curr : prev)),
      ])

      setCaseLoadAxis([
        0,
        Math.max(...Object.values(modelCurves).map(state => state.yMax)),
      ])
    }

    initialSetup()
  }, [selectedStates, selectedCurves, counterfactualSelected])

  return (
    <div className={styles.background}>
      <article className={styles.main}>
        <h1 className={styles.title}>Social distancing model (info button)</h1>
        <div className={styles.tabrow}>
          {/* <button */}
          {/*   onClick={() => setActiveTab('existing')} */}
          {/*   style={{ */}
          {/*     background: activeTab === 'existing' ? '#bde7ff' : '#bde7ff32', */}
          {/*     color: activeTab === 'existing' ? 'inherit' : 'white', */}
          {/*   }} */}
          {/* > */}
          {/*   Existing policies */}
          {/* </button> */}
          {/* <button */}
          {/*   onClick={() => setActiveTab('interventions')} */}
          {/*   style={{ */}
          {/*     background: */}
          {/*       activeTab === 'interventions' ? '#bde7ff' : '#bde7ff32', */}
          {/*     color: activeTab === 'interventions' ? 'inherit' : 'white', */}
          {/*   }} */}
          {/* > */}
          {/*   Evaluate policy interventions */}
          {/* </button> */}
          <div className={styles.location}>
            <label>
              Add a state to compare
              <select
                value={selectedStates[0]}
                onChange={e =>
                  setSelectedStates([e.target.value, ...selectedStates])
                }
                disabled={selectedStates.length >= 3}
              >
                {states.map(state => (
                  <option key={state.abbr} value={state.abbr}>
                    {state.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <section className={styles.tabarea}>
          <div className={styles.settingsBar}>
            <label>
              Show reduction in contacts by
              <select>
                <option value="percent">Percent reduction</option>
              </select>
            </label>
            <label>
              Show COVID count by
              <select
                selected={selectedCurves[0]}
                onChange={e => {
                  setSelectedCurves([e.target.value, 'R effective'])
                }}
              >
                <option value="infected_a">Infected</option>
                <option value="infected_b">Hospitalized</option>
                <option value="infected_c">ICU</option>
                <option value="dead">Deaths</option>
              </select>
            </label>
            {/* <label> */}
            {/*   <input */}
            {/*     type="checkbox" */}
            {/*     checked={counterfactualSelected} */}
            {/*     onChange={() => */}
            {/*       setCounterfactualSelected(!counterfactualSelected) */}
            {/*     } */}
            {/*   /> */}
            {/*   COVID COUNT WITH NO ACTIONS TAKEN */}
            {/* </label> */}
          </div>
          {selectedStates.map((state, index) => {
            if (curves && curves[state]) {
              // console.log(curves[state])
              return (
                <State
                  key={state + index}
                  index={index}
                  zoomDateRange={zoomDateRange}
                  setZoomDateRange={setZoomDateRange}
                  // dateOffset={0}
                  caseLoadAxis={caseLoadAxis}
                  selectedState={state}
                  setSelectedStates={setSelectedStates}
                  selectedStates={selectedStates}
                  curves={curves[state]}
                  setCurves={setCurves}
                  allCurves={curves}
                  domain={domain}
                  activeTab={activeTab}
                  counterfactualSelected={counterfactualSelected}
                  setCounterfactualSelected={setCounterfactualSelected}
                />
              )
            } else {
              // This is where a loading component should go
              return (
                <LoadingState
                  key={state}
                  state={state}
                  zoomDateRange={zoomDateRange}
                  setZoomDateRange={setZoomDateRange}
                  // dateOffset={0}
                  caseLoadAxis={caseLoadAxis}
                  selectedState={state}
                  setSelectedStates={setSelectedStates}
                  selectedStates={selectedStates}
                  // curves={curves[state]}
                  domain={domain}
                  activeTab={activeTab}
                  counterfactualSelected={counterfactualSelected}
                  setCounterfactualSelected={setCounterfactualSelected}
                />
              )
            }
          })}
          {curves && curves[selectedStates[0]] && (
            <NavigatorPlot
              curves={curves[selectedStates[0]].curves}
              zoomDateRange={zoomDateRange}
              setZoomDateRange={setZoomDateRange}
              domain={domain}
              caseLoadAxis={caseLoadAxis}
            />
          )}
        </section>
      </article>
    </div>
  )
}

export default PolicyModel
