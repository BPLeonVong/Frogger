"use strict";
//Global Variables
var GAME_LEVEL = 1;
var LIFE_AMOUNT = 3;

/*Thanks for the links on collision detection, I will definitely look into and implement these in the future, for now I just simply
have something working.

https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
https://msdn.microsoft.com/en-us/library/ie/gg589497(v=vs.85).aspx
http://www.gaminglogy.com/tutorial/collision-detection/
http://blog.sklambert.com/html5-canvas-game-2d-collision-detection/

YouTube videos on the topic:
https://www.youtube.com/watch?v=NZHzgXFKfuY&list=PL524PPbZds58j4Ah_ix5G1TXp5-M8zJq0
*/
//Check Collision Between two objects
function checkCollision(player, object) {
    var xDist = Math.abs((player.x + 51) - (object.x + 23));
    var yDist = Math.abs((player.y + 85) - (object.y + 23));
    if (xDist + yDist < 20) {
        return true;
    } else {
        return false;
    }
}

//Actor Base Class, all sprites utilize this.
var Actor = function(x, y, sprite) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.tickCount = 0;
    this.ticksPerFrame = 0;
};

//Renders the actor class
Actor.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Enemy class, is an Actor
var Enemy = function(x, y, sprite) {
    sprite = sprite || 'images/enemy-bug.png';
    x = x || 100;
    y = y || 100;
    this.speed = 100;
    Actor.call(this, x, y, sprite);
};
Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;

//Enemy Update
Enemy.prototype.update = function(dt) {
    //When the object is on the screen and checks if player hits this bug *deal* with the player
    if (this.x <= canvas.width && this.x >= -60) {
        this.x += (this.speed) * dt;
        if (checkCollision(player, this)) {
            player.isHit();
        }
    }
    //When the object goes off the screen sets the position, speed and direction of the bug
    else {
        this.x = 0;
        this.speed = GAME_LEVEL * this.getRandomSpeed(100, 200);
        this.y = this.getRandomLocation();
        if (this.getRandomBooleanResult()) {
            this.x = canvas.width;
            this.speed *= -1;
            this.sprite = 'images/enemy-bug2.png';
        } else {
            this.sprite = 'images/enemy-bug.png';
        }
    }
};

//Renders the enemy
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Enemy Custom Functions
//A function to either return true, or false, randomly
Enemy.prototype.getRandomBooleanResult = function() {
    var temp = Math.floor(Math.random() * 2);
    if (temp === 0) {
        return false;
    }
    if (temp === 1) {
        return true;
    }
    return true;
};
//A function called to set the enemy speed when it comes off the map
Enemy.prototype.getRandomSpeed = function(min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
}

//A function called when setting the enemy to a random y location on the map
Enemy.prototype.getRandomLocation = function() {
    var temp = Math.ceil(Math.random() * 7);
    switch (temp) {
        case 1:
            return 73;
        case 2:
            return 116;
        case 3:
            return 159;
        case 4:
            return 192;
        case 5:
            return 235;
        case 6:
            return 278;
        case 7:
            return 321;
    }
    return 1;
}


//Player class which is an actor
var Player = function(x, y, sprite) {
    sprite = sprite || 'images/char-boy.png';
    x = x || 200;
    y = y || 430;
    Actor.call(this, x, y, sprite);
};
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;

//Allows the player to set his current actions
Player.prototype.handleInput = function(e) {
    this.action = e;
};

//Renders the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Player Update Class
Player.prototype.update = function(dt) {
    //Movement amount per tile
    var moveDistanceX = 51;
    var moveDistanceY = 43;
    //Movement
    switch (this.action) {
        case 'up':
            if (this.y > -60)
                this.y -= moveDistanceY;
            if (this.y < -60)
                player.isHit();
            break;
        case 'right':
            if (this.x < 400)
                this.x += moveDistanceX;
            break;
        case 'down':
            if (this.y < 400)
                this.y += moveDistanceY;
            break;
        case 'left':
            if (this.x > 30)
                this.x -= moveDistanceX;
            break;
        case 'enter':
            //If the game is over then press enter to restart
            //Kind of hashed in, could make it better.
            if (gameOver !== null) {
                playerLives = [
                    new Lives(30, 30),
                    new Lives(60, 30),
                    new Lives(90, 30)
                ];
                allEnemies = [
                    new Enemy(0, 73),
                    new Enemy(0, 156),
                    new Enemy(0, 239)
                ];
                GAME_LEVEL = 1;
                LIFE_AMOUNT = 3;
                this.x = 200;
                this.y = 430;
                gameOver = null;
                $('#stars').text(0);
            }
    }
    //Set the current action back to null
    this.action = null;
};

//Player is hit.
Player.prototype.isHit = function() {
    this.x = 200;
    this.y = 430;
    if (LIFE_AMOUNT > 1) {
        playerLives[LIFE_AMOUNT - 1].toggleLife();
        LIFE_AMOUNT--;
    } else {
        //Game Over
        gameOver = new GameOver(0, 0);
    }
};

//Goal Class
var Goal = function(x, y, sprite) {
    sprite = sprite || 'images/Star.png';
    x = x || 225;
    y = y || 15;
    Actor.call(this, x, y, sprite);
};
Goal.prototype = Object.create(Actor.prototype);
Goal.prototype.constructor = Goal;

//Render Goal per Frame
Goal.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), 51 * this.frame, 0, 51, 86, this.x, this.y, 51, 86);
};

//Sets the frame of the goal and checks if collides with the player
Goal.prototype.update = function(dt) {
    this.ticksPerFrame = 6;
    if (checkCollision(player, this)) {
        GAME_LEVEL++;
        player.x = 200;
        player.y = 430;
        allEnemies.push(new Enemy(canvas.width, 239));
        $('#stars').text(GAME_LEVEL - 1);
    }
    this.tickCount++;
    if (this.tickCount > this.ticksPerFrame) {
        this.frame++;
        this.tickCount = 0;
        if (this.frame > 8) {
            this.frame = 0;
        }
    }
};

//Lives Sprite
var Lives = function(x, y, sprite) {
    sprite = sprite || 'images/Heart.png';
    x = x || 0;
    y = y || 0;
    Actor.call(this, x, y, sprite);
};
Lives.prototype = Object.create(Actor.prototype);
Lives.prototype.constructor = Goal;

//Render Lives
Lives.prototype.render = function() {
    //ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.drawImage(Resources.get(this.sprite), 25.5 * this.frame, 0, 25.5, 86, this.x, this.y, 25.5, 86);
};

//If player loses a life call this function to toggle lives
Lives.prototype.toggleLife = function() {
    this.frame++;
};

//Game Over Screen
var GameOver = function(x, y, sprite) {
    sprite = sprite || 'images/GameOver.png';
    x = x || 0;
    y = y || 0;
    Actor.call(this, x, y, sprite);
};
GameOver.prototype = Object.create(Actor.prototype);
GameOver.prototype.constructor = GameOver;
//Renders the Game Over Screen
GameOver.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Instantiate the Objects
var allEnemies = [
    new Enemy(0, 73),
    new Enemy(0, 156),
    new Enemy(0, 239)
];
var goal = new Goal();
var player = new Player();
var playerLives = [
    new Lives(30, 30),
    new Lives(60, 30),
    new Lives(90, 30)
];

var gameOver = null;

// Listens for keypresses and sets the action to the addressed key
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});