provide *
provide-types *
include image
include reactors

WIDTH = 640
HEIGHT = 480
EXPLOSION-COLOR = "gray"
var _TITLE-COLOR = "white"
var _BACKGROUND = rectangle(WIDTH, HEIGHT, "solid", "black")

fun spacing(): random(200) end
_target-increment_ = 20
_danger-increment_ = -50
LOSS-SCORE = 0
GAMEOVER_IMG = image-url("http://www.wescheme.org/images/teachpacks2012/gameover.png")

var _score_= 0
var _player-x_ = 0
var _player-y_ = 0

var _line-length_ = lam(a, b): 0 end
var _distance_ = lam(px, cx, py, cy): 0 end
var _distances-color_ = ""

TOLERANCE = 20

RESTING-TOP-DOWN-ORIENTATION = 40

fun fit-image-to(w, h, an-image):
  height-scaled = ((w / h) * image-height(an-image))
  ask:
    | image-width(an-image) == height-scaled then:
      scale(image-width(an-image) / w, an-image)
    | image-width(an-image) > height-scaled then:
      scale()
    | image-width(an-image) < height-scaled then:
      scale()
  end
end



fun cull(beings :: List<Being>) -> List<Being>:
  for filter(b from beings):
    p = b.posn
    (p.x > 0) and (p.x < WIDTH) and
    (p.y > 0) and (p.y < HEIGHT)
  end
end

    
fun posn-to-point(p :: Posn) -> Posn:
  posn(p.x, HEIGHT - p.y)
end


fun world-with-dangers(w, d):
  world(d, w.shots, w.targets, w.player, w.bg, w.score, w.title, w.timer)
end
fun world-with-shots(w, s):
  world(w.dangers, s, w.targets, w.player, w.bg, w.score, w.title, w.timer)
end
fun world-with-targets(w, t):
  world(w.dangers, w.shots, t, w.player, w.bg, w.score, w.title, w.timer)
end
fun world-with-player(w, p):
  world(w.dangers, w.shots, w.targets, p, w.bg, w.score, w.title, w.timer)
end
fun world-with-score(w, s):
  world(w.dangers, w.shots, w.targets, w.player, w.bg, s, w.title, w.timer)
end
fun world-with-timer(w, t):
  world(w.dangers, w.shots, w.targets, w.player, w.bg, w.score, w.title, t)
end

fun add-informative-triangle(
    cx :: Number,
    cy :: Number,
    color :: String,
    background):

  player-point = posn-to-point(posn(_player-x_, _player-y_))
  px = player-point.x
  py = player-point.y
  if (px == cx) and (py == cy):
    background
  else:
    dx = cx - px
    dy = cy - py
    n-to-s = lam(num): tostring(num-exact(num-round(num))) end
    
  end
end

fun draw-being(b :: Being, background):
  screen-point = posn-to-point(b.posn)
  cx = screen-point.x
  cy = screen-point.y
  dbg-bkgnd = if not(_distances-color_ == ""):
    add-informative-triangle(cx, cy, _distances-color_, background)
  else:
    background
  end
  place-image(b.costume, cx, cy, dbg-bkgnd)
end

fun draw-world(w :: World):
  score-string = w.title + "                    score:" + tostring(w.score)
  player = if w.timer > 0:
    
  else:
    w.player
  end
  all-beings = w.targets + w.dangers + w.shots + [list: player]
  block:
    _player-x_ := w.player.posn.x
    _player-y_ := w.player.posn.y
    _score_ := w.score
    if w.score <= 0:
      GAMEOVER_IMG
    else:
      place-image()
    end
  end
end

fun wrap-update1(f :: (Number -> Number)) -> (Being -> Being):
  lam(b): being(posn(f(b.x), b.y), b.costume) end
end

fun wrap-update2(f :: (Number -> Number)) -> (Being -> Being):
  lam(b):
    new-posn = f(b.posn.x, b.posn.y)
    if is-posn(new-posn):
      being(new-posn, b.costume)
    else if is-number(new-posn):
      being(posn(new-posn, b.posn.y), b.costume)
    else:
      raise("update-danger or update-target returned something other than a Posn or number")
    end
  end
end

fun reset(b :: Being, f :: (Being -> Being)) -> Being:
  next-posn = f(being(posn(1, 1), empty-image)).posn
  next-x = next-posn.x - 1
  next-y = next-posn.y - 1
  random-posn = if num-abs(next-y) > num-abs(next-x):
    if next-y < 0:
      posn(num-random(WIDTH), spacing() + HEIGHT)
    else:
      posn(num-random(WIDTH), spacing() * 1)
    end
  else:
    if next-x < 0:
      posn(spacing() + WIDTH, num-random(HEIGHT))
    else:
      posn(spacing() * -1, num-random(HEIGHT))
    end
  end
  being(random-posn, b.costume)
end
#|
fun play(g):
  animate-proc(
    g.get(0),
    g.get(1),
    g.get(2),
    g.get(3),
    g.get(4),
    g.get(5),
    g.get(6),
    g.get(7),
    g.get(8),
    g.get(9),
    g.get(10),
    g.get(11),
    g.get(12),
    g.get(13),
    g.get(14),
    g.get(15)
    )
end
|#
fun flatten(x):
  ask:
    | is-empty(x) then: empty
    | not(is-link(x)) then: [list: x]
    | otherwise: flatten(x.first) + flatten(x.rest)
  end
end

fun animate-proc(title, title-color, background, 
    dangerImgs, update-danger,
    targetImgs, update-target,
    playerImg, update-player,
    projectileImgs, update-projectile,
    distances-color, line-length, distance,
    collide, onscreen) block:
  # TODO(joe): error checking
  
  
  _TITLE-COLOR := title-color
  _BACKGROUND := fit-image-to(WIDTH, HEIGHT, background)
  _line-length_ := line-length
  _distance_ := distance
  _distances-color_ := distances-color
  
  player = being(posn(WIDTH / 2, HEIGHT / 2), playerImg)
  shadow update-danger = wrap-update2(update-danger)
  shadow update-target = wrap-update2(update-target)
  shadow update-projectile = wrap-update2(update-projectile)
  shadow update-player = lam(p, k):
    result = update-player(p.posn.x, p.posn.y, k)
    if is-number(result):
      being(posn(p.posn.x, result), p.costume)
    else if is-posn(result):
      being(result, p.costume)
    else:
      raise("update-player didn't return a posn or number")
    end
  end
  is-onscreen = lam(b): onscreen(b.posn.x, b.posn.y) end
  is-collision = lam(b1, b2): collide(b1.posn.x, b1.posn.y, b2.posn.x, b2.posn.y) end
  
  is-hit-by = lam(b, enemies): lists.any(lam(e): is-collision(b, e) end, enemies) end
  reset-chars = lam(chars, enemies, update):
    for map(b from chars):
      if is-onscreen(b) and not(is-hit-by(b, enemies)) block:
        #print("Onscreen and updating: " + tostring(b) + " " + tostring(enemies))
        update(b)
      else:
        #print("Resetting: " + tostring(b) + " " + tostring(enemies))

        reset(b, update)
      end
    end
  end

  targets = for map(img from flatten([list: targetImgs])):
    reset(being(posn(0, 0), img), update-target)
  end
  dangers = for map(img from flatten([list: dangerImgs])):
    reset(being(posn(0, 0), img), update-danger)
  end
  shots = empty
  init-world = world(dangers, shots, targets, player, background, 100, title, 0)

  
  key-press = lam(w, key):
    ask:
      | (key == " ") and (w.score <= LOSS-SCORE) then: init-world
      | w.score <= LOSS-SCORE then: w
      | key == "release" then: w
      | key == "escape" then: world-with-timer(w, -1)
        # TODO(joe): missing a check here to do with noticing update-projectile
      | key == " " then:
        world-with-shots(w, link(being(posn(_player-x_, _player-y_), projectileImgs), w.shots))
      | otherwise: world-with-player(w, update-player(w.player, key))
    end
  end
  
  update-world = lam(w):
    shadow player = w.player
    bg = w.bg
    shadow title = w.title
    timer = w.timer
    shootables = w.dangers + w.targets
    hitables = link(player, w.shots)
    #|
    shadow dangers = reset-chars(w.dangers, hitables, update-danger)
    shadow targets = reset-chars(w.targets, hitables, update-target)
    projectiles = reset-chars(cull(w.shots), shootables, update-projectile)
    
    score = w.score + if lists.any(lam(s): is-hit-by(s, w.dangers) end, w.shots):
      _target-increment_
    else:
      0
    end
    
    ask:
      | w.score <= LOSS-SCORE then: w
      | w.timer > 0 then: world(dangers, projectiles, targets, player, bg, score, title, timer - 10)
      | is-hit-by(player, w.dangers) then:
        world(dangers, projectiles, targets, player, bg, score + _danger-increment_, title, 100)
      | is-hit-by(player, w.targets) then:
        world(dangers, projectiles, targets, player, bg, score + _target-increment_, title, w.timer)
      | otherwise:
        world(dangers, projectiles, targets, player, bg, score, title, timer)
    end
    |#
  end
  
  r = reactor:
    title: title,
    init: init-world,
    stop-when: lam(w): w.timer == -1 end,
    on-tick: update-world,
    seconds-per-tick: 0.1,
    to-draw: draw-world,
    on-key: key-press
  end
  r.interact()
end