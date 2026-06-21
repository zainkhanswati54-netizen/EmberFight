/* ===================================================================
   player.js — the player-controlled orb. Pure physics + rendering,
   no input handling or collision resolution here (that lives in
   game.js so this file can be unit-reasoned-about in isolation).
=================================================================== */

class Player {
  constructor(skin) {
    const cfg = PhysicsConfig.player;
    this.cfg = cfg;
    this.x = cfg.startX;
    this.y = PhysicsConfig.WORLD_H / 2;
    this.vy = 0;
    this.radius = cfg.radius;
    this.rotation = 0;         // degrees, smoothed
    this.lastFlapAt = -Infinity;
    this.alive = true;
    this.skin = skin || Skins.getDefault();
    this.flapFlashT = 0;       // brief visual pulse on flap, decays
    this.trail = [];           // ember particle trail positions
    this.trailTimer = 0;
  }

  reset() {
    this.x = this.cfg.startX;
    this.y = PhysicsConfig.WORLD_H / 2;
    this.vy = 0;
    this.rotation = 0;
    this.lastFlapAt = -Infinity;
    this.alive = true;
    this.flapFlashT = 0;
    this.trail.length = 0;
  }

  // idle bobbing motion used on the "ready" screen before the run starts
  idleBob(t) {
    this.y = PhysicsConfig.WORLD_H / 2 + Math.sin(t * 2.4) * 10;
    this.rotation = Math.sin(t * 2.4) * 6;
  }

  flap(nowMs) {
    if (!this.alive) return false;
    if (nowMs - this.lastFlapAt < this.cfg.flapDebounceMs) return false;
    this.lastFlapAt = nowMs;
    this.vy = this.cfg.flapVelocity;
    this.flapFlashT = 1;
    return true;
  }

  // dt in seconds
  update(dt, nowMs) {
    if (!this.alive) {
      // after death, keep falling under gravity for a satisfying drop
      this.vy = Util.clamp(this.vy + this.cfg.gravity * dt, this.cfg.maxRiseSpeed, this.cfg.maxFallSpeed * 1.4);
      this.y += this.vy * dt;
      this.rotation = Util.damp(this.rotation, 90, 6, dt);
      return;
    }

    this.vy += this.cfg.gravity * dt;
    this.vy = Util.clamp(this.vy, this.cfg.maxRiseSpeed, this.cfg.maxFallSpeed);
    this.y += this.vy * dt;

    // rotation derived purely from velocity — see physics-config notes
    const targetRot = this.vy < 0
      ? Util.lerp(0, this.cfg.rotationMaxUp, Util.clamp(this.vy / this.cfg.maxRiseSpeed, 0, 1))
      : Util.lerp(0, this.cfg.rotationMaxDown, Util.clamp(this.vy / this.cfg.maxFallSpeed, 0, 1));
    this.rotation = Util.damp(this.rotation, targetRot, this.cfg.rotationSmoothing, dt);

    this.flapFlashT = Util.damp(this.flapFlashT, 0, 10, dt);

    // ember trail particles while alive
    this.trailTimer -= dt;
    if (this.trailTimer <= 0) {
      this.trail.push({ x: this.x, y: this.y, life: 1, r: this.radius * 0.5 });
      this.trailTimer = 0.028;
    }
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const p = this.trail[i];
      p.life -= dt * 2.6;
      if (p.life <= 0) this.trail.splice(i, 1);
    }
  }

  getBounds() {
    // slightly smaller than visual radius for a forgiving hitbox —
    // classic Flappy clones do this; it just feels fairer
    return { cx: this.x, cy: this.y, r: this.radius * 0.82 };
  }

  draw(ctx) {
    // trail first (behind orb)
    for (const p of this.trail) {
      ctx.save();
      ctx.globalAlpha = Util.clamp(p.life, 0, 1) * 0.5;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * (0.6 + p.life * 0.6));
      grad.addColorStop(0, this.skin.colors.glow);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (0.6 + p.life * 0.6), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);

    const stretch = 1 + Util.clamp(Math.abs(this.vy) / this.cfg.maxFallSpeed, 0, 1) * this.cfg.squashAmount;
    const squash = 1 / stretch;
    ctx.scale(squash, stretch);

    // outer glow
    const glowR = this.radius * (1.8 + this.flapFlashT * 0.8);
    const glow = ctx.createRadialGradient(0, 0, this.radius * 0.2, 0, 0, glowR);
    glow.addColorStop(0, this.skin.colors.glow);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, glowR, 0, Math.PI * 2);
    ctx.fill();

    // body
    const bodyGrad = ctx.createRadialGradient(
      -this.radius * 0.3, -this.radius * 0.35, this.radius * 0.1,
      0, 0, this.radius
    );
    bodyGrad.addColorStop(0, this.skin.colors.highlight);
    bodyGrad.addColorStop(0.5, this.skin.colors.mid);
    bodyGrad.addColorStop(1, this.skin.colors.shadow);
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // rim light edge (matches the "lit from behind" reference look)
    ctx.strokeStyle = this.skin.colors.rim;
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius - 0.7, -2.4, 0.9);
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.restore();
  }
}
