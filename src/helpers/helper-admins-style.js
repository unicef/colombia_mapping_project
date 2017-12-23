/**
 * countryStyle - Specifies the style for the geojson
 *
 * @param  {type} props description
 * @return {object} style
 */
export function adminStyle(props) {
  return function(geoJsonFeature) {
    const displayCountry = {
      fill: true,
      fillColor: 'red',
      fillOpacity: geoJsonFeature.properties.score || 0,
      stroke: false
    }
    return displayCountry
  }
}
