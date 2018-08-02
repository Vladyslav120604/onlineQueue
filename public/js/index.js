var socket = io();
var $loginBtn = $('.addToQueue');
var $mainBtn = $('#mainBtn');

$loginBtn.click(function (){
    socket.emit('add to queue');
    $loginBtn.prop('disabled', true);
});

// $mainBtn.click(function(){
//     socket.emit('start minute');
// })


socket.on('set timer', function(time, id){
  console.log(id);
    timer(time);
});

socket.on('give access', function(){
    console.log('give access');
    timer(15);
    setAccessToBtn(false);
});

socket.on('take away access', function(){
    console.log('take away access');
    setAccessToBtn(true);
});

// socket.on('verification', function(val){
//     if(!val){
//         setAccessToBtn(true);
//         console.log('verification false');
//     }
// })

function timer(time){
  console.log('set timer on '+time+' seconds');
  // clearInterval(timerId);
    var start = 100;
    time = time*1000/100;
    var userProgress = $('#userProgress')
    var timerId = setInterval(function(){
      // $('#time').html(time);
        if(start <= 0){
            clearInterval(timerId);
        }
        userProgress.val(start);
        start--;
    }, time);
}

function setAccessToBtn (val){
    $mainBtn.prop('disabled', val);
}
