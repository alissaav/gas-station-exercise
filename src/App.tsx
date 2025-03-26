import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

type Station = {
  id: number;
  fullAddress: string;
  address: string;
  postcode: string;
  district: string;
};

function App() {
  
  const [stations, setStations] = useState<Station[]>([]);
  const [search, setSearch] = useState<string>("");

  function handleSearchInput(e: any){
    setSearch(e.target.value);
    console.log(search)
  }

  useEffect(() => {
    fetch("https://geoportal.stadt-koeln.de/arcgis/rest/services/verkehr/gefahrgutstrecken/MapServer/0/query?where=objectid+is+not+null&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson")
      .then((response) => response.json())
      .then((data) => {
        const parsedStations: Station[] = data.features.map((feature: any) => ({
          id: feature.attributes.objectid,
          fullAddress: feature.attributes.adresse,
          address: feature.attributes.adresse.split('(')[0],
          postcode: feature.attributes.adresse.substring(
            feature.attributes.adresse.indexOf('(') + 1,
            feature.attributes.adresse.lastIndexOf(' ')
          ),
          district: feature.attributes.adresse.substring(
            feature.attributes.adresse.lastIndexOf(' ') + 1,
            feature.attributes.adresse.lastIndexOf(')')
          )
        }));
        setStations(parsedStations);
      });
  }, []);

  const filteredStations = stations.filter((station) =>
    station.fullAddress.toLowerCase().includes(search.toLowerCase())
  );
  
  const listItems = filteredStations.map(station => <div><span>{station.address}</span> <span>{station.postcode}</span> <span>{station.district}</span> </div>);

  return (
    <>
      <h1>Tankstellen in Köln</h1>
      <input value={search} onChange={handleSearchInput}></input>
      <div className="gasstationlist">
        {listItems}
      </div>
    </>
  )
}

export default App
