// intro and gameover intermediate screens

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
  state = intro;
}


function displayMenu() {
  state = game_over; //now we cycle through game_over()... which just shows starfield and waits
  clearScreen();
  app.stage.addChild(starField);
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
    state = intro;
    if (MUSIC) {
      document.getElementById('combat').pause();
      gameoverMusic.pause();
      document.getElementById('cantina').currentTime = 0;  
      document.getElementById('cantina').play();  
    }
    setTimeout(showIntro, 0)};
}
