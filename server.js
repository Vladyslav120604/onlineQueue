var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var queue = [];
var isUserAdded = false;
const ACCESSSECONDS = 15;
app.use(express.static(__dirname +'/public'));


io.on('connection', function(socket){
    console.log('user connected');


    socket.on('disconnect', function(){
        console.log('dis');
        // console.log(socket.queueUserId);
        deleteUserFromQueue(socket.queueUserId);
        // for (var i = socket.queueUserId; i < queue.length; i++) {
        //
        //   var timeToStart = getTimeToStart(i);
        //
        //   socket.emit('set timer', timeToStart);
        //
        //   queueTimer(timeToStart, socket);
        // }
        // console.log('toEnd');
        console.log(queue);
    });

    socket.on('add to queue', function(){
      var timeToStart = getTimeToStart(queue.length);
        queue.push({
            id: socket.id,
            time: timeToStart
        });

        socket.queueUserId = queue.length-1;


        socket.emit('set timer', timeToStart, queue);

        queueTimer(timeToStart, socket);
        console.log(queue);
    });
});

function accessTimer(userId, socket){  //вот здесь userId = 0
  console.log('id:' + userId);
  console.log(queue.length);
  // if (queue.length == 0) {
  //   return false;
  // }
  // console.log('asdafsfas');
    var queueTimer = setInterval(function(){
      console.log('smth');
        queue[0]['time']--;
        // console.log(userId);
        console.log(queue[0]['time']);
    }, 1000);

    setTimeout(function(){
        clearInterval(queueTimer);
        socket.emit('take away access');
        socket.disconnect();
    }, ACCESSSECONDS * 1000);
}

function queueTimer(timeToStart, socket){
    setTimeout(function(){
        socket.emit('give access');
        accessTimer(socket.queueUserId, socket);
    }, timeToStart*1000);
}

// function checkUser (id){
//     if(id === queue[0]){
//         return true
//     }
// }

function addToQueue (userID){
    queue.push(userID);
}

function getTimeToStart(arrayItemId){
  if (arrayItemId == 0) {
    return 0;
  }
    // var seconds = 0;
    // for (let i = 0; i < arrayItemId; i++) {
    //     var seconds = seconds + queue[i]['time'];
    // }
    // console.log();
    return queue[arrayItemId-1]['time']+ACCESSSECONDS;
}

function deleteUserFromQueue(id){
    queue.splice(id, 1);
}

function access() {

}
http.listen(4000, function(){
  console.log('listening on *:4000');
});
