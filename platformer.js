window.addEventListener("load",function() {

// criação do personagem no nível
Q.Sprite.extend("Player",{

  init: function(p) {

    this._super(p, {
      sheet: "player",  // definindo o sprite do personagem
      jumpSpeed: -400,
      speed: 300 
    // variáveis de movimento do personagem
    });

    this.add('2d, platformerControls'); // ativa os controles

    this.on("hit.sprite",function(collision) {

      if(collision.obj.isA("Tower")) {
          // verifica se há colisão com a porta/torre
          Q.stageScene("newphase",1, { label: "Você venceu!" }); 
          // se for positivo, vai pra fase 2 e exibe 'Você venceu!'
        this.destroy();
      } // a fase atual é terminada
    });
  }
});

// criação do alvo do jogador na fase
Q.Sprite.extend("Tower", {
  init: function(p) {
    this._super(p, { sheet: "door" });
  }
});

// criação dos inimigos
Q.Sprite.extend("Enemy",{
  init: function(p) {
    this._super(p, { sheet: 'enemy', vx: 100, visibleOnly: true });

    this.add('2d, aiBounce'); // ativa o salto em cima dos inimigos

    this.on("bump.left,bump.right,bump.bottom",function(collision) {
        // verifica se a colisão foi lateral ou por baixo
      if(collision.obj.isA("Player")) { 
        Q.stageScene("endGame",1, { label: "Você morreu!" }); 
        // se for positivo, termina a fase e exibe 'Você morreu!'
        collision.obj.destroy();
      } 
    });

    this.on("bump.top",function(collision) {
        // verifica se a colisão com o inimigo foi por cima
      if(collision.obj.isA("Player")) { 
        this.destroy();
        collision.obj.p.vy = -300;
      } // numa colisão superior, os inimigos são destruídos
    });
  }
});

// criação de nível, chamado level1, com tmx criado no Tiled para desenho do nível, tiles de 32x32px
Q.scene("level1",function(stage) {
  Q.stageTMX("level1.tmx",stage);
  stage.add("viewport").follow(Q("Player").first());
});
    
// criação de nível, chamado level2, com tmx criado no Tiled para desenho do nível, tiles de 32x32px
Q.scene("level2",function(stage) {
  Q.stageTMX("level2.tmx",stage);
  stage.add("viewport").follow(Q("Player").first());
});
    
Q.scene('endGame',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill:"black" }));

  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                  label: "Jogar novamente" }))         
  var label = container.insert(new Q.UI.Text({x:0, y: -10 - button.p.h, 
                                                   label: stage.options.label, color: "white" }));
  // as variáveis acima criam o botão de jogar novamente, ao morrer numa fase
    
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene('level1');
  }); // ao clicar no botão, o personagem reinicia o level 1

  container.fit(20);
});

Q.scene('newphase',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill:"black"  }));
  
  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                  label: "Nível 2" }))         
  var label = container.insert(new Q.UI.Text({x:0, y: -10 - button.p.h, 
                                                   label: stage.options.label, color: "white" }));
    
  var button2 = container.insert(new Q.UI.Button({ x: 0, y: 50, fill: "#CCCCCC",
                                                  label: "Voltar ao início" }))
  // as variáveis acima criam os botões de nova fase e voltar ao início ao final de cada fase
  
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene('level2');
  }); // ao clicar em nova fase, o jogador inicia a fase 2
 
  button2.on("click",function() {
    Q.clearStages();
    Q.stageScene('level1');
  }); // ao clicar em voltar ao início, o jogador inicia a fase 1
  container.fit(20);
});
    
// carrega o arquivo tmx da fase 1, a spritesheet e o arquivo json com informações dos sprites
Q.loadTMX("level1.tmx, sprites.json", function() {
  Q.compileSheets("sprites.png","sprites.json");
  Q.stageScene("level1");
});
    
// carrega o arquivo tmx da fase 2, a spritesheet e o arquivo json com informações dos sprites
Q.loadTMX("level2.tmx, sprites.json", function() {
  Q.compileSheets("sprites.png","sprites.json");
  Q.stageScene("level2");
});
});
