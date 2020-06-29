// Take an array of models, one per state, and
// split them into curves for each column and source

// Structure:

// {
//   'state': {
//     dateRange: {min: min, max: max},
//     yMax: 1235,
//     curves: {
//       'curve name': {
//         yMax: 12345,
//         actuals: [{x: x, y: y}],
//         model: [{x: x, y: y}],
//       },
//     },
//   },
// }

export default function parseModelCurves(models, selectedCurves) {
  const curves = {};

  models.forEach((model) => {
    const state = model.state;
    console.log(state);

    // create state object
    curves[state] = {
      dateRange: [],
      yMax: 0,
      curves: {},
      interventions: [],
      deaths: model.deaths,
      cases: model.cases,
      date: model.date,
    };

    // create basic structure
    Object.keys(model.results.run[0]).forEach((column) => {
      if (selectedCurves.includes(column)) {
        curves[state].curves[column] = {};
        curves[state].curves[column]['actuals'] = [];
        curves[state].curves[column]['model'] = [];
        curves[state].curves[column]['yMax'] = 0;
      }
    });

    const trimmedData = model.results.run;

    // split data into curves and maxiumus
    // split out actuals and model run
    trimmedData.forEach((day, index) => {
      Object.entries(day).forEach(([column, value]) => {
        if (selectedCurves.includes(column)) {
          // splitting out sources to make plotting easier later
          const source = day.source === 'actuals' ? 'actuals' : 'model';
          // skipping every fifth day of the model just to improve
          // rendering performance, especially with multiple plots
          if (source === 'model') {
            if (
              index % 5 === 0 ||
              trimmedData[index - 1].source === 'actuals'
            ) {
              curves[state].curves[column][source].push({
                x: day.date,
                y: value,
              });
            }
          } else {
            curves[state].curves[column][source].push({
              x: day.date,
              y: value,
            });
          }

          // doing yMax as we go because we're already looping anyway
          curves[state].curves[column].yMax =
            curves[state].curves[column].yMax > value
              ? curves[state].curves[column].yMax
              : value;
        }
      });
    });

    // date range for the state
    const dates = model.results.run.map((day) => day.date);
    curves[state].dateRange.push(dates.slice(0, 1)[0]);
    curves[state].dateRange.push(dates.slice(-1)[0]);

    // yMax for the state
    const peaks = Object.entries(curves[state].curves).map(
      ([curve, points]) =>
        // selectedCurves.includes(curve) ? points.yMax : 0
        points.yMax
    );
    curves[state].yMax = Math.max(...peaks);
  });

  return curves;
}
