const MOVE_SPEED = 250
const INVADER_SPEED = 250
let CURRENT_SPEED = INVADER_SPEED
const LEVEL_DOWN = 250
const TIME_LEFT = 30
const BULLET_SPEED = 400
let COUNTER = 0

layer(['obj', 'ui'], 'obj')

const level = addLevel([
  '!^^^^^^^^^^^^^^^,  &',
  '!^^^^^^^^^^^^^^^,  &',
  '!^^^^^^^^^^^^^^^,  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
  '!                  &',
], {
  width: 100,
  height: 50,
  '^': [sprite('space-invader'), scale(3), 'space-invader'],
  '!': [sprite('wall'), ,'left-wall'],
  '&': [sprite('wall'), ,'right-wall'],
})

const score = add([
    text('Score:\n 0'),
    pos(42, 50),
    layer('ui'),
    scale(3),
    {
      value: 0,
    }
  ])

  const player = add([
    sprite('space-ship'),
    scale(4),
    pos(width()/2, height()/1.2),
    origin('center')
  ])

  keyDown('left', () => {
    player.move(-MOVE_SPEED, 0)
  })

  keyDown('right', () => {
    player.move(MOVE_SPEED, 0)
  })

  function spawnBullet(p) {
    add([rect(6,18), 
    pos(p), 
    origin('center'), 
    color(0.5, 0.5, 1),
    'bullet'
    ])
  }

  keyPress('space', () => {
    spawnBullet(player.pos.add(0, -25))
  })

  action('bullet', (b) => {
    b.move(0, -BULLET_SPEED)
    if(b.pos.y < 0) {
      destroy(b)
    }
  })

  collides('bullet', 'space-invader', (b, s) => {
    camShake(2)
    destroy(b)
    destroy(s)
    score.value++
    score.text = score.value
  })

  const timer = add([
    text('0'),
    pos(387,50),
    scale(3),
    layer('ui'),
    {
      time: TIME_LEFT
    },
  ])

  timer.action(() => {
    timer.time -= dt()
    timer.text = 'Time:\n' + timer.time.toFixed(2)
    if(timer.time <= 0) {
      go('lose', { score: score.value })
    }
  })

  action('space-invader', (s) => {
    s.move(CURRENT_SPEED, 0)
  })

  collides('space-invader', 'right-wall', () => {
    CURRENT_SPEED = -INVADER_SPEED
    every('space-invader', (s) => {
      s.move(0, LEVEL_DOWN)
    })
  })

  collides('space-invader', 'left-wall', () => {
    CURRENT_SPEED = INVADER_SPEED
    every('space-invader', (s) => {
      s.move(0, LEVEL_DOWN)
    })
  })

  player.overlaps('space-invader', () => {
    go('lose', { score: score.value })
  })

  action('space-invader', (s) => {
    if(s.pos.y >= (12 * 22)) {
    // if(s.pos.y >= height() / 2) {
      go('lose', { score: score.value })
    }
  })

let i = 0

  action('space-invader', (s) => {
    if(s.exists() == false) {
      i++
      if(i == 45) {
        go('win', { score: score.value })
      }
    }
  })

