import alasql from 'alasql'
alasql('CREATE TABLE mobilities ' +
'(origin string, destination string, people number)');

const mpio = require('../../public/data/mpio');
/**
 * Returns style for leaflet polygon
 * @param  {object} state state
 * @param  {object} action action
 * @return {boolean} boolean
 */
function activeCountryReducer(state = {
  // Just return blank geojson.
  // Note the alpha2 hack
  geojson: {'properties': {'alpha2': null, 'alpha3': null},
            'type': 'FeatureCollection',
            'features': []}
}, action) {
  switch (action.type) {
  case 'COUNTRY_SELECTED':
    let admin_index = mpio.features.reduce((h, f, i) => {
      h[f.properties.admin_id] = i;
      return h;
    }, {});
    // Create a lookup of admin_id to index in features array.
    return Object.assign({}, state, {
      geojson: mpio,
      admin_index: admin_index
    })
  case 'DATE_SELECTED':
    let mobility = bucketBy(action.payload.mobility);

    mobility.forEach((e, i) => {
      if (i%10==0) {
        console.log(i, 'index')
      }
      alasql('INSERT INTO mobilities VALUES ' + e)
    //
    //   alasql("INSERT INTO mobilities VALUES ('" +
    //   e.id_origin + "','" +
    //   e.id_destination + "','" + e.people + "')");
    })
    //

    let res = alasql('SELECT origin, people FROM mobilities ' +
    'where origin = destination;');
    let range = alasql('select min(people) as min, max(people) ' +
    'as max from mobilities where origin = destination');
    let min = range[0].min;
    let max = range[0].max
    let score_table = res.reduce((h, r) => {
      h[r.origin] = score(min, max, r.people);
      return h
    }, {})
    console.log('about to update mpio geojson')

    mpio.features.forEach(f => {
      f.properties.score = score_table[f.properties.admin_id]
    })

    return Object.assign({}, state, {
      geojson: Object.assign({}, mpio)
    })

  default:
    return state
  }
}

/**
 * Returns score between 0 and 1
 * @param  {Object} matrix
 * @return {Array} diagonal
 */
function get_diagonal(matrix) {
  let mmm = matrix.reduce((a, e, i) => {
    a[i] = matrix[i][i] || 0
    // console.log(a.length,i, matrix[i][i], '****')
    return a
  }, []);
  console.log(mmm, 'mmx')
  return mmm
}

/**
 * Returns score between 0 and 1
 * @param  {Integer} mobility
 * @param  {Integer} lookup
 * @return {Object} matrix
 */
function getMatrix(mobility, lookup) {
  // var hash = {};
  let hw = Object.keys(lookup).length;
  let thing = mobility.reduce((ary, row, i) => {
    if (Array.isArray(ary[lookup[row.id_origin]])) {
      ary[lookup[row.id_origin]][lookup[row.id_destination]] =
      parseInt(row.people)
    } else {
      ary[lookup[row.id_origin]] = new Array(hw);
      ary[lookup[row.id_origin]][lookup[row.id_destination]] =
      parseInt(row.people)
    }

    return ary
  }, Array(hw))
  console.log(thing)
  return thing
}

/**
 * Returns score between 0 and 1
 * @param  {Integer} min
 * @param  {Integer} max
 * @param  {Integer} number
 * @return {boolean} score
 */
function score(min, max, number) {
  let score_min = min
  let score_max = max
  let low_bound = 0
  let top_bound = 1
  return (number - score_min) / (score_max - score_min) *
  (top_bound - low_bound) + low_bound
}

/**
 * Returns array in buckets
 * @param  {array} ary state
 * @return {boolean} boolean
 */
function bucketBy(ary) {
  let groupSize = 500;
  return ary.map(function(item, index) {
    return index % groupSize === 0 ?
      ary.slice(index, index + groupSize)
        .map(function(e) {
          return '(\'' + e.id_origin + '\', \'' +
            e.id_destination + '\', ' +
            e.people + ')'
        })
      : null;
  })
    .filter(function(item) {
      return item
    });
}
export default activeCountryReducer
