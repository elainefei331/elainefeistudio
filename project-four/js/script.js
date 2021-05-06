
const STAR_MIN_SIZE = 20;
const STAR_MAX_SIZE = 40;
const STAR_COUNT = 180;
const STAR_LONGCLICK = 800; 
const MAX_NUM_STAR = 5; 
var container = document.querySelector('.container');
var showClick = document.getElementsByClassName('show-click')[0];
var keyClickTime = 0;
const STAR_TABLE = {
    '65': 'Use Core Glow stones for Outdoor Night Lighting', 
    '66':'Only purchase IDA Approved light fixtures', 
    '67':'Support Dark Sky initiatives',
    '68':'Turn your lights off!',
    '69':'Reduce the use of decorative lighting',
    '70':'Use of covered bulbs that light facing downwards',
    '71':'Use LED Light',
    '72':'Minimizing the use of lights',
    '73':'Use light with automatic systems',
    '74':'Have all information and facts about light pollution',
    '75':'The development of better alternatives to cruises, lighthouses and ships',
    '76':'Refrain from light trespassing',
    '77':'Preventive measures are always important',
    '78':'Glare-free lighting for vehicles driven at night',
    '79':'Stop the use of needless lighting',
    '80':'Use low-glare lights outdoor',
    '81':'Use of motion sensors on important outdoor lights',
    '82':'Colored lights can be used as an option',
    '83':'Avoid blue lights at night',
    '84':'Support wilderness',
    '85':'Get involved in community programs',
    '86':'Share solution to others',
    '87':'Start with natural darkness',
    '88':'Use smart lighting controls',
    '89':'Keep lights close to the ground',
    '90':'Use the lowest intensity lighting',

}
function main_run() {
    console.log("control_p");
    
    for(let i = 0; i < STAR_COUNT; i++) {
        addStar(i);
    }
    
    document.addEventListener("keydown",keydown);
    document.addEventListener("keyup", keyup);
}

function addStar(id){
    let starSize = rand(STAR_MIN_SIZE, STAR_MAX_SIZE);
    let starX = rand(8, 92);
    let starY = rand(8, 92);
    let delay = Math.random() + 0.7;

    let star = document.createElement("div");
    star.id = id+65;
    star.className = "star-container";
    star.style.left = starX + "%";
    star.style.top = starY + "%";
    star.style.width = starSize + "px";
    star.style.height = starSize + "px";
    star.style.animationDelay = delay + "s";
    star.style.visibility = 'visible';

    //create innertext for star, and hidden it
    let starText = document.createElement("span");
    starText.classList.add('text-container');
    starText.innerHTML = STAR_TABLE[star.id];
    starText.style.visibility = 'hidden';
    star.append(starText);

    container.append(star);
}

function keydown(e){
    // console.log(e);
    if (! e.repeat){
        if (e.keyCode >= 65 && e.keyCode <= 90){
            let luckyStar = document.getElementById(e.keyCode);
            luckyStar.keyClickTime = Date.now();
        }
    }
    
}

function keyup(e){
    // console.log(e.keyCode);
    if (e.keyCode >= 65 && e.keyCode <= 90){
        let luckyStar = document.getElementById(e.keyCode);
        let visibleStarContainers = _checkVisibleStars(); //检查并获得所有没消失的星星
        let visibleTextContainers = document.getElementsByClassName('showText');
        if (visibleStarContainers.length != 0){
            document.getElementById('blink').pause;
            let pressTime = Date.now() - luckyStar.keyClickTime;
            console.log(pressTime, Date.now(), luckyStar.keyClickTime);
            if(pressTime > STAR_LONGCLICK) {
                //触发长按
                if (luckyStar.className == 'star-container'){
                    luckyStar.className = 'showText';
                    let innerText = luckyStar.firstChild;
                    innerText.style.visibility = 'visible';
                    // luckyStar.innerHTML = STAR_TABLE[e.keyCode];
                }else{
                    luckyStar.className = 'star-container';
                    let innerText = luckyStar.firstChild;
                    innerText.style.visibility = 'hidden';
                    // luckyStar.innerHTML = '';
                }
                luckyStar.style.visibility = 'visible';
            }else{
                //触发短按
                luckyStar.style.visibility = 'hidden';

                //1. 找到5个随机消失的同伴
                let remove_stars = _findRandomStars(visibleStarContainers);
                // console.log(remove_stars, visibleStarContainers);
                //2. 将同伴消失
                let star_container = document.getElementsByClassName('star-container');
                // console.log(star_container);
                for (let i=0; i<star_container.length; i++){
                    for (let j=0; j<remove_stars.length; j++){
                        if (star_container[i].id == remove_stars[j]){
                            star_container[i].style.visibility = 'hidden';
                        }
                    }
                }
                
            }
            //显示提示信息.
            console.log(visibleStarContainers.length);

            showClick.style.visibility = 'hidden';
            if (visibleStarContainers.length > 170){
                showClick.innerHTML = 'Try press any letter key shortly.';
                showClick.style.visibility = 'visible';
            }else if (visibleStarContainers.length > 165){
                showClick.innerHTML = 'Hold ' + e.key + ' longer, or press any key shortly.';
                showClick.style.visibility = 'visible';
            }
            document.getElementById('blink').play();
            document.getElementById('blink').currentTime = 0;
        }else{
            //如果星星都没了
            if (visibleTextContainers.length != 0){
                for (let i=0; i<visibleTextContainers.length; i++){
                    visibleTextContainers[i].firstChild.style.visibility = 'hidden';
                }
            }
            var buttonContainers = document.getElementsByClassName('button-container');
            buttonContainers[0].style.visibility = "visible";
            showClick.style.visibility = 'hidden';
            document.getElementById('blink').pause;
        }
    }
    else if (e.keyCode == 32){
        //如果按了空格， 则视为随机短按一次
        document.getElementById('blink').pause;
        let visibleStarContainers = _checkVisibleStars();
        if (visibleStarContainers.length != 0){
            var luckyStarIndex = rand(0, visibleStarContainers.length-1);
            
            luckyStar = visibleStarContainers[luckyStarIndex];
            luckyStar.style.visibility = 'hidden';
            document.getElementById('blink').play();
            document.getElementById('blink').currentTime = 0;
        }else{
            //如果星星都没了
            if (visibleTextContainers.length != 0){
                for (let i=0; i<visibleTextContainers.length; i++){
                    visibleTextContainers[i].firstChild.style.visibility = 'hidden';
                }
            }
            showClick.style.visibility = 'hidden';
            var buttonContainers = document.getElementsByClassName('button-container');
            buttonContainers[0].style.visibility = "visible";
            document.getElementById('blink').pause;
            
        }
    }

}

function _findRandomStars(target){
    let res = [];
    // console.log(target.length);
    if(target.length < 5){
        let a_target = target; 
        var index = Math.floor((Math.random()* a_target.length));
        for (let i=0; i < a_target.length; i ++){
            res.push(a_target[i].id);
        }

    }else{
        let a_target = target; 
        for (let i=0; i < a_target.length; i ++){
            if (res.length < MAX_NUM_STAR){
                var index = Math.floor((Math.random()* a_target.length));
                // console.log(index);
                let res_target = a_target.pop(index);
                // console.log(res_target);
                res.push(res_target.id);
            }
        }
        
    }
    return(res);
    
}
function _checkVisibleStars(){
    var starContainers = document.getElementsByClassName('star-container');
    let res = [];
    for (var i=0; i<starContainers.length; i++){
        if (starContainers[i].style.visibility == 'visible'){
            res.push(starContainers[i]);
        }
    }
    return res;
}

function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}


function redirect(){
    window.location.href="https://cires.colorado.edu/artificial-sky";
}


main_run();