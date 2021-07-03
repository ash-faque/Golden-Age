const canvas = document.querySelector('.canvas')
const ctx = canvas.getContext('2d')
var current_animation = null;
var gold_dropper = null;
var Golds = [];
var score = 0
var hardness = 1
var life = 3
var showHitbox = false
const coin_img = new Image(40, 40)
        coin_img.src = 'coin.png'
const pot_img = new Image(40, 40)
        pot_img.src = 'pot.png'


const showScore = () => {
    ctx.fillStyle = '#ffbb00'
    ctx.font = '20px monospace'
    ctx.fillText(`SCORE: ${score}$`, 20, 30)
    ctx.fillStyle = '#40fc2f'
    ctx.font = '20px monospace'
    ctx.fillText(`LIFE: ${life}❤`, 20, 55)
    ctx.fillStyle = '#2f70fc'
    ctx.font = '16px monospace'
    ctx.fillText(`HARDNESS: ${hardness.toFixed(3)}x`, 20, 75)
}


// canvas size adapter
const adaptCanvasSize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}
window.addEventListener('resize', adaptCanvasSize)
adaptCanvasSize()

// golds obj
class Gold {
    constructor (x, dy){
        this.x = x
        this.y = 50
        this.dy = dy
        this.scrored = false
        this.missed = false
    }
    draw(){
        ctx.beginPath()
        ctx.drawImage(coin_img, this.x - 20, this.y - 20)
        ctx.strokeStyle = '#000'
        ctx.lineWidth = '3'
        ctx.stroke()
        ctx.closePath()
    }
    update(){
        this.y += this.dy;
        this.draw();
    }
}

// generate golds 
const dropGold = () => {
    let x = ((Math.random() * (canvas.width * 0.8)) + (canvas.width * 0.1));
    let dy = Math.floor((Math.random() * 3) + hardness);
    Golds.push(new Gold(x, dy));
}


class Plate  {
    constructor (){
        this.x = canvas.width / 2;
        this.slideToRight = false;
        this.slideToLeft = false;
    }
    draw = () => {
        if (this.slideToRight && ((this.x + 100) < canvas.width)) this.x += 2;
        if (this.slideToLeft && ((this.x) > 0)) this.x -= 2;
        ctx.beginPath()
        if (showHitbox){
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, (canvas.height - 100), 100, 100)
        }
        ctx.fillStyle = '#fff';
        ctx.drawImage(pot_img, this.x, (canvas.height - 100))
        ctx.closePath()
    }
    move = (toRight) => {
        if (toRight){
            if ((this.x + 100) < canvas.width){
                this.x += 20;
            }
        } else {
            if ((this.x) > 0){
                this.x -= 20;
            }
        }
    }
}
const plate = new Plate();


// plate mover
// keyboard
window.addEventListener('keydown', (e) => {
    if(e.code === 'ArrowRight'){
        plate.move(true)
    }else if(e.code === 'ArrowLeft'){
        plate.move(false)
    }
})

// gyroscope                                                                                    // todoooo
window.addEventListener('deviceorientation', (e) => {
    let a = e.alpha;
    let dir;
    if (a < 360 && a > 270){
        console.log('to left')
        dir = 'to left';
    }
    if (a > 0 && a < 90){
        console.log('to right')
        dir = 'to right';
    }
    //console.log(a)
    document.getElementById('b').innerText = dir
})


// touch
window.addEventListener('touchstart', (e) => {
    let touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++){
        let x = touches[i].clientX;
        if (x < (canvas.width / 3)){
            plate.slideToLeft = true
            plate.slideToRight = false
        } else if (x > ((canvas.width / 3) * 2)){
            plate.slideToLeft = false
            plate.slideToRight = true
        }
    }
})
window.addEventListener('touchend', () => { 
    plate.slideToLeft = false
    plate.slideToRight = false
})



// helper fns
const welcom_s = document.querySelector('.welcom')
const game_s = document.querySelector('.game')
const end_s =  document.querySelector('.end')
const l_score_d = document.querySelector('#l_score')
const h_score_d = document.querySelector('#h_score')
const update_h_score = () => {
    if (localStorage.h_score){
        h_score_d.innerText = localStorage.h_score;
    }
}
update_h_score();
const fullScreen  = () => {
    if (!document.fullscreenElement){
        document.documentElement.requestFullscreen()
    }
    if (document.exitFullscreen){
        document.exitFullscreen()
    }
}
const chek_hb_d = (btn) => {
    showHitbox = !showHitbox;
    if (showHitbox){
        btn.innerText = 'hide hitboxes'
    } else {
        btn.innerText = 'show hitboxes'
    }
}
const feedback = () => {
    let fb = prompt('Write feedback: ')
    window.open(`https://wa.me/916282177960?text=${fb}`)
}



// start game
const startGame = () => {
    welcom_s.style.display = 'none';
    game_s.style.display = 'block';
    gold_dropper = setInterval(dropGold, 2000)
    animate()
    fullScreen()
}
// end game
const endGame = () => {
    welcom_s.style.display = 'block';
    game_s.style.display = 'none';
    clearInterval(gold_dropper)
    cancelAnimationFrame(current_animation)
    l_score_d.innerText = score;
    if (localStorage.h_score && (parseInt(localStorage.h_score) < score)){
        localStorage.h_score = score;
        update_h_score();
    }
    Golds = []
    score = 0
    hardness = 1
    life = 3
}

// animation
function animate() {
    current_animation = requestAnimationFrame(animate);
    ctx.fillStyle = '#252525'
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // drop golds
    for (let i = 0; i < Golds.length; i++){
        Golds[i].update();
        if ((Golds[i].y > (canvas.height + 20)) && (Golds[i].missed == true)){
            Golds.splice(i, 1)
        }
    }
    
    // check if scored
    for (let i = 0; i < Golds.length; i++){
        if (!Golds[i].scrored && !Golds[i].missed){
            if ((Golds[i].y + 20) >= (canvas.height - 100)){
                //console.log('@ bottom')
                let tolarence = 10;
                if ((Golds[i].x > (plate.x - tolarence)) && (Golds[i].x < (plate.x + 100 + tolarence))){
                    Golds[i].scrored = true
                    score += 1
                    // if score too high increase hardness
                    hardness += (1 / 50)
                    Golds.splice(i, 1)
                } else {
                    Golds[i].missed = true
                    life -= 1
                    // if life exceeds fail
                    if (life <= 0){
                        endGame()
                    }
                }
            }
        }
    }

    // score & plate
    showScore()
    plate.draw()
}