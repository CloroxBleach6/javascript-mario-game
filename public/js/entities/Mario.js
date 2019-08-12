import Entity from '../Entity.js';
import Jump from '../traits/Jump.js';
import Go from '../traits/Go.js';
import Stomper from '../traits/Stomper.js';
import Killable from '../traits/Killable.js';
import {loadSpriteSheet} from '../loaders.js';

const FAST_DRAG = 1/5000
const SLOW_DRAG = 1/1000

export function loadMario() {
    return loadSpriteSheet('mario').then(createMarioFactory)
}

function createMarioFactory(sprite) {
    const runAnim = sprite.animations.get('run');
    function routeFrame(mario) {
        if (mario.jump.falling) return 'jump'
        if (mario.go.distance > 0) {
            if ((mario.vel.x > 0 && mario.go.dir < 0) || (mario.vel.x < 0 && mario.go.dir > 0)) return 'break'
            return runAnim(mario.go.distance);
        }
        return 'idle'
    }

    function setTurboState(turboON) {
        this.go.dragFactor = turboON ? FAST_DRAG : SLOW_DRAG;
    }

    function drawMario(ctx) {
        sprite.draw(routeFrame(this), ctx, 0, 0, this.go.heading < 0);
    }

    return function createMario() {
        const mario = new Entity();
        mario.size.set(16, 16);

        mario.addTrait(new Go());
        mario.addTrait(new Jump());
        mario.addTrait(new Stomper());
        mario.addTrait(new Killable());
        mario.killable.removeAfter = 0;
        mario.turbo = setTurboState;
        mario.draw = drawMario;
        mario.turbo(false);
        return mario;
    }
}