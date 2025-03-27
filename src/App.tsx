import { useState, useEffect } from 'react'
import './App.css'

type Station = {
  id: number;
  fullAddress: string;
  address: string;
  postcode: string;
  district: string;
  lat: number;
  lng: number;
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
          ),
          lat: feature.geometry.y,
          lng: feature.geometry.x
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
    <a href={"https://www.google.com/maps/place/" + station.lat + "," + station.lng} target="_blank" className="">
      <div className="flex flex-row w-full gap-1 rounded-md px-1 py-2 hover:bg-[#1a1a1a]">
        <span className="address w-[240px] text-left pl-3">{station.address}</span> 
        <span className="postcode w-[130px]">{station.postcode}</span> 
        <span className="district w-[200px] text-left pl-3">{station.district}</span> 
      </div>
    </a>
  
  );

  return (
    <>
      <h1>Tankstellen in Köln</h1>

      <div className="flex flex-row gap-2 items-center my-4 w-full px-2">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
          <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M32.4,26.2l8.1,8.1c1.7,1.7,1.7,4.5,0,6.2l0,0c-1.7,1.7-4.5,1.7-6.2,0L30,36.2"></path>
          <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M8,25c-1.8-4.7-0.8-10.2,3-14c3.8-3.8,9.5-4.8,14.2-2.9"></path>
          <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M31.3,13.1c3.4,5.1,2.8,12.1-1.7,16.6c-4.9,4.9-12.6,5.1-17.7,0.8"></path>
        </svg>

        <input className="pl-2 mr-3 border border-[#646cff] rounded-sm flex-grow" type="search" placeholder='Nach Tankstelle suchen...' value={search} onChange={handleSearchInput}></input>

      </div>

      <div className="flex flex-col mx-auto">
        <div className="flex flex-row w-full gap-1 mb-2" >
          <button className="w-[240px] text-left" onClick={() => handleOrderChange("asc-address")}>Adresse</button>
          <button className="w-[130px]" onClick={() => handleOrderChange("asc-postcode")}>Postleitzahl</button>
          <button className="w-[200px] text-left" onClick={() => handleOrderChange("asc-district")}>Stadtteil</button>
        </div>
        {rows}
      </div>
    </>
  )
}

export default App
