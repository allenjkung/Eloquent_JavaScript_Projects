topScope.array=(...values)=> {
    let arr=[];
    for(let value of values)
        arr.push(value);
    return arr;
}
topScope.length=array=> {
    return array.length;
}
topScope.element=(array,index)=> {
    return array[index];
}
/*-----------------------------------------------------------------------------------------------*/
function skipSpace(string) {
    let first=string.search(/\S/);
    if(first==-1)
        return "";
    else if(string[first]==="#") {
        let nextLine=string.search(/\n/);
        if(nextLine==-1)
            return "";
        return skipSpace(string.slice(nextLine+1));
    }
    return string.slice(first);
}
/*-----------------------------------------------------------------------------------------------*/
specialForms.set=(args,scope)=>{
    if(args.length!=2||args[0].type!="word")
        throw new SyntaxError("Incorrect use of set");
    let property=Object.getPrototypeOf(scope);
    while(property!=undefined) {
        if(Object.prototype.hasOwnProperty.call(property,args[0].name)) {
            let value=evaluate(args[1],scope);
            property[args[0].name]=value;
            return value;
        }
        property=Object.getPrototypeOf(property);
    }
    throw new ReferenceError("Binding is not defined in scope");
};