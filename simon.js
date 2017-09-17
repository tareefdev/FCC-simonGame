$(document).ready(function() {

    var orgiPattern = ["red","SpringGreen","blue","yellow"]
    var orgiColor = {red: "#9f0f17", SpringGreen:"#00a74a", blue: "#094a8f", yellow: "#cca707"}
    var sounds = {red: "C4", SpringGreen:"E4", blue: "G4", yellow: "B4"}
    var gameArray = [], userArray = [], gameTimer = 0, gameCount = 1, gimeTime, strict = false, gamePeriodSec = 4 , showsSectionMS = 700, restColorMS = 400, switchStatus = false, showsSectionInterval;
    var red = document.getElementById("red")
    var SpringGreen = document.getElementById("SpringGreen")
    var blue = document.getElementById("blue")
    var yellow = document.getElementById("yellow")
    var display = document.getElementById("display")
    var start = document.getElementById("start")
    var strictElement = document.getElementById("strict")

    changeButtonsCase("none");
    var synth = new Tone.AMSynth().toMaster()
    var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();

    function changeSwitch() {
        // changeSwitch check if switcher is on
        makeItFaster()
        innerSwitch = document.getElementById("inner-switch");
        if(!switchStatus) {
            display.style.color = "#dc0d29";
            innerSwitch.style.marginLeft = "25px"
            innerSwitch.style.marginRight = "0"
            start.style.cursor = 'pointer';
            strictElement.style.cursor = 'pointer';
            start.style.pointerEvents = 'auto';
            strictElement.style.pointerEvents = 'auto';
            switchStatus = true;
        } else {
            innerSwitch.style.marginLeft = "0"
            innerSwitch.style.marginRight = "25px"
            display.style.color = "#3f060e";
            start.style.pointerEvents = 'none';
            strictElement.style.pointerEvents = 'none';
            display.innerHTML = "--";
            userArray = []
            gameArray = []
            gameCount = 0;
            gameTimer = 0;
            clearInterval(gimeTime)
            clearInterval(showsSectionInterval);
            changeButtonsCase("none");
            switchStatus = false;
        }
    }

    function worngSound() {
        polySynth.triggerAttack(['C4', 'E4', 'G4', 'B4']) 
        setTimeout(function(){
            polySynth.triggerRelease(['C4', 'E4', 'G4', 'B4']) 
        }, 150);
    }

    function changeButtonsCase(state) {
        red.style.pointerEvents = state
        SpringGreen.style.pointerEvents = state
        blue.style.pointerEvents = state
        yellow.style.pointerEvents = state
    }

    function makeItFaster() {
        if (gameCount > 10) {
            gamePeriodSec = 2 ;
            showsSectionMS = 550;
            restColorMS = 400;
        } else {
            gamePeriodSec = 4 ;
            showsSectionMS = 700;
            restColorMS = 400;
        }
    }

    function isSame(array) {
        if(gameArray.length > 4) {
            for(var i = 1; i < array.length; i++)
            {
                if(array[i] !== array[0])
                    return false;
            }
            return true;
        } else {
            return false;
        }
        }

     function gamePeriod() {
        gimeTime = window.setInterval(function timer(){
                if (gameTimer > gamePeriodSec) {
                    worngSound()
                    userArray = []
                    gameTimer = 0;
                    changeButtonsCase("none");
                    display.innerHTML = "!!"
                    if (strict) {
                        gameArray = []
                        gameCount = 0;
                        gameTimer = 0;
                        clearInterval(gimeTime)
                        setTimeout(function(){
                            startGame()
                        }, 500)
                    } else {
                        setTimeout(function(){
                            display.innerHTML = gameCount;
                            showsSection()
                        }, 500);
                    } 
                } else {
                   gameTimer++;
                }
            }, 1000);
        } 
     

    function test(audioName) {
        gameTimer = 0
        if (userArray[userArray.length - 1] != gameArray[userArray.length -1]) {
            worngSound()
            display.innerHTML = "!!"
            changeButtonsCase("none");
            userArray = []
            if (strict) {
                gameArray = []
                gameCount = 0;
                gameTimer = 0;
                clearInterval(gimeTime)
                startGame()
            } else {
                setTimeout(function(){
                    display.innerHTML = gameCount;
                    showsSection()
                }, 500);
            } 
        } else {synth.triggerAttackRelease(audioName, "8n");} 
        if (userArray.length == gameArray.length && gameCount == 20) {
            display.innerHTML = "**"
            synth.triggerAttackRelease("G4", "2n");
            changeButtonsCase("none");
            setTimeout(function(){
                switchStatus = true
                changeSwitch()
            }, 2000)
            
        } else if (userArray.length == gameArray.length && gameCount < 20) {
            changeButtonsCase("none");
            display.innerHTML = gameCount
            gameCount++;
            userArray = []
            setTimeout(function(){
                startGame()
            }, 500)
        }
    }

    function restColor(item,restColorMS) {
        setTimeout(function(){
            document.getElementById(item).style.backgroundColor = orgiColor[item];
        }, restColorMS);
    }
    
    function showsSection() {
        gameTimer = 0;
        clearInterval(gimeTime)
        makeItFaster()
        changeButtonsCase("none");
        var i = 0;
        showsSectionInterval = setInterval(function() {
           var ele = gameArray[i];
           document.getElementById(ele).style.backgroundColor = gameArray[i]
           synth.triggerAttackRelease(sounds[ele], "8n");
           restColor(ele,restColorMS);
           ++i;
           if(i == gameArray.length) {
               changeButtonsCase("auto")
               gameTimer = 0;
               gamePeriod();
               clearInterval(showsSectionInterval);
            };
              }, showsSectionMS)
    }

    function startGame() {
        makeItFaster();
        changeButtonsCase("none");
        gameTimer = 0;
        clearInterval(gimeTime)
        display.innerHTML = gameCount;
        var randomItem = orgiPattern[Math.floor(Math.random()*orgiPattern.length)];
        gameArray.push(randomItem);
        var subArray = gameArray.slice(gameArray.length - 4)
        var result = isSame(subArray);
        if (result === true) {
            gameArray.splice(-1,1)
            startGame();
        } else {
            showsSection();
            console.log(gameArray)
        }
       
    }

    document.getElementById("start").onclick = function() {
        startGame()
    }
    
    document.getElementById("strict").onclick = function() {
        if (!strict) {
            document.getElementById("led").style.backgroundColor = "#9f0f17";
            strict = true;
        } else if (strict) {
            document.getElementById("led").style.backgroundColor = "#fff"
            strict = false;
        }
    }

    document.getElementById("outter-switch").onclick = function() {
        changeSwitch()
    }
   


    red.onclick = function() {
        userArray.push("red")
        red.style.backgroundColor ="red";
        restColor("red",300)
        test("C4")
    }

    SpringGreen.onclick = function() {
        userArray.push("SpringGreen")
        SpringGreen.style.backgroundColor ="SpringGreen";
        restColor("SpringGreen",300)
        test("E4")
    }

    blue.onclick = function() {
        userArray.push("blue")
        blue.style.backgroundColor ="blue";
        restColor("blue",300)
        test("G4")
    }

    yellow.onclick = function() {
        userArray.push("yellow")
        yellow.style.backgroundColor ="yellow";
        restColor("yellow",300)
        test("B4")
    }

})
