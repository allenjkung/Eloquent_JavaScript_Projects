function findRoute(graph,from,to) {
    let work=[{at:from,route:[]}];
    for(let i=0;i<work.length;i++) {
        let{at,route}=work[i];
        for(let place of graph[at]) {
            if(place==to)
                return route.concat(place);
            if(!work.some(w=>w.at==place))
                work.push({at:place,route:route.concat(place)});
        }
    }
}
function myRobot({place,parcels},route) {
    let paths=[];
    for(let parcel of parcels) {
        if(parcel.place!=place)
            paths.push(findRoute(roadGraph,place,parcel.place));
        else
            paths.push(findRoute(roadGraph,place,parcel.address));
    }
    route=paths[0];
    for(let path of paths) { //finds shortest path in paths
        if(path.length<route.length)
            route=path;
    }
    return {direction:route[0],memory:route.slice(1)};
}