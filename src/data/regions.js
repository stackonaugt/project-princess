// Suburbs and the zones (areas) inside them. Each zone is its own map; you
// move between zones by walking through exits or catching the train.
import { buildHome } from '../world/maps/home.js';
import { buildYard } from '../world/maps/yard.js';
import { buildAllen } from '../world/maps/allen.js';
import { buildWoods } from '../world/maps/woods.js';
import { buildLohse } from '../world/maps/lohse.js';
import { buildStation } from '../world/maps/station.js';
import { buildBrunswick } from '../world/maps/brunswick.js';
import { buildSydney } from '../world/maps/sydney.js';
import { buildDonald } from '../world/maps/donald.js';
import { buildHope } from '../world/maps/hope.js';
import { buildLake } from '../world/maps/lake.js';
import { buildTrack } from '../world/maps/track.js';
import { buildLakePark } from '../world/maps/lakepark.js';
import { buildWetlands } from '../world/maps/wetlands.js';
import { buildResStation } from '../world/maps/resstation.js';
import { buildLoddon } from '../world/maps/loddon.js';
import { buildGlasgow } from '../world/maps/glasgow.js';
import { buildAltona } from '../world/maps/altona.js';
import { buildFootscray } from '../world/maps/footscray.js';
import { buildFlemington } from '../world/maps/flemington.js';
import { buildCoburg } from '../world/maps/coburg.js';
import { buildPreston } from '../world/maps/preston.js';
import { buildPetShop } from '../world/maps/petshop.js';
import { buildAlbion } from '../world/maps/albion.js';
import { buildBottleShop } from '../world/maps/bottleshop.js';

// grass: base, alt, dark tuft, light tip
const LAVERTON_GRASS = ['#a9bb5e', '#a0b257', '#879a45', '#c6d47e'];
// Brunswick is mostly concrete; its grass is the weedy, sun-baked kind.
const BRUNSWICK_GRASS = ['#93a85a', '#8a9f52', '#6a7f3a', '#b4c47a'];
const RES_GRASS = ['#68b04a', '#61a845', '#4b8f36', '#86ca5e'];
const CITY_GRASS = ['#9aaa5a', '#91a253', '#73873e', '#b8c47e'];
const LAWN = ['#6cbc4a', '#62b244', '#4f9a38', '#86ca5e'];

export const SUBURBS = {
  laverton: { name: 'Laverton', tagline: 'Out west, where the sheds are big and the poodles are bigger.', station: 'station' },
  brunswick: { name: 'Brunswick', tagline: 'Trams, terraces and an oat milk surcharge.', station: 'brunswick' },
  reservoir: { name: 'Reservoir', tagline: 'Lemon trees, weatherboards and a lake full of opinions (ducks).', station: 'reservoir' },
  // In-between suburbs: walk through them, or skip them on the train (no station stop).
  altona: { name: 'Altona North', tagline: 'Sheds, trucks and the Westgate on the horizon.', between: true },
  footscray: { name: 'Footscray', tagline: 'Halfway to Brunswick. Pho, the river and a lot of pigeons.', between: true },
  flemington: { name: 'Flemington', tagline: 'Racecourse Rd. Nearly at Brunswick now.', between: true },
  coburg: { name: 'Coburg', tagline: 'Bell St traffic and bluestone walls.', between: true },
  preston: { name: 'Preston', tagline: 'Nearly at Reservoir. You can smell the lemon trees.', between: true },
};
export const SUBURB_ORDER = ['laverton', 'brunswick', 'reservoir'];

// home: true marks your place, where pets you've found hang out.
export const ZONES = {
  home: { name: 'Home', suburb: 'laverton', build: buildHome, grass: LAWN, indoor: true, home: true, tagline: 'Your new place. Mid-renovation.' },
  yard: { name: 'Backyard', suburb: 'laverton', build: buildYard, grass: LAWN, home: true, tagline: 'Plenty of room for zoomies.' },
  allen: { name: 'Allen St', suburb: 'laverton', build: buildAllen, grass: LAVERTON_GRASS, tagline: 'A quiet court. Mostly quiet. There is a poodle.' },
  petshop: { name: 'The Leash You Can Do', suburb: 'brunswick', build: buildPetShop, grass: LAWN, indoor: true, tagline: 'Treats, leads and a very judgemental goldfish.' },
  woods: { name: 'Woods St', suburb: 'laverton', build: buildWoods, grass: LAVERTON_GRASS, tagline: 'Trish and Gordon\'s street.' },
  lohse: { name: 'Lohse St Reserve', suburb: 'laverton', build: buildLohse, grass: LAVERTON_GRASS, tagline: 'Gum trees, a playground and a very clean toilet block.' },
  station: { name: 'Laverton Station', suburb: 'laverton', build: buildStation, grass: LAVERTON_GRASS, tagline: 'Werribee line. Trains roughly as advertised.' },
  brunswick: { name: 'Brunswick Station', suburb: 'brunswick', build: buildBrunswick, grass: BRUNSWICK_GRASS, tagline: 'Upfield line. Mind the gap, and the cyclists.' },
  sydney: { name: 'Sydney Rd', suburb: 'brunswick', build: buildSydney, grass: BRUNSWICK_GRASS, tagline: 'Trams, bakeries and somebody\'s band.' },
  albion: { name: 'Sydney Rd at Albion St', suburb: 'brunswick', build: buildAlbion, grass: BRUNSWICK_GRASS, tagline: 'The Edinburgh Castle, the 19 tram and a lot of For Lease signs.' },
  bottleshop: { name: 'Edinburgh Castle Bottleshop', suburb: 'brunswick', build: buildBottleShop, grass: LAWN, indoor: true, tagline: 'Cold cans, warm Macca, and a wall of coasters.' },
  donald: { name: 'Donald St', suburb: 'brunswick', build: buildDonald, grass: BRUNSWICK_GRASS, tagline: 'Rose\'s street. Salami\'s street, really.' },
  hope: { name: 'Hope St', suburb: 'brunswick', build: buildHope, grass: BRUNSWICK_GRASS, tagline: 'Mem and Corni\'s place, and a lot of balcony plants.' },
  reservoir: { name: 'Reservoir Station', suburb: 'reservoir', build: buildResStation, grass: RES_GRASS, tagline: 'Mernda line, up on the skyrail.' },
  loddon: { name: 'Loddon Ave', suburb: 'reservoir', build: buildLoddon, grass: RES_GRASS, tagline: 'Seb and Sinead\'s units. Poppy\'s kingdom.' },
  glasgow: { name: 'Glasgow Ave', suburb: 'reservoir', build: buildGlasgow, grass: RES_GRASS, tagline: 'Tim and Nick\'s street. Stanley approves. Barely.' },
  track: { name: 'Athletics Track', suburb: 'reservoir', build: buildTrack, grass: RES_GRASS, tagline: 'Edwardes Lake Park. Tiny humans running in circles.' },
  lake: { name: 'Edwardes Lake', suburb: 'reservoir', build: buildLake, grass: RES_GRASS, tagline: 'A lake full of opinions (ducks).' },
  lakepark: { name: 'Lake Park', suburb: 'reservoir', build: buildLakePark, grass: RES_GRASS, tagline: 'Steam engines, pink slides and an ice cream van, rumour has it.' },
  altona: { name: 'Kororoit Creek Rd', suburb: 'altona', build: buildAltona, grass: CITY_GRASS, tagline: 'The long walk east begins.' },
  footscray: { name: 'Barkly St', suburb: 'footscray', build: buildFootscray, grass: CITY_GRASS, tagline: 'Halfway there. Keep going.' },
  flemington: { name: 'Racecourse Rd', suburb: 'flemington', build: buildFlemington, grass: CITY_GRASS, tagline: 'Brunswick is just up the road.' },
  coburg: { name: 'Bell St', suburb: 'coburg', build: buildCoburg, grass: CITY_GRASS, tagline: 'Halfway to Reservoir.' },
  preston: { name: 'Gilbert Rd', suburb: 'preston', build: buildPreston, grass: CITY_GRASS, tagline: 'Reservoir is the next suburb up.' },
  wetlands: { name: 'Edgars Creek Wetlands', suburb: 'reservoir', build: buildWetlands, grass: RES_GRASS, tagline: 'Reeds, frogs and paths that all look the same.' },
};

// The whole route in walking order (the Map app draws this).
export const ROUTE = ['home', 'yard', 'allen', 'woods', 'lohse', 'station', 'altona', 'footscray', 'flemington', 'brunswick', 'hope', 'petshop', 'sydney', 'albion', 'bottleshop', 'donald', 'coburg', 'preston', 'loddon', 'track', 'lake', 'lakepark', 'wetlands', 'glasgow', 'reservoir'];

// Kept for the Petdex tabs: pets are grouped by suburb.
export const REGIONS = SUBURBS;
export const REGION_ORDER = SUBURB_ORDER;

const cache = {}, revs = {};
export function getMap(id) {
  if (!cache[id]) { cache[id] = ZONES[id].build(); cache[id].rev = revs[id] || 0; }
  return cache[id];
}
// Rebuild a map next time it's needed (house upgrades change home and yard).
export function invalidateMap(id) { delete cache[id]; revs[id] = (revs[id] || 0) + 1; }

// Which zone each townsperson stands in (from the maps), built once on demand.
let npcZones = null;
export function npcZone(id) {
  if (!npcZones) {
    npcZones = {};
    for (const z of Object.keys(ZONES)) for (const n of getMap(z).npcs || []) npcZones[n.id] = npcZones[n.id] || z;
  }
  return npcZones[id];
}
