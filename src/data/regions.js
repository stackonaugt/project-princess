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
import { buildCivic } from '../world/maps/civic.js';
import { buildCivicCentre } from '../world/maps/civiccentre.js';
import { buildChamber } from '../world/maps/chamber.js';
import { buildBookShop } from '../world/maps/bookshop.js';
import { buildBunnings } from '../world/maps/bunnings.js';
import { buildCozzo } from '../world/maps/cozzo.js';
import { buildAnaconda } from '../world/maps/anaconda.js';
import { buildVapeShop } from '../world/maps/vapeshop.js';
import { buildHolmes } from '../world/maps/holmes.js';
import { buildEbNicholson } from '../world/maps/ebnicholson.js';
import { buildEbMilkBar } from '../world/maps/ebmilkbar.js';
import { buildFleming } from '../world/maps/fleming.js';
import { buildBowls } from '../world/maps/bowls.js';
import { buildEbLygon } from '../world/maps/eblygon.js';
import { buildCoburgSyd } from '../world/maps/coburgsyd.js';
import { buildPideBakery } from '../world/maps/pidebakery.js';
import { buildCoburgMall } from '../world/maps/coburgmall.js';
import { buildCoburgLake } from '../world/maps/coburglake.js';
import { buildPrestonHigh } from '../world/maps/prestonhigh.js';
import { buildPrestonMkt } from '../world/maps/prestonmkt.js';
import { buildMoreland } from '../world/maps/moreland.js';
import { buildMurray } from '../world/maps/murray.js';
import { buildSummerhill } from '../world/maps/summerhill.js';
import { buildSummerhillMall } from '../world/maps/summerhillmall.js';

// grass: base, alt, dark tuft, light tip
const LAVERTON_GRASS = ['#a9bb5e', '#a0b257', '#879a45', '#c6d47e'];
// Brunswick is mostly concrete; its grass is the weedy, sun-baked kind.
const BRUNSWICK_GRASS = ['#93a85a', '#8a9f52', '#6a7f3a', '#b4c47a'];
const RES_GRASS = ['#68b04a', '#61a845', '#4b8f36', '#86ca5e'];
const CITY_GRASS = ['#9aaa5a', '#91a253', '#73873e', '#b8c47e'];
const LAWN = ['#6cbc4a', '#62b244', '#4f9a38', '#86ca5e'];

import { PLACES } from './dialogue.js';

export const SUBURBS = {
  laverton: { name: 'Laverton', tagline: 'Out west, where the sheds are big and the poodles are bigger.', station: 'station' },
  brunswick: { name: 'Brunswick', tagline: 'Trams, terraces and an oat milk surcharge.', station: 'brunswick' },
  // Brunswick East: a full suburb, east of Brunswick. No train out here, so
  // the myki reader is at the 96 tram stop on Nicholson St (content in data/east.js).
  brunswickeast: { name: 'Brunswick East', tagline: 'Trams, bluestone, a milk bar sorceress and the biggest oval in the north.', station: 'ebnicholson' },
  reservoir: { name: 'Reservoir', tagline: 'Lemon trees, weatherboards and a lake full of opinions (ducks).', station: 'reservoir' },
  // In-between suburbs: walk through them, or skip them on the train (no station stop).
  civic: { name: 'Altona', tagline: 'Hobsons Bay City Council, on Civic Parade.', between: true },
  altona: { name: 'Altona North', tagline: 'Sheds, trucks and the Westgate on the horizon.', between: true },
  footscray: { name: 'Footscray', tagline: 'Halfway to Brunswick. Pho, the river and a lot of pigeons.', between: true },
  flemington: { name: 'Flemington', tagline: 'Racecourse Rd. Nearly at Brunswick now.', between: true },
  // Coburg and Preston: full suburbs between Brunswick and Reservoir (content in data/north.js).
  coburg: { name: 'Coburg', tagline: 'Pide ovens, Pentridge bluestone and a lake full of swans.', station: 'coburgmall' },
  preston: { name: 'Preston', tagline: 'The market, the skyrail and the 86 tram up Plenty Rd.', station: 'prestonhigh' },
};
export const SUBURB_ORDER = ['laverton', 'brunswick', 'brunswickeast', 'coburg', 'preston', 'reservoir'];

// home: true marks your place, where pets you've found hang out.
export const ZONES = {
  home: { name: 'Home', suburb: 'laverton', build: buildHome, grass: LAWN, indoor: true, home: true, },
  yard: { name: 'Backyard', suburb: 'laverton', build: buildYard, grass: LAWN, home: true, },
  allen: { name: 'Allen St', suburb: 'laverton', build: buildAllen, grass: LAVERTON_GRASS, },
  petshop: { name: 'The Leash You Can Do', suburb: 'brunswick', build: buildPetShop, grass: LAWN, indoor: true, },
  woods: { name: 'Woods St', suburb: 'laverton', build: buildWoods, grass: LAVERTON_GRASS, },
  lohse: { name: 'Lohse St Reserve', suburb: 'laverton', build: buildLohse, grass: LAVERTON_GRASS, },
  civic: { name: 'Civic Parade', suburb: 'civic', build: buildCivic, grass: LAWN },
  civiccentre: { name: 'Civic Centre', suburb: 'civic', build: buildCivicCentre, grass: LAWN, indoor: true },
  chamber: { name: 'Council Chamber', suburb: 'civic', build: buildChamber, grass: LAWN, indoor: true },
  station: { name: 'Laverton Station', suburb: 'laverton', build: buildStation, grass: LAVERTON_GRASS, },
  brunswick: { name: 'Brunswick Station', suburb: 'brunswick', build: buildBrunswick, grass: BRUNSWICK_GRASS, },
  sydney: { name: 'Sydney Rd', suburb: 'brunswick', build: buildSydney, grass: BRUNSWICK_GRASS, },
  albion: { name: 'Sydney Rd at Albion St', suburb: 'brunswick', build: buildAlbion, grass: BRUNSWICK_GRASS, },
  bottleshop: { name: 'Edinburgh Castle Bottleshop', suburb: 'brunswick', build: buildBottleShop, grass: LAWN, indoor: true, },
  bookshop: { name: 'Brunswick Bound', suburb: 'brunswick', build: buildBookShop, grass: LAWN, indoor: true },
  donald: { name: 'Donald St', suburb: 'brunswick', build: buildDonald, grass: BRUNSWICK_GRASS, },
  hope: { name: 'Hope St', suburb: 'brunswick', build: buildHope, grass: BRUNSWICK_GRASS, },
  reservoir: { name: 'Reservoir Station', suburb: 'reservoir', build: buildResStation, grass: RES_GRASS, },
  loddon: { name: 'Loddon Ave', suburb: 'reservoir', build: buildLoddon, grass: RES_GRASS, },
  glasgow: { name: 'Glasgow Ave', suburb: 'reservoir', build: buildGlasgow, grass: RES_GRASS, },
  track: { name: 'Athletics Track', suburb: 'reservoir', build: buildTrack, grass: RES_GRASS, },
  lake: { name: 'Edwardes Lake', suburb: 'reservoir', build: buildLake, grass: RES_GRASS, },
  lakepark: { name: 'Lake Park', suburb: 'reservoir', build: buildLakePark, grass: RES_GRASS, },
  bunnings: { name: 'Bunnings Warehouse', suburb: 'altona', build: buildBunnings, grass: LAWN, indoor: true },
  cozzo: { name: 'Franco Cozzo', suburb: 'footscray', build: buildCozzo, grass: LAWN, indoor: true },
  anaconda: { name: 'Anaconda', suburb: 'preston', build: buildAnaconda, grass: LAWN, indoor: true },
  vapeshop: { name: 'Plenty Road Convenience', suburb: 'preston', build: buildVapeShop, grass: LAWN, indoor: true },
  altona: { name: 'Kororoit Creek Rd', suburb: 'altona', build: buildAltona, grass: CITY_GRASS, },
  footscray: { name: 'Barkly St', suburb: 'footscray', build: buildFootscray, grass: CITY_GRASS, },
  flemington: { name: 'Racecourse Rd', suburb: 'flemington', build: buildFlemington, grass: CITY_GRASS, },
  coburg: { name: 'Bell St', suburb: 'coburg', build: buildCoburg, grass: CITY_GRASS, },
  coburgsyd: { name: 'Sydney Rd', suburb: 'coburg', build: buildCoburgSyd, grass: CITY_GRASS, },
  pidebakery: { name: 'Knead to Know', suburb: 'coburg', build: buildPideBakery, grass: LAWN, indoor: true },
  coburgmall: { name: 'Coburg Station', suburb: 'coburg', build: buildCoburgMall, grass: CITY_GRASS, },
  coburglake: { name: 'Coburg Lake', suburb: 'coburg', build: buildCoburgLake, grass: RES_GRASS, },
  moreland: { name: 'Moreland Rd', suburb: 'coburg', build: buildMoreland, grass: CITY_GRASS, },
  murray: { name: 'Murray Rd', suburb: 'preston', build: buildMurray, grass: CITY_GRASS, },
  prestonmkt: { name: 'Preston Market', suburb: 'preston', build: buildPrestonMkt, grass: CITY_GRASS, },
  prestonhigh: { name: 'Preston Station', suburb: 'preston', build: buildPrestonHigh, grass: CITY_GRASS, },
  preston: { name: 'Plenty Rd', suburb: 'preston', build: buildPreston, grass: CITY_GRASS, },
  holmes: { name: 'Holmes St', suburb: 'brunswickeast', build: buildHolmes, grass: BRUNSWICK_GRASS, },
  ebnicholson: { name: 'Nicholson St', suburb: 'brunswickeast', build: buildEbNicholson, grass: BRUNSWICK_GRASS, },
  ebmilkbar: { name: 'East Brunswick Milk Bar', suburb: 'brunswickeast', build: buildEbMilkBar, grass: LAWN, indoor: true },
  fleming: { name: 'Fleming Park', suburb: 'brunswickeast', build: buildFleming, grass: LAWN, },
  bowls: { name: 'Brunswick Bowls Club', suburb: 'brunswickeast', build: buildBowls, grass: LAWN, },
  eblygon: { name: 'Lygon St', suburb: 'brunswickeast', build: buildEbLygon, grass: BRUNSWICK_GRASS, },
  wetlands: { name: 'Edgars Creek Wetlands', suburb: 'reservoir', build: buildWetlands, grass: RES_GRASS, },
  summerhill: { name: 'Summerhill Shopping Centre', suburb: 'reservoir', build: buildSummerhill, grass: RES_GRASS, },
  summerhillmall: { name: 'Summerhill Shopping Centre', suburb: 'reservoir', build: buildSummerhillMall, grass: LAWN, indoor: true },
};


for (const [id, z] of Object.entries(ZONES)) z.tagline = PLACES[id];

// The whole route in walking order (the Map app draws this).
export const ROUTE = ['home', 'yard', 'allen', 'woods', 'lohse', 'civic', 'civiccentre', 'chamber', 'station', 'altona', 'bunnings', 'footscray', 'cozzo', 'flemington', 'brunswick', 'hope', 'petshop', 'sydney', 'bookshop', 'albion', 'bottleshop', 'donald', 'holmes', 'fleming', 'bowls', 'eblygon', 'ebnicholson', 'ebmilkbar', 'coburg', 'moreland', 'coburgsyd', 'pidebakery', 'coburgmall', 'coburglake', 'prestonmkt', 'murray', 'prestonhigh', 'preston', 'vapeshop', 'anaconda', 'loddon', 'summerhill', 'summerhillmall', 'track', 'lake', 'lakepark', 'wetlands', 'glasgow', 'reservoir'];

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
