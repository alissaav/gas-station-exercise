function StationListItem(props: any) {
    const station = props.station;
    return (
        <a href={"https://www.google.com/maps/place/" + station.lat + "," + station.lng} target="_blank" className="">
            <div className="flex flex-row w-full gap-1 rounded-md px-1 py-2 hover:bg-[#1a1a1a]">
                <span className="address w-[240px] text-left pl-3">{station.address}</span> 
                <span className="postcode w-[150px]">{station.postcode}</span> 
                <span className="district w-[200px] text-left pl-3">{station.district}</span> 
            </div>
        </a>
    );
}

export default StationListItem;