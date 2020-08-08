// Excersize 1
async function runGame(plans,Display) {
    let lives=3;
    for(let level=0;level<plans.length;) {
        if(lives==0) {
            console.log("Game Over.");
            level=0;
            lives=3;
        }
        let status=await runLevel(new Level(plans[level]),Display);
        if(status=="won") {
            level+=1;
            console.log("Level:",level+1,"\ntotal lives left:",lives+".");
        }
        else
            lives-=1;
    }
    console.log("You've won!");
}

//Excersize 2
let pause=1;
function trackKeys(keys) {
    let down=Object.create(null);
    function track(event) {
        if(event.key==="Escape"&&event.type=="keyup") {
            pause*=-1;
            event.preventDefault();
        }
        if(keys.includes(event.key)&&pause==1) {
            down[event.key]=event.type=="keydown";
            event.preventDefault();
        }
    }
    window.addEventListener("keydown",track);
    window.addEventListener("keyup",track);
    return down;
}

function runLevel(level,Display) {
    let display=new Display(document.body,level);
    let state=State.start(level);
    let ending=1;
    return new Promise(resolve=> {
        runAnimation(time => {
            if(pause==1) {
                state=state.update(time,arrowKeys);
                display.syncState(state);
                if(state.status=="playing")
                    return true;
                else if(ending>0) {
                    ending-=time;
                    return true;
                }
                else {
                    display.clear();
                    resolve(state.status);
                    return false;
                }
            }
        });
    });
}

//Excersize 3
class Monster {
    constructor(pos,direction) {
        this.pos=pos;
        this.direction=direction;
    }
    get type() {
        return "monster";
    }
    static create(pos) {
        return new Monster(pos.plus(new Vec(0,-1)),1);
    }
    update(time,state) {
        let speed=this.direction*time*2;
        let newPos=new Vec(this.pos.x+speed,this.pos.y);
        if(state.level.touches(newPos,this.size,"wall")) {
            newPos=new Vec(this.pos.x-speed,this.pos.y);
            return new Monster(newPos,this.direction*-1);
        }
        else
            return new Monster(newPos,this.direction);
    }
    collide(state) {
        let player=state.player;
        if(player.pos.y+player.size.y<this.pos.y+.5) {
            let filtered=state.actors.filter(element=>element!=this);
            return new State(state.level,filtered,state.status);
        }
        else
            return new State(state.level,state.actors,"lost");
    }
}
Monster.prototype.size=new Vec(1.2,2);

const levelChars={
    ".":"empty", "#":"wall", "+":"lava",
    "@":Player, "o":Coin, 
    "=":Lava, "|":Lava, "v":Lava, "M":Monster 
};