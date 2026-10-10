// A reusable, in-world scorecard. No sprite-sheet changes are required.
export async function raiseScorecard(world, id, score) {
  const actor = world?.npcs?.find(npc => npc.id === id);
  if (!actor?.active) return () => {};
  const camera = world.cameras.main;
  camera.stopFollow();
  camera.pan(actor.x, actor.y - 16, 400);
  actor.perform?.('wave', 1800);
  const card = world.add.container(actor.x, actor.y - 12).setDepth(9600);
  const square = world.add.rectangle(0, 0, 26, 26, 0xffffff).setStrokeStyle(1, 0x343434);
  const number = world.add.text(0, 0, `${score}\n/10`, {
    fontFamily: 'monospace', fontSize: '10px', color: '#222222', align: 'center',
  }).setOrigin(.5);
  card.add([square, number]);
  world.tweens.add({ targets: card, y: actor.y - actor.displayHeight - 18, duration: 600, ease: 'Sine.easeOut' });
  await new Promise(resolve => {
    const done = () => { world.events.off('shutdown', done); resolve(); };
    world.events.once('shutdown', done);
    world.time.delayedCall(650, done);
  });
  return () => {
    card.destroy();
    if (world.player?.active) { camera.startFollow(world.player, true, .2, .2); world.onResize(); }
  };
}
