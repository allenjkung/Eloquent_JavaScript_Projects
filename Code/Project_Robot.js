function compareRobots(robot1,memory1,robot2,memory2) {
    let totalTurns1=0;
    let totalTurns2=0;
    for(let i=1;i<=100;i++) {
        let curScen=VillegeState.random();
        totalTurns1+=runRobot(curScen,robot1,memory1);
        totalTurns2+=runRobot(curScen,robot2,memory2);
    }
    console.log(`robot1 has mean of ${Math.floor(totalTurns1/100)} turns per run.`);
    console.log(`robot2 has mean of ${Math.floor(totalTurns2/100)} turns per run.`);
}
/*-----------------------------------------------------------------------------------------------*/
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