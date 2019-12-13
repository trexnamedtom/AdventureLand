//This can be used to unlock a secret quest and skin

//I did not discover this secret, nor did I create this code.


function konami(){
   keyMove("up");
   keyMove("up");
   keyMove("down");
   keyMove("down");
   keyMove("left");
   keyMove("right");
   keyMove("left");
   keyMove("right");
   keyEmit("B");
   keyEmit("A");
 };
function keyMove(dir){
  parent.socket.emit("move", {
    x: character.real_x,
    y: character.real_y,
    going_x: character.real_x,
    going_y: character.real_y,
    m: character.m,
    key: dir});
}
function keyEmit(key){
  parent.socket.emit("interaction", {
    key: key
  });
}