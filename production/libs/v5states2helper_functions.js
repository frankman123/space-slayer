// helper functions

function showIntro() {
  clearScreen();

  // add a starfield to menu scenes
  app.stage.addChild(starField);

  // change music
  if (MUSIC) {
    gameoverMusic.pause();
    document.getElementById('combat').pause();
    document.getElementById('cantina').currentTime = 0;
    document.getElementById('cantina').play();
  }

  // Title text
  const style1 = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 86,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#FF0000'], // gradient
      stroke: '#4a1850',
      strokeThickness: 25,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: sWidth,
  });
  const titleText = new PIXI.Text('SPACE SLAYER!', style1);
  titleText.x = sWidth/2 - titleText.width/2;
  titleText.y = sHeight/4 - titleText.height/2;

  app.stage.addChild(titleText);
  titleText.interactive = true;
  titleText.click = function(e) {
  }; 
     


  // Click to start Text 
  const style2 = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 46,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#222222'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: sWidth,
  });
  const startText = new PIXI.Text('CLICK TO START', style2);
  startText.x = sWidth/2 - startText.width/2;
  startText.y = sHeight/2 - startText.height/2;

  app.stage.addChild(startText);
  startText.interactive = true;
  startText.click = function(e) {
    STATE = 'playing';
    state = play;
    if (MUSIC) {
      gameoverMusic.pause();
      document.getElementById("cantina").pause();
      document.getElementById("combat").currentTime = 0;
      document.getElementById("combat").play();
    }
    
    setTimeout(setup, 0)}; 

  // Keyboard controls explanations text
  const style3 = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 26,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: sWidth,
  });
  const introText = new PIXI.Text('Ship 1: W,A,S,D - fire: G\nShip 2: Arrow keys - fire: shift\nMusic On/Off: SPACEBAR', style3);
  introText.x = sWidth/2 - introText.width/2;
  introText.y = sHeight*3/4 - introText.height/2;

  app.stage.addChild(introText);
  state = showIntroLoop;
  console.log(state);
}
 
function populateWall(w, position, speed, indestructibles) {
	// naive algorithm for selection of indestructible blocks
  
  // Instead of sprinkling indestructible blocks randombly like so .... 
	/*var indes = []
	while(indes.length < indestructibles){
   	var r = Math.floor(Math.random()*nBlocks);
   	if(indes.indexOf(r) === -1) indes.push(r);
	}
  */

  // ... form a small wall
  var r = Math.floor(Math.random()*nBlocks); // starting point
	var indes = []
	while(indes.length < indestructibles){
   	if(indes.indexOf(r) === -1) indes.push(r++ % nBlocks);
	}
  


  for (var i = 0; i<nBlocks; i++) {
    // type of block choosing
    let indestructible = false;
		if(indes.indexOf(i) != -1) {
			indestructible = true;
			//w[i].tint = 0xAA0000; // old way of distinguishing blocks
		}

    let s = new Sprite(loader.resources[indestructible ? "images/hard_block.png" : "images/soft_block.png"].texture);
    s.indestructible = indestructible;
    s.x = position;  // position of wall horizonally
    if (speed > 0) {
      s.y = i*blockHeight-blockHeight; // if moving up, subtract one blockheight because the top one is always offscreen
    }else {
        s.y = i*blockHeight; // if downmoving, let it reach the bottom so the last one is always offscreen 
    }
    s.height = blockHeight+1; // make them one pixel taller to avoid spurious gaps
    s.width = blockWidth;
    //s.alpha = Math.random();
    s.vx = 0; // no horizontal speed
    s.vy = speed; // downward motion
    s.destroyed = false;
    w[i] = s;
		// will it be indestructible ?
    app.stage.addChild(w[i]);
  }
}

function moveBullets(n, delta) {
  //debug ship explosion
  //if (ship1.visible) {
  //explodeShip(1);
  //}
  //return;
  let ship = n == 1 ? ship1 : ship2;
  if (!ship.visible) {
    return;
  }

  for (var i = 0; i<maxBullets; i++) {
    let b = n == 1 ? bullets1[i] : bullets2[i]; // convenience
    if (b.visible) {
      b.x += b.vx * delta;
      b.y += b.vy * delta;
      // deactivate if exited screen 
      if (b.x > sWidth || b.x < 0) {
        b.visible = false;
      }
      if (ship1.visible && ship2.visible) {
        if ( n == 1 ) {
          if (hitTestRectangle(b, ship2)) {
            b.visible = false;
            setHealth(2, --healthShip2);
            if (healthShip2 == 0) {
              explodeShip(2);
            }else{
              strikeShip(2);
            }
            break;
          }
        } else {
          if (hitTestRectangle(b, ship1)) {
            b.visible = false;
            setHealth(1, --healthShip1);
            console.log(healthShip1);
            if (healthShip1 == 0) {
              console.log(healthShip1);
              explodeShip(1);
            }else{
              strikeShip(1);
            }
            break;
          }
        }
      }
      // check for collision with blocks
      for (var j = 0; j<nBlocks; j++) {
        for (var z = 0 ; z < nWalls ; z++) {
          let w = walls[z][j]; //convenience;
          if (w.visible) {
            if (hitTestRectangle(b, w)) {
							if (w.indestructible) {  // block is indestructible?
								b.visible = false;
                metalSnd.play();
								break;
							}	
              b.visible = false;
              w.visible = false;
              explodeWall(w.x + w.width/2, w.y + w.height/2, n)
              break;
            }
          }
          w = walls[z][j]; // convenience
          if (w.visible) {
            if (hitTestRectangle(b, w)) {
							if (w.indestructible) {  // block is indestructible?
								b.visible = false;
                metalSnd.play();
								break;
							}	
              b.visible = false;
              w.visible = false;
              explodeWall(w.x + w.width/2, w.y + w.height/2, n)
              break;
            }
          }
        }
      }
    }
  }
}

function moveShip(n, delta) {
  let ship = n == 1 ? ship1 : ship2;
  ship.x += (ship.vx)*delta;
  ship.y += (ship.vy)*delta;
  if (ship.y < 0) {
    ship.y = 0;
  }
  if (ship.y > sHeight - ship.height) {
    ship.y = sHeight - ship.height;
  }
  if (ship.x < 0) {
    ship.x = 0;
  }
  if (ship.x > sWidth-ship.width) {
      ship.x = sWidth-ship.width;
  }
  if (n == 1 && ship.x > sWidth*0.5-blockWidth*1.5-ship.width) {
    ship.x = sWidth*0.5-blockWidth*1.5-ship.width;
  }
  if (n == 2 && ship.x < sWidth*0.5+blockWidth*1.5) {
    ship.x = sWidth*0.5+blockWidth*1.5;
  }
}



function explodeWall(x,y,n) {

    // angle of explosion (towards shooting ship)
    let minAng = Math.PI/2+0.5;
    let maxAng = Math.PI*1.5-0.5;
    if (n == 2) {
      minAng += Math.PI;
      maxAng += Math.PI;
    }

    // play sound
    expSnd.play();

    d.create(
    x,
    y,
      () => new PIXI.Sprite(                     //Sprite function
        TextureCache["images/star.png"]
      ),
      app.stage,                                     //Container for particles
      50,                                         //Number of particles
    0.1,                                  //Gravity
    true,                                 //Random spacing
    minAng, maxAng,               //Min/max angle
    12, 24,                               //Min/max size
    3, 7,                                 //Min/max speed
    0.005, 0.01,                          //Min/max scale speed
    0.005, 0.01,                          //Min/max alpha speed
    0.05, 0.1                             //Min/max rotation speed
    );
}

function explodeShip(n) {

    let deadBullets;

		if (n == 1) {
			ship1.visible = false;
      deadBullets = bullets1;
		}else{
      deadBullets = bullets2;
			ship2.visible = false;
		}
    
    for (let i = 0; i<maxBullets; i++) {
      deadBullets[i].visible = false;
    }

    // angle of explosioin (all around in this case)
    let minAng = 0;
    let maxAng = 2*Math.PI;
    let ship = n == 1 ? ship1 : ship2;

    // play sound
    shipExpSnd.play();

    d.create(
    ship.x+ship.width/2,
    ship.y+ship.height/2,
      () => new PIXI.Sprite(                     //Sprite function
        TextureCache["images/shipExplosionBlock.png"]
      ),
      app.stage,                                     //Container for particles
     150,                                         //Number of particles
    0.0,                                  //Gravity
    true,                                 //Random spacing
    minAng, maxAng,               //Min/max angle
    blockWidth, blockWidth,                               //Min/max size
    3,12,                                 //Min/max speed
    0.005, 0.01,                          //Min/max scale speed
    0.005, 0.01,                          //Min/max alpha speed
    0.05, 0.1                             //Min/max rotation speed
    );

    // game over - show menu in a few seconds
    setTimeout(displayMenu, 5000);
}

function fireShot(w) {
  let ship = w == 1 ? ship1 : ship2;
  if (!ship.visible) {
    return;
  }
  laserSnd.play();
  let i = 0;
  let b = w == 1 ? bullets1 : bullets2;
  let s = w == 1 ? ship1 : ship2;
  while (i++ < maxBullets) {
    if (typeof  b[i] !== 'undefined') {
      if (!b[i].visible) {
        b[i].x = s.x+s.width/2;
        b[i].y = s.y+s.height/2-b[i].height/2;
        b[i].vx = w == 1 ? bulletSpeed : -bulletSpeed;
        b[i].vy = 0;
        b[i].visible = true;
        break;
      }
    }
  }
}



function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The downHandler
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key;
}

function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
}

function displayMenu() {
  state = gameOverLoop; //now we cycle through gameOverLoop... which just sits and waits 
  STATE = 'gameover'
  clearScreen();
  if (MUSIC) {
    document.getElementById('combat').pause();
    document.getElementById('cantina').pause();
    gameoverMusic.currentTime = 0;
    gameoverMusic.play();
  }
  const style1 = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 46,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#FF0000'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: sWidth,
  });
  const titleText = new PIXI.Text('GAME OVER', style1);
  titleText.x = sWidth/2 - titleText.width/2;
  titleText.y = sHeight/4 - titleText.height/2;

  app.stage.addChild(titleText);

  const style2 = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 46,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#222222'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: sWidth,
  });
  const startText = new PIXI.Text('PLAY AGAIN', style2);
  startText.x = sWidth/2 - startText.width/2;
  startText.y = sHeight/2 - startText.height/2;

  app.stage.addChild(startText);
  startText.interactive = true;
  startText.click = function(e) {
    if (MUSIC) {
      document.getElementById('combat').currentTime = 0;
      document.getElementById('combat').play();
      document.getElementById('cantina').pause();  
      gameoverMusic.pause();  
    }
    STATE = 'playing';
    state = play;  // change to play loop
    setTimeout(setup, 0)};

  const style3 = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 26,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: sWidth,
  });
  const introText = new PIXI.Text('BACK TO INTRO', style3);
  introText.x = sWidth/2 - introText.width/2;
  introText.y = sHeight*3/4 - introText.height/2;

  app.stage.addChild(introText);
  introText.interactive = true;
  introText.click = function(e) {
    STATE = 'menu';
    state = showIntroLoop;
    if (MUSIC) {
      document.getElementById('combat').pause();
      gameoverMusic.pause();
      document.getElementById('cantina').currentTime = 0;  
      document.getElementById('cantina').play();  
    }
    setTimeout(showIntro, 0)};
}


function displayMenu2() {
  clearScreen();
  gameOverSplash.width = 0.70*sWidth; 
  gameOverSplash.width = 0.50*sHeight; 
  gameOverSplash.x = sWidth/2 -gameOverSplash.width/2;
  gameOverSplash.y = sHeight/2 -gameOverSplash.height/2;
  gameOverSplash.interactive = true;

  gameOverSplash.on("mouseup", onSplashUp);
  
  app.stage.addChild(gameOverSplash);
}

function onSplashUp() {
  app.stage.removeChild(gameOverSplash);
  setup();
}

function clearScreen() {
  for (var i = app.stage.children.length - 1; i >= 0; i--) {	
    app.stage.removeChild(app.stage.children[i]);
  }

  /*
  // forget bullets and wall blocks
  for (j = 0; j < nWalls; j++) {
    for (i = 0; i<nBlocks; i++) {
      walls[j][i] = undefined;
    }
  }

  for (i = 0; i<maxBullets; i++) {
    bullets1[i] = undefined;
    bullets1[i] = undefined;
  }
*/
}

function toggleAudio() {

  let cantina = document.getElementById('cantina');
  let combat = document.getElementById('combat')
  let gameover = document.getElementById('gameover')
  if (STATE == 'gameover') {
    if (audioIsPlaying(gameover)) {
      gameover.pause();
    }else {
      gameover.currentTime = 0;
      gameover.play();
    }
  }
  if (STATE == 'menu') {
    if (audioIsPlaying(cantina)) {
      cantina.pause();
    }else {
      cantina.currentTime = 0;
      cantina.play();
    }
  }
  if (STATE == 'playing') {
    if (audioIsPlaying(combat)) {
      combat.pause();
    }else {
      combat.currentTime = 0;
      combat.play();
    }
  }
}

function audioIsPlaying(myAudio) {
  if (myAudio.duration > 0 && !myAudio.paused) {
    return true;
  } else {
    return false;
  }
}


function setHealth(ship, h) {
  let hs = ship == 1 ? healthSprite1 : healthSprite2;
  hs.width = h*blockWidth;
}

function strikeShip(shipNum) {
  sprite =  shipNum == 1 ? ship1 : ship2;
  sprite.filters = [
     new Filters.GlowFilter(15, 5, 1, 0xFF0000, 0.5)
 ];
  thudSnd.play();
	setTimeout(unglowShip.bind(null, shipNum), 200)
}

function unglowShip(shipNum) {
  sprite =  shipNum == 1 ? ship1 : ship2;
	sprite.filters = [];
}


