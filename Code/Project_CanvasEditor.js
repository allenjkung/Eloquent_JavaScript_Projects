//Excersize 1
class PixelEditor {
    constructor(state,config) {
        let{tools,controls,dispatch}=config;
        this.state=state;
        this.canvas=new PictureCanvas(state.picture,pos=> {
            let tool=tools[this.state.tool];
            let onMove=tool(pos,this.state,dispatch);
            if(onMove)
                return pos=>onMove(pos,this.state);
        });
        this.controls=controls.map(
            Control=>new Control(state,config));
        this.dom=elt("div",{},this.canvas.dom,elt("br"),
            ...this.controls.reduce(
                (a,c)=>a.concat(" ",c.dom),[]));
        let canvas=document.querySelectorAll('[tabIndex]')[0];
        canvas.addEventListener("keydown",event => {
            if(event.ctrlKey||event.metaKey) {
                event.preventDefault();
                if(event.key=='z')
                    dispatch({undo:true});
                else if(event.key=='s') {
                    let saveState=new SaveButton(this.state);
                    saveState.save();
                }
                else if(event.key=='l')
                    startLoad(dispatch);
            }
            else if(!event.ctrlKey||!event.metaKey) {
                event.preventDefault();
                for(let i in tools) {
                    if(event.key==i[0])
                        dispatch({tool:i});
                }
            }
        });
    }
    syncState(state) {
        this.state=state;
        this.canvas.syncState(state.picture);
        for(let ctrl of this.controls)
            ctrl.syncState(state);
    }
}
//Excersize 2
const scale=10;
class PictureCanvas {
    constructor(picture,pointerDown) {
        this.dom=elt("canvas", {
            onmousedown:event=>this.mouse(event,pointerDown),
            ontouchstart:event=>this.touch(event,pointerDown)
        });
        this.syncState(picture);
    }
    syncState(picture) {
        if(this.picture==picture)
            return;
        this.picture=picture;
        drawPicture(this.picture,this.dom,scale);
    }
}
function drawPicture(picture,canvas,scale,prevPict) {
    if(prevPict==null||prevPict.width!=picture.width||prevPict.height!=picture.height) {
        canvas.width=picture.width*scale;
        canvas.height=picture.height*scale;
        if(prevPict==null)
            previous=null;
    }
    
    let cx=canvas.getContext("2d");
    for(let y=0;y<picture.height;y++) {
        for(let x=0;x<picture.width;x++) {
            if(previous==null||previous.pixel(x,y)!=color) {
                cx.fillStyle=picture.pixel(x,y);
                cx.fillRect(x*scale,y*scale,scale,scale);
            }
        }
    }
}
PictureCanvas.prototype.syncState=function(picture) {
    if(this.picture==picture)
        return;
    drawPicture(picture,this.dom,scale,this.picture);
    this.picture=picture;
}
//Excersize 3
function circle(pos,state,dispatch) {
    function drawCircle(tempPos) {
        let drawn=[];
        let radius=Math.ceil(Math.sqrt(Math.pow((tempPos.x-pos.x),2)+Math.pow((tempPos.y-pos.y),2)));
        for(let xcoord=-radius;xcoord<=radius;xcoord++) {    
            for(let ycoord=-radius;ycoord<=radius;ycoord++) {
                let edge=Math.sqrt(Math.pow(xcoord,2)+Math.pow(ycoord,2));
                x=xcoord+pos.x;
                y=ycoord+pos.y;
                if(x<0||x>=state.picture.width||y<0||y>=state.picture.height||(edge>radius))
                    continue;
                console.log(x,y);
                drawn.push({x,y,color:state.color});
            }
        }
        dispatch({picture:state.picture.draw(drawn)});
    }
    drawCircle(pos);
    return drawCircle;
}
//Excersize 4
function lineCoords(start,end,color,xory) {
    let coords=[];
    if(xory==0) {
        let slope=(end.y-start.y)/(end.x-start.x);
        for(let {x,y}=start;x<=end.x;x++) {
            coords.push({x,y:Math.round(y),color});
            y+=slope;
        }
    }
    else {
        let slope=(end.x-start.x)/(end.y-start.y);
        for(let {x,y}=start;y<=end.y;y++) {
            coords.push({x:Math.round(x),y,color});
            x+=slope;
        }
    }
    return coords;
}
function drawLine(start,end,color) {
    if(Math.abs(start.x-end.x)>Math.abs(start.y-end.y)) {
        if(start.x>end.x)
            return drawn=lineCoords(end,start,color,0)
        else
            return drawn=lineCoords(start,end,color,0);
    }
    else {
        if(start.y>end.y)
            return drawn=lineCoords(end,start,color,1);
        else
            return drawn=lineCoords(start,end,color,1);
    }
}
function draw(pos,state,dispatch) {
    function drawPixel({x,y},state) {
        let line=drawLine(pos,{x,y},state.color);
        pos={x,y};
        dispatch({picture:state.picture.draw(line)});
    }
    drawPixel(pos,state);
    return drawPixel;
}
function line(pos,state,dispatch) {
    return newPos=> {
        dispatch({picture:state.picture.draw(drawLine(pos,newPos,state.color))});
    };
}
//Excersize 3/4
const baseTools={draw,fill,rectangle,pick,circle,line};