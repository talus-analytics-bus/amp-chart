import React, { useState } from 'react'

import loadModels from './LoadModels'
import parseModels from './parseModels'

// import PolicyPlot from '../PolicyPlot/PolicyPlot';
import State from '../State/State'
import NavigatorPlot from '../PolicyPlot/NavigatorPlot/NavigatorPlot'

import styles from './PolicyModel.module.scss'

import states from './states'

const PolicyModel = () => {
  const [activeTab, setActiveTab] = useState('interventions')

  // use selected states to load the required models
  const [selectedStates, setSelectedStates] = useState(['CO', 'IA'])

  const [counterfactualSelected, setCounterfactualSelected] = useState(false)

  // curves selected by the user
  const [selectedCurves, setSelectedCurves] = useState([
    // 'infected_a',
    'infected_b',
    'infected_c',
    'R effective',
    'dead',
  ])

  const [curves, setCurves] = useState()
  const [zoomDateRange, setZoomDateRange] = useState([0, 1])
  const [domain, setDomain] = useState([0, 1])
  const [caseLoadAxis, setCaseLoadAxis] = useState([0, 1])

  //   const ModelSetup = async () => {
  //
  //   }

  React.useEffect(() => {
    const initialSetup = async () => {
      const loadedModels = await loadModels(selectedStates)

      console.log(loadedModels)

      // get curves, max, min from models
      const modelCurves = parseModels(
        loadedModels,
        selectedCurves,
        counterfactualSelected
      )

      console.log(modelCurves)
      setCurves(modelCurves)

      // set up axes
      const dates = Object.values(modelCurves)
        .map(state => state.dateRange)
        .flat()

      // console.log('Date Range: ', [
      //   dates.reduce((prev, curr) => (prev > curr ? curr : prev)),
      //   dates.reduce((prev, curr) => (prev < curr ? curr : prev)),
      // ]);

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

      // console.log('Case Load Range: ', [
      //   0,
      //   Math.max(...Object.values(modelCurves).map((state) => state.yMax)),
      // ]);

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
        <h1>Social distancing model (info button)</h1>
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
              Choose Location
              <select
                value={selectedStates[0]}
                onChange={e => setSelectedStates([e.target.value])}
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
              <select>
                <option value="caseload">Caseload</option>
              </select>
            </label>
          </div>
          {selectedStates.map(state => {
            if (curves && curves[state]) {
              return (
                <State
                  key={state}
                  zoomDateRange={zoomDateRange}
                  setZoomDateRange={setZoomDateRange}
                  // dateOffset={0}
                  caseLoadAxis={caseLoadAxis}
                  selectedState={state}
                  curves={curves[state]}
                  domain={domain}
                  activeTab={activeTab}
                  counterfactualSelected={counterfactualSelected}
                  setCounterfactualSelected={setCounterfactualSelected}
                />
              )
            } else {
              // This is where a loading component should go
              return false
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
