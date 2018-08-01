var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var queue = [];
var isUserAdded = false;

app.use(express.static(__dirname +'/public'));


io.on('connection', function(socket){
    console.log('user connected');


    socket.on('disconnect', function(){
        console.log('dis')
    });

    socket.on('add to queue', function(){
        queue.push({
            id: socket.id,
            time: 60
        });

        socket.queueUserId = queue.length-1;

        var timeToStart = getTimeToStart(socket.queueUserId);

        socket.emit('set timer', timeToStart);

        queueTimer(timeToStart, socket);

    });
});

function accessTimer(userId, socket){
    var queueTimer = setInterval(function(){
        queue[userId]['time']--;
        console.log(userId);
        console.log(queue[userId]['time']);
    }, 1000)
    setTimeout(function(){
        clearInterval(queueTimer);
        socket.emit('take away access');
        socket.disconnect();
    }, 60000)
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
    var seconds = 0;
    for (let i = 0; i < arrayItemId; i++) {
        var seconds = seconds + queue[i]['time'];
    }
    return seconds
}

// function deleteUserFromQueue(id){
//     queue.splice(id, 1);
// }

http.listen(3000, function(){
  console.log('listening on *:3000');
});          