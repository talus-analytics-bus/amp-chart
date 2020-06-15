import React, { useState } from 'react';
import axios from 'axios';

// import PolicyPlot from '../PolicyPlot/PolicyPlot';
import State from '../State/State';

import styles from './PolicyModel.module.scss';

import states from './states';

const PolicyModel = () => {
  const [activeTab, setActiveTab] = useState('existing');

  const [selectedStates, setSelectedStates] = useState(['CO']);

  const [dateRange, setDateRange] = useState([0, 100]);
  const [caseLoadAxis, setCaseLoadAxis] = useState([0, 100]);
  const [models, setModels] = useState();

  const getModels = async () => {
    // const date = new Date();
    // const dateString = `${date.getFullYear()}-${
    //   date.getMonth() + 1
    // }-${date.getDate()}`;

    // console.log(dateString);

    selectedStates.forEach(async (state) => {
      const result = await axios(
        'http://192.168.1.33:8000/state_base_model/' + state
      );
      const runData = result.data;
      runData.results.run = JSON.parse(runData.results[0].run);
      runData.results.run.map((day) => ({
        ...day,
        date: 5,
      }));

      console.log(runData);
      setModels({
        ...models,
        [state + runData.date]: runData,
      });
    });
  };

  React.useEffect(() => {
    getModels();
  }, []);

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
        <State
          dateRange={dateRange}
          setDateRange={setDateRange}
          // dateOffset={0}
          caseLoadAxis={caseLoadAxis}
          selectedState={selectedStates[0]}
        />
        <State
          dateRange={dateRange}
          setDateRange={setDateRange}
          // dateOffset={0}
          caseLoadAxis={caseLoadAxis}
          selectedState={'CA'}
        />
      </section>
    </article>
  );
};

export default PolicyModel;
