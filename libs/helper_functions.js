// helper functions


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


function fireShot() {
  //PIXI.sound.play('laser');
  laserSnd.play();
  let i = 0;
  while (i++ < maxBullets) {
    if (typeof  bullets[i] !== 'undefined') {
      if (!bullets[i].visible) {
        bullets[i].x = ship.x+ship.width/2;
        bullets[i].y = ship.y+ship.height/2-bullets[i].height/2;
        bullets[i].vx = bulletSpeed;
        bullets[i].vy = 0;
        bullets[i].visible = true;
        break;
      }
    }
  }
}


function populateWall(w, position, speed) {
  for (let i = 0; i<nBlocks; i++) {
    let s = new Sprite(loader.resources["images/block1.png"].texture); 
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
    app.stage.addChild(w[i]);
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

