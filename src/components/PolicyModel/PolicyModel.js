import React, { useState } from 'react';
import axios from 'axios';

import loadModels from './LoadModels';
import parseModels from './parseModels';

// import PolicyPlot from '../PolicyPlot/PolicyPlot';
import State from '../State/State';

import styles from './PolicyModel.module.scss';

import states from './states';

const PolicyModel = () => {
  const [activeTab, setActiveTab] = useState('existing');

  // use selected states to load the required models
  const [selectedStates, setSelectedStates] = useState(['CO', 'CA']);

  // curves selected by the user
  const [selectedCurves, setSelectedCurves] = useState([
    'infected_b',
    'infected_c',
    'dead',
  ]);

  const [curves, setCurves] = useState();
  const [dateRange, setDateRange] = useState([]);
  const [caseLoadAxis, setCaseLoadAxis] = useState([0, 100]);

  React.useEffect(() => {
    const initialSetup = async () => {
      console.log('before await call loadmodels');
      const loadedModels = await loadModels(selectedStates);
      console.log('after await call loadmodels');

      console.log(loadedModels);

      // get curves, max, min from models
      const modelCurves = parseModels(loadedModels);
      // setCurves(modelCurves);
      console.log(modelCurves);

      // set up axes
      const dates = Object.values(modelCurves)
        .map((state) => state.dateRange)
        .flat();

      console.log(dates);

      setDateRange([
        dates.reduce((prev, curr) => (prev > curr ? curr : prev)),
        dates.reduce((prev, curr) => (prev < curr ? curr : prev)),
      ]);
    };

    initialSetup();
  }, [selectedStates]);

  return (
    <article className={styles.main}>
      <h1>COVID policy model</h1>
      <div className={styles.tabrow}>
        <button
          onClick={() => setActiveTab('existing')}
          style={{
            background: activeTab === 'existing' ? '#bde7ff' : '#bde7ff32',
            color: activeTab === 'existing' ? 'inherit' : 'white',
          }}
        >
          Existing policies
        </button>
        <button
          onClick={() => setActiveTab('interventions')}
          style={{
            background: activeTab === 'interventions' ? '#bde7ff' : '#bde7ff32',
            color: activeTab === 'interventions' ? 'inherit' : 'white',
          }}
        >
          Evaluate policy interventions
        </button>
        <div className={styles.location}>
          <label>
            Choose Location
            <select
              value={selectedStates[0]}
              onChange={(e) => setSelectedStates([e.target.value])}
            >
              {states.map((state) => (
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
        {/* <State */}
        {/*   dateRange={dateRange} */}
        {/*   setDateRange={setDateRange} */}
        {/*   // dateOffset={0} */}
        {/*   caseLoadAxis={caseLoadAxis} */}
        {/*   selectedState={selectedStates[0]} */}
        {/* /> */}
        {/* <State */}
        {/*   dateRange={dateRange} */}
        {/*   setDateRange={setDateRange} */}
        {/*   // dateOffset={0} */}
        {/*   caseLoadAxis={caseLoadAxis} */}
        {/*   selectedState={'CA'} */}
        {/* /> */}
      </section>
    </article>
  );
};

export default PolicyModel;
