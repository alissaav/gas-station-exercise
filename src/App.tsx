import { useState, useEffect } from 'react'
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
  const [sortOrder, setSortOrder] = useState<"asc-address" | "desc-address" | "asc-postcode" | "desc-postcode" | "asc-district" | "desc-district">("asc-district");

  function handleSearchInput(e: any){
    setSearch(e.target.value);
  }

  function handleOrderChange(order: string){
    if(order === sortOrder){
      switch (order) {
        case "asc-address": 
          setSortOrder("desc-address");
          break;
        case "asc-postcode": 
          setSortOrder("desc-postcode");
          break;
        case "asc-district": 
          setSortOrder("desc-district");
          break;
      }
    } else setSortOrder(order);
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

  const sortedStations = [...filteredStations].sort((a, b) => {
    switch (sortOrder) {
      case 'asc-address':
        return a.address.localeCompare(b.address);
      case 'desc-address':
        return b.address.localeCompare(a.address);
      case 'asc-postcode':
        return a.postcode.localeCompare(b.postcode);
      case 'desc-postcode':
        return b.postcode.localeCompare(a.postcode);
      case 'asc-district':
        return a.district.localeCompare(b.district);
      case 'desc-district':
        return b.district.localeCompare(a.district);
    }
  })
  
  const rows = sortedStations.map(station => 
  <tr>
    <td className="address">{station.address}</td> 
    <td className="postcode">{station.postcode}</td> 
    <td className="district">{station.district}</td> 
  </tr>
  );

  return (
    <>
      <h1>Tankstellen in Köln</h1>
      <input value={search} onChange={handleSearchInput}></input>
      <table className="station-table">
        <tr className="table-header">
          <th className="address" onClick={() => handleOrderChange("asc-address")}>Adresse</th>
          <th className="postcode" onClick={() => handleOrderChange("asc-postcode")}>Postleitzahl</th> 
          <th className="district" onClick={() => handleOrderChange("asc-district")}>Stadtteil</th> 
        </tr>
        {rows}
      </table>
    </>
  )
}

export default App
