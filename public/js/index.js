var socket = io();
var $loginBtn = $('.addToQueue');
var $mainBtn = $('#mainBtn');
var socketId = '';
var socketQueue = [];
const ACCESSSECONDS = 10
$loginBtn.click(function (){
    socket.emit('add to queue');
    $loginBtn.prop('disabled', true);
});

// $mainBtn.click(function(){
//     socket.emit('start minute');
// })


socket.on('set timer', function(time, id, queue){
    timer();
    socketId = id;
    socketQueue = queue;
});

socket.on('give access', function(){
    console.log('give access');
    timer(10);
    setAccessToBtn(false);
});

socket.on('take away access', function(){
    console.log('take away access');
    setAccessToBtn(true);
});
socket.on('update timers', function(queue) {
  console.log('updated');
  socketQueue = queue;
  // var obj = socketQueue.find(o => o.id === socketId);
  // var index = socketQueue.indexOf(obj);

});
// socket.on('verification', function(val){
//     if(!val){
//         setAccessToBtn(true);
//         console.log('verification false');
//     }
// })

function timer(){
  // console.log('set timer on '+time+' seconds');
  var timer = setInterval(function(){
    var obj = socketQueue.find(o => o.id === socketId);
    var index = socketQueue.indexOf(obj);
    var time = socketQueue[index]['time'];
    if (time < ACCESSSECONDS) {
      clearInterval(timer);
      $('#time').css('display', 'none');
      return 0;
    }
    var toAccess = time -10;
    var min = Math.floor(toAccess/60);
    var sec = toAccess-(min*60);
    $('#sec').html(sec);
    $('#min').html(min);
    socketQueue[index]['time']--;
  }, 1000);
}

function setAccessToBtn (val){
    $mainBtn.prop('disabled', val);
}
