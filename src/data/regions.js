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
import { buildLygon } from '../world/maps/lygon.js';
import { buildGardens } from '../world/maps/gardens.js';
import { buildNicholson } from '../world/maps/nicholson.js';
import { buildGelateria } from '../world/maps/gelateria.js';
import { buildSwanston } from '../world/maps/swanston.js';
import { buildReading } from '../world/maps/reading.js';
import { buildBourke } from '../world/maps/bourke.js';
import { buildLaneways } from '../world/maps/laneways.js';
import { buildFlinders } from '../world/maps/flinders.js';
import { buildQueenVic } from '../world/maps/queenvic.js';

// grass: base, alt, dark tuft, light tip
const LAVERTON_GRASS = ['#a9bb5e', '#a0b257', '#879a45', '#c6d47e'];
// Brunswick is mostly concrete; its grass is the weedy, sun-baked kind.
const BRUNSWICK_GRASS = ['#93a85a', '#8a9f52', '#6a7f3a', '#b4c47a'];
const RES_GRASS = ['#68b04a', '#61a845', '#4b8f36', '#86ca5e'];
const CITY_GRASS = ['#9aaa5a', '#91a253', '#73873e', '#b8c47e'];
const LAWN = ['#6cbc4a', '#62b244', '#4f9a38', '#86ca5e'];
// Carlton Gardens and the city's lawns: well watered, a bit municipal.
const MELB_GRASS = ['#7cb456', '#73aa4f', '#5a9040', '#9cc870'];

import { PLACES } from './dialogue.js';

export const SUBURBS = {
  laverton: { name: 'Laverton', tagline: 'Out west, where the sheds are big and the poodles are bigger.', station: 'station' },
  brunswick: { name: 'Brunswick', tagline: 'Trams, terraces and an oat milk surcharge.', station: 'brunswick' },
  reservoir: { name: 'Reservoir', tagline: 'Lemon trees, weatherboards and a lake full of opinions (ducks).', station: 'reservoir' },
  // In-between suburbs: walk through them, or skip them on the train (no station stop).
  civic: { name: 'Altona', tagline: 'Hobsons Bay City Council, on Civic Parade.', between: true },
  altona: { name: 'Altona North', tagline: 'Sheds, trucks and the Westgate on the horizon.', between: true },
  footscray: { name: 'Footscray', tagline: 'Halfway to Brunswick. Pho, the river and a lot of pigeons.', between: true },
  flemington: { name: 'Flemington', tagline: 'Racecourse Rd. Nearly at Brunswick now.', between: true },
  coburg: { name: 'Coburg/Preston', tagline: 'Bell St traffic and bluestone walls.', between: true },
  preston: { name: 'Preston', tagline: 'Nearly at Reservoir. You can smell the lemon trees.', between: true },
  // Off Brunswick to the south: Carlton (no station; walk from Brunswick or the city), then the CBD.
  carlton: { name: 'Carlton', tagline: 'Lygon St, gelato and the Exhibition Building.' },
  city: { name: 'Melbourne CBD', tagline: 'Trams, laneways and the clocks at Flinders St.', station: 'flinders', stationName: 'Flinders Street Station' },
};
export const SUBURB_ORDER = ['laverton', 'brunswick', 'reservoir', 'carlton'];

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
  preston: { name: 'Plenty Rd', suburb: 'preston', build: buildPreston, grass: CITY_GRASS, },
  wetlands: { name: 'Edgars Creek Wetlands', suburb: 'reservoir', build: buildWetlands, grass: RES_GRASS, },
  // Carlton and the city (south of Brunswick)
  lygon: { name: 'Lygon St', suburb: 'carlton', build: buildLygon, grass: MELB_GRASS },
  gelateria: { name: 'Gelateria', suburb: 'carlton', build: buildGelateria, grass: LAWN, indoor: true },
  gardens: { name: 'Carlton Gardens', suburb: 'carlton', build: buildGardens, grass: MELB_GRASS },
  nicholson: { name: 'Nicholson St', suburb: 'carlton', build: buildNicholson, grass: MELB_GRASS },
  swanston: { name: 'Swanston St', suburb: 'city', build: buildSwanston, grass: MELB_GRASS },
  reading: { name: 'The Reading Room', suburb: 'city', build: buildReading, grass: LAWN, indoor: true },
  queenvic: { name: 'Queen Vic Market', suburb: 'city', build: buildQueenVic, grass: MELB_GRASS },
  bourke: { name: 'Bourke St', suburb: 'city', build: buildBourke, grass: MELB_GRASS },
  laneways: { name: 'Hosier Lane', suburb: 'city', build: buildLaneways, grass: CITY_GRASS },
  flinders: { name: 'Flinders Street Station', suburb: 'city', build: buildFlinders, grass: MELB_GRASS },
};


for (const [id, z] of Object.entries(ZONES)) z.tagline = PLACES[id];

// The whole route in walking order (the Map app draws this).
export const ROUTE = ['home', 'yard', 'allen', 'woods', 'lohse', 'civic', 'civiccentre', 'chamber', 'station', 'altona', 'bunnings', 'footscray', 'cozzo', 'flemington', 'brunswick', 'hope', 'petshop', 'sydney', 'bookshop', 'albion', 'bottleshop', 'donald', 'coburg', 'preston', 'vapeshop', 'anaconda', 'loddon', 'track', 'lake', 'lakepark', 'wetlands', 'glasgow', 'reservoir', 'lygon', 'gelateria', 'gardens', 'nicholson', 'swanston', 'reading', 'queenvic', 'bourke', 'laneways', 'flinders'];

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
