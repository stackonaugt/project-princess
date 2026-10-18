// SHA-256 of decoded RGBA pixels the owner supplied, before any frames were
// added. [width, height] is the original region to preserve at the left of
// the sheet, not the new sheet size. Re-hash when the owner uploads new art.
export const PET_ORIGINAL_PIXELS = {
  'pets/chloe.png': [418, 38, '38d62e2554c72cafac236bb8be2890bc91bc8cdc43cc0718ea5de16e40c23ae9'],   // Seb's art (2026-10-18), frames built from his drawing
  'pets/emilio.png': [32, 16, '8c58b007c7e34497f5fb52934208dd9ebfb6dc99602c45333a95c2febae2283e'],
  'pets/girlie.png': [176, 16, '9469a7c1911ffa09632fad8eb960544f64de6f755c55ac3661813a2dc5631a4c'],
  'pets/marty.png': [396, 36, '7a137e890948bd7affc5ea00aedc915dbd8c08a1d4c725d5244049557ec77290'],   // Seb's art (2026-10-18), frames built from his drawing
  'pets/poppy-evolved.png': [440, 40, 'd1d7af72661dbd9a1cb4a941d0a9607ea4e9bd5786ddceca3e87b1342abbe220'],   // Seb's art (2026-10-18), frames built from his drawing
  'pets/poppy.png': [440, 40, '88b2792ed7914d3154ed672c3f50b7019311242dfef0f78be3ad98d2e6c1b5e2'],   // Seb's art (2026-10-18), frames built from his drawing
  'pets/princess-evolved.png': [451, 41, 'f23537105cef9f7720193aefa6c3bb4359aac1d99b34724f6769ed534f68838d'],   // Seb's art (2026-10-18), frames built from his drawing
  'pets/princess.png': [429, 39, '08028d1c1fdefc777bfa6c810853f8ee069bb14ccd63d279b42aab86fba1d5fd'],   // Seb's art (2026-10-18), frames built from his drawing
  'pets/rusty-evolved.png': [418, 38, '9045b6e420f68677d4846b571e658acc0252a2f487d9716ea000ac42842ebba7'],   // Seb's art (2026-10-18), frames built from his drawing
  'pets/rusty.png': [418, 38, '29fcd8d9d82bc8af7902aede85792c4a24e2e7008a7e7a0b7f72a2392a8ba437'],   // Seb's art (2026-10-18), frames built from his drawing
  'pets/salami-evolved.png': [396, 36, '1c21b95512170fe16795f37aed60daaa0aa1a3358829ce767121cd42b235bbd9'],   // Seb's art (2026-10-18), frames built from his drawing
  'pets/salami.png': [385, 35, '811a4f464720a7387ece35a127049b0670a2b8236de51ac651381cbf010d5851'],   // Seb's art (2026-10-17), frames built from his drawing
  'pets/spooky-evolved.png': [418, 38, '2843f457a4bb759ba477e28d83e7c69b45d4f8b8ed6b3ec66a65ba5575eed736'],   // Seb's art (2026-10-18), frames built from his drawing
  'pets/spooky.png': [330, 30, '10bcb18731988e7f6cda98261ed32078af2cbff9597d9a3d0420c108b18a7da4'],   // Seb's art (2026-10-18), frames built from his drawing
  'pets/stanley.png': [407, 37, '6475f303ad026dbe122e21306f491140cd71e6a737fcb0b729d61c6fd032ed15'],   // Seb's art (2026-10-18), frames built from his drawing
  'pets/stanley-evolved.png': [440, 40, '203905f432e593216772a8166bfa6e56fec4dec7589f19ab6a1836af204bebfc'],   // Seb's art (2026-10-18), frames built from his drawing
  'pets/ziggy.png': [32, 16, 'f09d885c5995e8d17f6d2c0d783f73b2830e693e8f87e0da31f78289ad89bed1'],
  'templates/pets/chloe.png': [32, 16, 'd1253033b820b17842b868a49866b1a4d73eb5b899705956b5733aee303a0788'],
  'templates/pets/emilio.png': [32, 16, 'fc7c7ef951af87206c403ee9b47275697023261911f26642f9f5c4a26d5f7ecb'],
  'templates/pets/girlie.png': [32, 16, '9e0c481b36370b7c79057299dd833d9a1c5320e03519a0126db1011598614c99'],
  'templates/pets/poppy-evolved.png': [32, 16, 'fe3cbdd98b6405191a23bb0e04b21849e298be7791c4b492c975d09bfaa91dd5'],
  'templates/pets/poppy.png': [32, 16, 'b491f753d1eba2c38dc0944108a2fcc2a424fef02e6f57e120965b6098aaa38b'],
  'templates/pets/princess-evolved.png': [32, 16, '96b9a13fa203032adb51f11e09a308cd552ba004bab23a36b4b6e8c7bffffa09'],
  'templates/pets/princess.png': [32, 16, 'de6268409ec5390c326ac8c7937fa9b98f412ce7a6bc820a595eaecd3a27e1fe'],
  'templates/pets/rusty-evolved.png': [32, 16, 'c4b9972e602f923f12ff1ade814bebd8b1b07b878667838b43b34e658a749f34'],
  'templates/pets/rusty.png': [32, 16, '419dd5f37c9282d70c037aac52f023a67696ad07f54a0ca6eb524302654700e2'],
  'templates/pets/salami-evolved.png': [32, 16, 'b8cd8776463c6d162c805cd7454e656bdd92c40ec89ce657674c41f9c051725a'],
  'templates/pets/salami.png': [32, 16, '66f2fb3de34305a38284e44ac31bba4e91ea3bac15f72407582f2839fa0ab1e6'],
  'templates/pets/spooky.png': [32, 16, '94506ea76d3174fd7e67b5c26d0d103c0b23397d3e09388e01cd672e729a48c8'],
  'templates/pets/stanley-evolved.png': [32, 16, 'beaa1bb8ff369644316b35345afcffdf73eaea9cab14adf6a89d6171ba6db218'],
  'templates/pets/stanley.png': [32, 16, 'ffaa42af8e6091b6f3b830f940c8d887207c9bef06f9c8a5a1d1c4c8a594d0c3'],
  'templates/pets/ziggy.png': [32, 16, '6751de7525695d9b0f8749e8dba0bc56b9e3187c67545c0d271c86780eb1f7d2'],
};
