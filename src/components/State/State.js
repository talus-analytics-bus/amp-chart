import React from 'react'

import PolicyPlot from '../PolicyPlot/PolicyPlot'
import states from '../PolicyModel/states.js'

import styles from './State.module.scss'

const formatNumber = number =>
  number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

const State = props => {
  // console.log(cumulativeCases);
  const dateString = new Date(props.curves.date).toLocaleString('default', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <section className={styles.state}>
      <header>
        <div className={styles.stateName}>
          <select
            value={props.selectedState}
            onChange={e => {
              console.log('new array')
              console.log(e.target.value)
              console.log(props.selectedStates.indexOf(props.selectedState))
              props.setSelectedStates(
                props.selectedStates.splice(
                  props.selectedStates.indexOf(props.selectedState),
                  1,
                  e.target.value
                )
              )
            }}
            aria-label={'Select a state to display'}
          >
            {states.map(state => (
              <option key={state.abbr} value={state.abbr}>
                {state.name}
              </option>
            ))}
          </select>
          {/* <h1> */}
          {/*   {states.find(state => state.abbr === props.selectedState).name} */}
          {/* </h1> */}
          {/* <h2>{dateString}</h2> */}
        </div>
        <div className={styles.overviewStats}>
          <div className={styles.existing}>
            <h3>Case count with existing policies</h3>
            <div>
              <h4>{formatNumber(props.curves.cases)}</h4>
              <h5>cumulative cases</h5>
            </div>
            <div>
              <h4>{formatNumber(props.curves.deaths)}</h4>
              <h5>cumulative deaths</h5>
            </div>
          </div>
          <div className={styles.noAction}>
            <label>
              <input
                type="checkbox"
                checked={props.counterfactualSelected}
                onChange={() =>
                  props.setCounterfactualSelected(!props.counterfactualSelected)
                }
              />
              COVID COUNT WITH NO ACTIONS TAKEN
            </label>
            <div>
              <h4>[API]</h4>
              <h5>cumulative cases</h5>
            </div>
            <div>
              <h4>[API]</h4>
              <h5>cumulative deaths</h5>
            </div>
          </div>
        </div>
      </header>
      <div className={styles.policyPlot}>
        {/* <div className={styles.inputRow}> */}
        {/*   <button onClick={e => e.preventDefault()}>reset</button> */}
        {/*   <select> */}
        {/*     <option value="percent">Interventions</option> */}
        {/*   </select> */}
        {/* </div> */}
        <PolicyPlot
          selectedState={props.selectedState}
          zoomDateRange={props.zoomDateRange}
          setZoomDateRange={props.setZoomDateRange}
          caseLoadAxis={props.caseLoadAxis}
          data={props.curves}
          domain={props.domain}
          activeTab={props.activeTab}
          counterfactualSelected={props.counterfactualSelected}
        />
      </div>
    </section>
  )
}

export default State
