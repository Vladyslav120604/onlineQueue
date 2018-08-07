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
        socket.emit('set timer', socket.id, queue);
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
        queue[0]['time']--;
      }, 1000);
}
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
        updateTimers(index);
        clearInterval(socket.accessTimer);
        clearInterval(socket.checkAccess);
        // console.log(queue);
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

    if (queue[index]['time'] <= ACCESSSECONDS) {
      clearInterval(socket.checkAccess);
      socket.emit('give access');
      accessTimer(socket);
      return 0;
    }
    var toAccess = queue[index]['time']-10;
    // console.log('Time to Access: ' + toAccess);
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
    return queue[arrayItemId-1]['time']+ACCESSSECONDS;
}

function deleteUserFromQueue(id){
    queue.splice(id, 1);
    console.log('Ok, it delete: ' + id);
}

function updateTimers(deleteIndex) {
  if (deleteIndex == 0) {
    return false;
  }
    var changeArray = [];
    for (var i = 0; i < queue.length; i++) {
      changeArray.push(queue[i]['time'])
    }
    for (var i = (deleteIndex+1); i < queue.length; i++) {
      changeArray[i] = queue[i-1]['time'];
    }
    for (var i = 0; i < queue.length; i++) {
      queue[i]['time'] = changeArray[i];
    }
    io.emit('update timers', queue);
}
http.listen(4000, function(){
  console.log('listening on *:4000');
});
