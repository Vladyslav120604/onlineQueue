var socket = io();
var $loginBtn = $('.addToQueue');
var $mainBtn = $('#mainBtn');
var $time = $('#time');
var $infin = $('#infin');
var $sec = $('#sec');
var $min = $('#min');

var socketId = '';
var socketQueue = [];
const ACCESSSECONDS = 20;
$loginBtn.click(function (){
    socket.emit('add to queue');
    $loginBtn.prop('disabled', true);
});

// $mainBtn.click(function(){
//     socket.emit('start minute');
// })


socket.on('set timer', function(time, id, queue){
  time = time - ACCESSSECONDS;
  console.log('Set time on '+ ACCESSSECONDS);
    timer();
    socketId = id;
    socketQueue = queue;
});

socket.on('give access', function(){
    console.log('give access');
    accessTimer(ACCESSSECONDS);
    setAccessToBtn(false);
});

socket.on('endless access', function(){
    console.log('endless access');
});

socket.on('take away access', function(){
    console.log('take away access');
    setAccessToBtn(true);
    $infin.css('display', 'none');
});
socket.on('update timers', function(queue) {
  console.log('timers updated');
  console.log(queue);
  socketQueue = queue;
  // var obj = socketQueue.find(o => o.id === socketId);
  // var index = socketQueue.indexOf(obj);

});

socket.on('infin', function(){
  console.log('infine');
    $infin.css('display', 'block');
    $time.css('display', 'none');
})

// socket.on('verification', function(val){
//     if(!val){
//         setAccessToBtn(true);
//         console.log('verification false');
//     }
// })

function timer(time){
  // console.log('set timer on '+time+' seconds');
  var timer = setInterval(function(){
    var obj = socketQueue.find(o => o.id === socketId);
    var index = socketQueue.indexOf(obj);
    console.log(index);
    var time = socketQueue[index]['time'];
    if (time < ACCESSSECONDS) {
      clearInterval(timer);
      // $('#time').css('display', 'none');
      return 0;
    }
    var toAccess = time - ACCESSSECONDS;
    var min = Math.floor(toAccess/60);
    var sec = toAccess-(min*60);
    $sec.html(sec);
    $min.html(min);
    socketQueue[index]['time']--;
  }, 1000);
}

function accessTimer(time){
    var timer = setInterval(function(){
        $('#sec').html(time);
        time--;
    }, 1000);

    setTimeout(function(){
        clearInterval(timer);
    }, ACCESSSECONDS*1000)
}

function setAccessToBtn (val){
    $mainBtn.prop('disabled', val);
}
