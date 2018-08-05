var socket = io();
var $loginBtn = $('.addToQueue');
var $mainBtn = $('#mainBtn');

$loginBtn.click(function (){
    socket.emit('add to queue');
    // $loginBtn.prop('disabled', true);
});

// $mainBtn.click(function(){
//     socket.emit('start minute');
// })


socket.on('set timer', function(time){
    timer(time);
});

socket.on('give access', function(){
    console.log('give access');
    timer(10);
    setAccessToBtn(false);
});

socket.on('endless access', function(){
    console.log('endless');
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
    var start = 100;
    time = time*1000/100;

    var userProgress = $('#userProgress')
    var timerId = setInterval(function(){
        if(start <= 0){
            clearInterval(timerId);
        }
        userProgress.val(start);
        start--;
    }, time)
};

function setAccessToBtn (val){
    $mainBtn.prop('disabled', val);
}
