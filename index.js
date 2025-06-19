const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/Background.png',
    scale: 2
})
const pumpkin = new Sprite({
    position: {
        x: 500,
        y: 375
    },
    imageSrc: './img/Pumpkin_portal2.png',
    scale: 2,
    framesMax: 4
})
const player = new Fighter({
    position:{
        x: 0,
        y: 0
    },
    velocity:{
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/3/Idle.png',
    framesMax: 4,
    scale: 2,
    offset: {
        x: 0,
        y: 45
    },
    sprites: {
        idle: {
            imageSrc: './img/3/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/3/Sneer.png',
            framesMax: 6,
        }
    }
})


const enemy = new Fighter({
    position:{
        x: 400,
        y: 100
    },
    velocity:{
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/1/Idle.png',
    framesMax: 4,
    scale: 2,
    offset: {
        x: 0,
        y: -55
    },
    sprites: {
        idle: {
            imageSrc: './img/3/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/1/Walk.png',
            framesMax: 6,
        }
    }
})


console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function rectangularCollision({ rectangle1, rectangle2}){
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}
function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector('#display').style.display = 'flex'
    if(player.health === enemy.health){
        document.querySelector('#display').innerHTML = 'tie'
    } else if (player.health > enemy.health) {
        document.querySelector('#display').innerHTML = 'Player 1 Wins'
    } else if (player.health < enemy.health) {
        document.querySelector('#display').innerHTML = 'Player 2 Wins'
    }   
}

let timer = 20
let timerId
function decreaseTimer() {
    if (timer > 0){
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0) {
        determineWinner({player,enemy,timerId})
    }
    
}

decreaseTimer()

function animate() {
    window,requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    pumpkin.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movemennt
    player.image = player.sprites.idle.image
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -7
        player.image = player.sprites.run.image
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 7
        player.image = player.sprites.run.image
    }

    
    //enemy movemennt
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -7
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 7
    }

    //detect for collision
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
        player.isAttacking
    ){
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    //end game
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }

    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking
    ){
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%' 
        console.log('enemy successfull');
    }
}

animate()

window.addEventListener('keydown', (event) =>{
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -14
            break
        case ' ':
            player.attack()
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -14
            break
        case 'ArrowDown':
            enemy.isAttacking = true
            break
    }
    
}) 

window.addEventListener('keyup', (event) =>{
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            lastKey = 'w'
            break

    }

    // enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
    
}) 