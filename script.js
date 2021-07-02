const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
var score = 0
var hardness = 4
var life = 3

const showScore = () => {
    ctx.fillStyle = '#ffbb00'
    ctx.font = '20px monospace'
    ctx.fillText(`SCORE: ${score}💰`, 20, 30)
    ctx.fillStyle = '#40fc2f'
    ctx.font = '20px monospace'
    ctx.fillText(`LIFE: ${life}❤`, 20, 55)
    ctx.fillStyle = '#2f70fc'
    ctx.font = '16px monospace'
    ctx.fillText(`HARDNESS: ${hardness}`, 20, 80)
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
        this.y = -50
        this.dy = dy
        this.scrored = false
        this.missed = false
    }
    draw(){
        ctx.beginPath()
        ctx.fillStyle = '#ffbb00';
        ctx.arc(this.x, this.y, 20, 0, (2 * Math.PI), false)
        //ctx.font = '45px monospace'
        //ctx.fillText('💰', this.x, this.y)
        ctx.fill()
        ctx.closePath()
    }
    update(){
        this.y += this.dy;
        this.draw();
    }
}

// generate golds 
var Golds = [];
const dropGold = () => {
    let x = ((Math.random() * (canvas.width * 0.8)) + (canvas.width * 0.1));
    let dy = Math.floor((Math.random() * 3) + hardness);
    Golds.push(new Gold(x, dy));
}
setInterval(dropGold, 1500)

// Plate obj
class Plate  {
    constructor (){
        this.x = canvas.width / 2;
    }
    draw = () => {
        ctx.beginPath()
        ctx.fillStyle = '#003088';
        ctx.fillRect(this.x, (canvas.height - 20), 100, 20)
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
window.addEventListener('keydown', (e) => {
    if(e.code === 'ArrowRight'){
        plate.move(true)
    }else if(e.code === 'ArrowLeft'){
        plate.move(false)
    }
})
// listeners for phone
window.addEventListener('devicemotion', (e) => {
    //console.log(e)

})
window.addEventListener('mousedown', (e) => {
    let x = e.clientX;
    if (x < (canvas.width / 3)){
        plate.move(false)
    } else if (x > ((canvas.width / 3) * 2)){
        plate.move(true)
    }
})


// animation
function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // drop golds
    for (let i = 0; i < Golds.length; i++){
        Golds[i].update();
        // check if scored
        if (!Golds[i].scrored && !Golds[i].missed){
            if ((Golds[i].y + 20) >= (canvas.height - 20)){
                if ((Golds[i].x >= plate.x) && (Golds[i].x <= (plate.x + 100))){
                    Golds[i].scrored = true
                    score += 1
                    // if score too high increase hardness

                    Golds.slice(i, 1)
                } else {
                    Golds[i].missed = true
                    life -= 1
                    // if life exceeds fail

                    Golds.slice(i, 1)
                }
            }
        }
    }

    // score & plate
    showScore()
    plate.draw()
}
animate()