const canvas = document.getElementById("tetris");
const context = canvas.getContext('2d');

context.scale(20,20);





function collide(arena, player){
    const [m, o] = [player.matrix , player.pos];
    for(let y = 0; y < m.length ; ++y){
        for(let x = 0; x< m[y].length; ++x){
            if(m[y][x] !== 0 && (arena[y + o.y] && arena[y +o.y][x + o.x]) !== 0){
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h){
    const matrix = [];
    while(h --){
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPice(type){
    if(type === "T"){
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    }else if(type === "O"){
        return [
            [1, 1],
            [1, 1],
        ];
    }else if(type === "L"){
        return [
            [0, 1, 0], 
            [0, 1, 0],
            [0, 1, 1],
        ];
    }else if(type === "J"){
        return [
            [0, 1, 0], 
            [0, 1, 0],
            [1, 1, 0],
        ];
    }else if(type === "I"){
        return [
            [0, 1, 0, 0]
            [0, 1, 0, 0], 
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    }else if(type === "S"){
        return [
            [0, 1, 1], 
            [1, 1, 0],
            [0, 0, 0],
        ];
    }else if(type === "Z"){
        return [
            [1, 1, 0], 
            [0, 1, 1],
            [0, 0, 0],
        ];
    }
    
}

function draw(){
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width , canvas.height);

    drawMatrix(arena , {x:0 , y: 0});
    drawMatrix(player.matrix, player.pos);
}


function drawMatrix(matrix , offset){
    matrix.forEach((row , y)=> {
        row.forEach((value , x)=> {
            if(value !== 0){
                context.fillStyle = 'red';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function merge(arena, player){
    player.matrix.forEach((row,y)=>{
        row.forEach((value , x)=>{
            if(value !==0){
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop(){
    player.pos.y ++;
    if(collide(arena , player)){
        player.pos.y--;
        merge(arena, player);
        playerReset();

    }
    dropCounter = 0;
}

function playerMove(dir){
    player.pos.x += dir;
    if(collide(arena,player)){
        player.pos.x -=dir;
    }
}

function playerReset(){
    const pieces = 'ILJOTSZ';
    player.matrix = createPice(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x =(arena[0].length/2 | 0)-(player.matrix[0].length/2 | 0);
    if(collide(arena,player)){
        arena.forEach(row => row.fill(0));
    }

}

function playerRotate(dir){
    const pos = player.pos.x;
    let offset =1;
    rotate(player.matrix, dir);
    while(collide(arena,player)){
        player.pos.x += offset;
        offset = -(offset +(offset > 0? 1 : -1));
        if(offset > player.matrix[0].length){
            rotate(player.matrix , -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, dir){
    for(let y=0; y<matrix.length; ++y){
        for(let x=0; x<y; ++x){
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }
    if(dir > 0){
        matrix.forEach(row => row.reverse());
    }else{
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0){
    const deltaTime = time-lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if(dropCounter > dropInterval){
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

const arena = createMatrix(12 ,20);


const player = {
    pos: {x:5 , y:5},
    matrix: createPice("T"),
}

this.changeDirection = function(direction){
    switch(direction){
        case 'Down':
            playerDrop();
            break; 
        case 'Left':
           /* player.pos.x --; */
           playerMove(-1);
            break; 
        case 'Right':
            playerMove(1);
           /* player.pos.x ++; */
            break; 
        case 'q':
            playerRotate(-1);
            break;
        case 'e':
            playerRotate(1);
            break;
    }
}

window.addEventListener('keydown' , ((evt) =>{
    const direction= evt.key.replace('Arrow', '');
    changeDirection(direction);
    evt.key === 'q';
    evt.key === 'e';
}));

update();