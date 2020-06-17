import React from 'react';

import PolicyPlot from '../PolicyPlot/PolicyPlot';
import states from '../PolicyModel/states.js';

import styles from './State.module.scss';

const State = (props) => (
  <section className={styles.state}>
    <header>
      <div className={styles.stateName}>
        <h1>
          {states.find((state) => state.abbr === props.selectedState).name}
        </h1>
        <h2>May 1, 2020</h2>
      </div>
      <div className={styles.overviewStats}>
        <div className={styles.existing}>
          <h3>Case count with existing policies</h3>
          <div>
            <h4>26,746</h4>
            <h5>cumulative cases</h5>
          </div>
          <div>
            <h4>927</h4>
            <h5>cumulative deaths</h5>
          </div>
        </div>
        <div className={styles.noAction}>
          <label>
            <input type="checkbox" />
            CASE COUNT WITH NO ACTIONS TAKEN
          </label>
          <div>
            <h4>145,203</h4>
            <h5>cumulative cases</h5>
          </div>
          <div>
            <h4>22,597</h4>
            <h5>cumulative deaths</h5>
          </div>
        </div>
      </div>
    </header>
    <div className={styles.policyPlot}>
      <PolicyPlot
        selectedState={props.selectedState}
        dateRange={props.dateRange}
        setDateRange={props.setDateRange}
        caseLoadAxis={props.caseLoadAxis}
        curves={props.curves}
      />
    </div>
  </section>
);

export default State;
