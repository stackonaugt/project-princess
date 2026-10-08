// Optional supervised player sparring. Separate HP, stamina and rules from
// pet battles, with no money loss or pets running home. Future quests can
// supply a different opponent profile without changing the pet battle code.
export class SparringSession {
  constructor(level = 1, opponent = {}) {
    this.level = Math.max(1, Math.min(10, level));
    this.x = 35;
    this.y = 60;
    this.foe = {
      x: 65,
      y: 60,
      hp: opponent.hp || 70,
      maxHp: opponent.hp || 70,
    };
    this.hp = 70;
    this.maxStamina = 90 + this.level * 10;
    this.stamina = this.maxStamina;
    this.clock = 0;
    this.cooldown = 0;
    this.invulnerable = 0;
    this.blockUntil = 0;
    this.nextStrike = 2.5;
    this.telegraph = null;
    this.complete = false;
    this.status =
      "Approach the padded dummy. Attack nearby; block or dodge the announced swing.";
  }
  action(kind, vector = { x: 0, y: 0 }) {
    if (this.complete) return false;
    if (kind === "attack") {
      if (this.cooldown > 0 || this.stamina < 12) {
        this.status = "Catch your breath before another attack.";
        return false;
      }
      this.stamina -= 12;
      this.cooldown = 0.55;
      this.attackUntil = this.clock + 0.25;
      if (Math.hypot(this.foe.x - this.x, this.foe.y - this.y) < 22) {
        this.foe.hp = Math.max(0, this.foe.hp - (9 + this.level * 2));
        this.status = "Clean hit.";
      } else this.status = "Too far away. Move closer to land the hit.";
    } else if (kind === "dodge") {
      if (this.stamina < 20) return false;
      this.stamina -= 20;
      this.invulnerable = 0.6;
      let { x, y } = vector;
      if (!x && !y) {
        x = this.x < this.foe.x ? -1 : 1;
        y = 0;
      }
      const d = Math.hypot(x, y) || 1;
      this.x = Math.max(8, Math.min(92, this.x + (x / d) * 13));
      this.y = Math.max(15, Math.min(85, this.y + (y / d) * 13));
      this.status = "Dodge!";
    } else if (kind === "block") {
      if (this.stamina < 8) return false;
      this.stamina -= 8;
      this.blockUntil = this.clock + 1.1;
      this.status = "Guard up for the next swing.";
    } else return false;
    this.checkEnd();
    return true;
  }
  tick(dt, v = { x: 0, y: 0 }) {
    if (this.complete) return;
    dt = Math.max(0, Math.min(0.1, dt));
    this.clock += dt;
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.invulnerable = Math.max(0, this.invulnerable - dt);
    this.stamina = Math.min(this.maxStamina, this.stamina + 18 * dt);
    this.x = Math.max(8, Math.min(92, this.x + v.x * 25 * dt));
    this.y = Math.max(15, Math.min(85, this.y + v.y * 25 * dt));
    if (!this.telegraph && this.clock >= this.nextStrike - 1) {
      this.telegraph = { x: this.x, y: this.y };
      this.status =
        "Dummy winding up! Move out of the red circle, block or dodge.";
    }
    if (this.clock >= this.nextStrike) {
      if (
        this.telegraph &&
        Math.hypot(this.x - this.telegraph.x, this.y - this.telegraph.y) < 14 &&
        this.invulnerable <= 0
      ) {
        const blocked = this.blockUntil >= this.clock;
        this.hp = Math.max(0, this.hp - (blocked ? 2 : 12));
        this.status = blocked
          ? "Blocked the swing."
          : "Caught by the swing. Watch the warning circle.";
      } else this.status = "Swing avoided. Your turn.";
      this.telegraph = null;
      this.nextStrike = this.clock + 2.8;
    }
    this.checkEnd();
  }
  checkEnd() {
    if (this.foe.hp <= 0 || this.hp <= 0 || this.clock >= 120) {
      this.complete = true;
      this.status =
        this.foe.hp <= 0
          ? "Sparring complete!"
          : "Take a breather. You can practise again with no penalty.";
    }
  }
  result() {
    return { win: this.foe.hp <= 0, hp: this.hp, time: this.clock };
  }
}
