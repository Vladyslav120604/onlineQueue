var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var queue = [];
var isUserAdded = false;
const ACCESSSECONDS = 10;
app.use(express.static(__dirname +'/public'));


io.on('connection', function(socket){
    console.log('user connected');


    socket.on('disconnect', function(){
        console.log('dis');
        disconnect(socket);
    });

    socket.on('add to queue', function(){
      var timeInQueue = getTimeInQueue(queue.length);
        queue.push({
            id: socket.id,
            time: timeInQueue,
        });

        // socket.socketId = socket.id;
        var obj = queue.find(o => o.id === socket.id);
        var index = queue.indexOf(obj);


        socket.emit('set timer', queue[index]['time'], socket.id, queue);
        timer(socket);
        console.log(queue);
    });
});

function accessTimer(socket, isDelete){  //вот здесь userId = 0
      if (isDelete) {
        clearInterval(accessTimer);
        return false;
      }
      socket.accessTimer = setInterval(function(){
        if (queue[0]['time'] <= 0 && queue.length == 1) {
          queue[0]['time'] = 1;
          socket.emit('infin');
        }
        if (queue[0]['time'] <= 0) {
          clearInterval(socket.accessTimer);
          socket.emit('take away access');
          disconnect(socket);
          return 0;
        }
        console.log('Time to access end: ' + queue[0]['time']);
        queue[0]['time']--;
      }, 1000);
}
// function queueTimer(index, socket){
//   var timerToAccess = setInterval(function(){
//     // console.log('smth');
//       queue[index]['timeToStart']--;
//       // console.log(userId);
//       // console.log(queue[0]['time']);
//   }, 1000);
//     var timeToAccess = setTimeout(function(){
//         clearInterval(timerToAccess);
//         socket.emit('give access');
//         accessTimer(socket);
//     }, queue[index].timeToStart*1000);
//     console.log(socket);
function disconnect(socket){
    var obj = queue.find(o => o.id == socket.id);
        var index = queue.indexOf(obj);
        // // console.log(index);
        if (index == -1) {
          return false;
        }
        // console.log('result');
        // console.log(queue[index]['time'] = 0);
        // accessTimer(socket, true);
        // clearInterval(checkAccess);
        clearInterval(socket.accessTimer);
        clearInterval(socket.checkAccess);
        // console.log(queue);
        updateTimers(index);
        deleteUserFromQueue(index);
        // console.log(queue);
}
//
// }
function timer(socket) {
  // console.log('Index:' + index);
  // console.log('Time: ' + queue[index]['time']);
  socket.checkAccess = setInterval(function(){
    var obj = queue.find(o => o.id === socket.id);
    var index = queue.indexOf(obj);

    if (queue[index]['time'] < ACCESSSECONDS) {
      clearInterval(socket.checkAccess);
      socket.emit('give access');
      accessTimer(socket);
      return 0;
    }
    var toAccess = queue[index]['time']-10;
    console.log('Time to Access: ' + toAccess);
    queue[index]['time']--;
  }, 1000);
}

// function checkUser (id){
//     if(id === queue[0]){
//         return true
//     }
// }

function addToQueue (userID){
    queue.push(userID);
}

function getTimeInQueue(arrayItemId){
  if (arrayItemId == 0) {
    return ACCESSSECONDS;
  }
    // var seconds = 0;
    // for (let i = 0; i < arrayItemId; i++) {
    //     var seconds = seconds + queue[i]['time'];
    // }
    // console.log();
    return queue[arrayItemId-1]['time']+ACCESSSECONDS;
    // return seconds;
}

function deleteUserFromQueue(id){
    queue.splice(id, 1);
    console.log('Ok, it delete');
}

function updateTimers(deleteIndex) {
    var delTime = queue[deleteIndex]['time'];
    for (var i = deleteIndex; i < queue.length; i++) {
      queue[i]['time']-=delTime;
    }
    io.emit('update timers', queue);
}
http.listen(4000, function(){
  console.log('listening on *:4000');
});
