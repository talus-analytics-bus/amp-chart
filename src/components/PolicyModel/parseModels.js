// Take an array of models, one per state, and
// split them into curves for each column and source

// Structure:

// {
//   'state': {
//     dateRange: {min: min, max: max},
//     curves: {
//       'curve name': {
//         yMax: 12345,
//         actuals: [{x: x, y: y}],
//         model: [{x: x, y: y}],
//       },
//     },
//   },
// }

export default function parseModelCurves(models) {
  const curves = {};

  Object.entries(models).forEach(([state, model]) => {
    // create state
    curves[state] = {
      dateRange: [],
      curves: {},
    };

    // create basic structure
    Object.keys(model.results.run[0]).forEach((column) => {
      if (!['date', 'source'].includes(column)) {
        curves[state].curves[column] = {};
        curves[state].curves[column]['actuals'] = [];
        curves[state].curves[column]['model'] = [];
        curves[state].curves[column]['yMax'] = 0;
      }
    });

    // split data into curves and maxiumus
    // split out actuals and model run
    model.results.run.forEach((day) => {
      Object.entries(day).forEach(([column, value]) => {
        if (!['date', 'source'].includes(column)) {
          // splitting out sources to make plotting easier later
          const source = day.source === 'actuals' ? 'actuals' : 'model';
          curves[state].curves[column][source].push({
            x: day.date,
            y: value,
          });

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
  });

  return curves;
}
