//The Game Engine, what implements the canvas and controls the loop.
var Engine = (function(global) {

    //Declare Core Variables
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    //Set canvas size
    canvas.width = 505;
    canvas.height = 606;

    //Adds the canvas to the HTML doc
    $("#Game").append(canvas);

    //Add the description of game after the canvas
    var description = '<div id="description"><p>The stars are falling, the stars are falling. Stars have fallen on to the earth, and they are shiny, really shiny. Play as a boy who loves shiny stars, and collect as many as possible! But watch out there are bugs in front of you to stop you. Navigate pass the bugs and collect as many stars possible using the arrow keys on the keyboard as directions. Oh and be careful, if you run too fast, you might fall in the water!</p></div>';
    $("#Description").append(description);

    //Game Loop
    function main() {

        //Time
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        //Clear frame buffer
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Update Function
        update(dt);
        //Render Function
        render();

        lastTime = now;

        //Recursive
        win.requestAnimationFrame(main);
    };

    //Initialize Game
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    //Update Function
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* Update each element
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        goal.update();
    }

    //Render Game Objects
    function render() {
        //Sprite Collection
        var rowImages = [
                'images/water-block.png', // Top row is water
                'images/stone-block.png', // Row 1 of 3 of stone
                'images/stone-block.png', // Row 2 of 3 of stone
                'images/stone-block.png', // Row 3 of 3 of stone
                'images/grass-block.png', // Row 1 of 2 of grass
                'images/grass-block.png', // Row 2 of 2 of grass
                'images/stone-block.png', // Row 1 of 3 of stone
                'images/stone-block.png', // Row 2 of 3 of stone
                'images/stone-block.png', // Row 3 of 3 of stone
                'images/grass-block.png', // Row 1 of 2 of grass
                'images/grass-block.png', // Row 2 of 2 of grass
                'images/stone-block.png', // Row 1 of 3 of stone
                'images/stone-block.png', // Row 2 of 3 of stone
                'images/stone-block.png', // Row 3 of 3 of stone
            ],
            numRows = 13,
            numCols = 9,
            row, col;

        //Render tilemap
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), 23 + col * 51, row * 43);
            }
        }
        renderEntities();
    }

    //Render GameObjects
    function renderEntities() {
        for (var i = 0; i < allEnemies.length; ++i) {
            allEnemies[i].render();
        };
        goal.render();
        player.render();
        for (var i = 0; i < playerLives.length; ++i) {
            playerLives[i].render();
        };
        if (gameOver != null) {
            gameOver.render();
        }
    }

    // Who knows, load main menu? Not sure what to use it for
    function reset() {

    }

    /* Set Game Resources */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/enemy-bug2.png',
        'images/char-boy.png',
        'images/heart.png',
        'images/GameOver.png',
        'images/star.png'
    ]);
    Resources.onReady(init);

    global.canvas = canvas;
    global.ctx = ctx;
})(this);