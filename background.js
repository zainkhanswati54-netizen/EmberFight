/* ===================================================================
   obstacles.js — the scrolling bar obstacles (this game's equivalent
   of pipes), plus Ember-mode collectibles (sparks + surge gates).
   Kept deliberately simple geometry per the brief: clean rectangular
   bars with a warm rim-light edge, no decoration.
=================================================================== */

class ObstaclePair {
  constructor(x, gapCenterY, gapHeight, width) {
    this.x = x;
    this.width = width;
    this.gapCenterY = gapCenterY;
    this.gapHeight = gapHeight;
    this.passed = false;
    this.markedForRemoval = false;

    this.spark = null;
    this.isSurgeGate = false;
  }

  get topRect() {
    return { x: this.x, y: 0, w: this.width, h: this.gapCenterY - this.gapHeight / 2 };
  }

  get bottomRect() {
    const groundY = PhysicsConfig.WORLD_H - PhysicsConfig.world.groundHeight;
    const bottomStart = this.gapCenterY + this.gapHeight / 2;
    return { x: this.x, y: bottomStart, w: this.width, h: groundY - bottomStart };
  }

  update(dt, speed) {
    this.x -= speed * dt;
    if (this.x + this.width < -20) this.markedForRemoval = true;
  }

  draw(ctx, theme) {
    const top = this.topRect;
    const bottom = this.bottomRect;

    for (const rect of [top, bottom]) {
      if (rect.h <= 0) continue;
      this._drawBar(ctx, rect, theme);
    }

    if (this.spark && !this.spark.collected) {
      this._drawSpark(ctx);
    }
  }

  _drawBar(ctx, rect, theme) {
    const grad = ctx.createLinearGradient(rect.x, 0, rect.x + rect.w, 0);
    grad.addColorStop(0, theme.barShadow);
    grad.addColorStop(0.5, theme.barMid);
    grad.addColorStop(1, theme.barShadow);
    ctx.fillStyle = grad;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

    ctx.fillStyle = this.isSurgeGate ? theme.rimSurge : theme.rim;
    const edgeThickness = 2.5;
    const isTop = rect.y === 0;
    if (isTop) {
      ctx.fillRect(rect.x, rect.y + rect.h - edgeThickness, rect.w, edgeThickness);
    } else {
      ctx.fillRect(rect.x, rect.y, rect.w, edgeThickness);
    }

    ctx.strokeStyle = theme.barOutline;
    ctx.lineWidth = 1;
    ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.w - 1, Math.max(rect.h - 1, 0));
  }

  _drawSpark(ctx) {
    const s = this.spark;
    const x = this.x + this.width / 2;
    ctx.save();
    ctx.globalAlpha = 0.95;
    const grad = ctx.createRadialGradient(x, s.y, 0, x, s.y, s.r * 2.4);
    grad.addColorStop(0, 'rgba(255,217,154,0.9)');
    grad.addColorStop(1, 'rgba(255,217,154,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, s.y, s.r * 2.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffe3b0';
    ctx.beginPath();
    ctx.arc(x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  getSparkTarget() {
    if (!this.spark || this.spark.collected) return null;
    return { cx: this.x + this.width / 2, cy: this.spark.y, r: this.spark.r };
  }
}


class ObstacleField {
  constructor(mode) {
    this.mode = mode; // 'classic' | 'ember'
    this.pairs = [];
    this.distanceSinceSpawn = 0;
    this.passCount = 0;
    this.rng = Math.random;
  }

  reset() {
    this.pairs.length = 0;
    this.distanceSinceSpawn = 0;
    this.passCount = 0;
  }

  currentSpeed() {
    const cfg = PhysicsConfig.obstacles;
    const base = this.mode === 'ember' ? cfg.speedEmber : cfg.speed;
    const ramps = Math.floor(this.passCount / cfg.rampEveryNPasses);
    return Math.min(base + ramps * cfg.rampSpeedStep, cfg.rampSpeedCap);
  }

  currentGap() {
    const cfg = PhysicsConfig.obstacles;
    const base = this.mode === 'ember' ? cfg.gapHeightEmber : cfg.gapHeight;
    const ramps = Math.floor(this.passCount / cfg.rampEveryNPasses);
    return Math.max(base + ramps * cfg.rampGapStep, cfg.rampGapCap);
  }

  spawnPair() {
    const cfg = PhysicsConfig.obstacles;
    const gap = this.currentGap();
    const margin = cfg.minGapCenterMargin;
    const groundY = PhysicsConfig.WORLD_H - PhysicsConfig.world.groundHeight;
    const minCenter = margin + gap / 2;
    const maxCenter = groundY - margin - gap / 2;
    const center = Util.randRange(minCenter, maxCenter);

    const pair = new ObstaclePair(PhysicsConfig.WORLD_W + cfg.width, center, gap, cfg.width);

    if (this.mode === 'ember') {
      const r = Util.randRange(0, 1);
      if (r < PhysicsConfig.ember.surgeChance) {
        pair.isSurgeGate = true;
      } else if (r < PhysicsConfig.ember.surgeChance + PhysicsConfig.ember.sparkChance) {
        pair.spark = { y: center, collected: false, r: 7 };
      }
    }

    this.pairs.push(pair);
  }

  update(dt) {
    const cfg = PhysicsConfig.obstacles;
    const speed = this.currentSpeed();

    this.distanceSinceSpawn += speed * dt;
    if (this.distanceSinceSpawn >= cfg.spawnIntervalPx) {
      this.distanceSinceSpawn = 0;
      this.spawnPair();
    }

    for (const pair of this.pairs) {
      pair.update(dt, speed);
    }

    this.pairs = this.pairs.filter(p => !p.markedForRemoval);
  }

  draw(ctx, theme) {
    for (const pair of this.pairs) pair.draw(ctx, theme);
  }
}
