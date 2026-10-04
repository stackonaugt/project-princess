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

// grass: base, alt, dark tuft, light tip
const LAVERTON_GRASS = ['#a9bb5e', '#a0b257', '#879a45', '#c6d47e'];
const BRUNSWICK_GRASS = ['#7cbd4e', '#74b548', '#5a9a38', '#9ad466'];
const RES_GRASS = ['#68b04a', '#61a845', '#4b8f36', '#86ca5e'];
const LAWN = ['#6cbc4a', '#62b244', '#4f9a38', '#86ca5e'];

export const SUBURBS = {
  laverton: { name: 'Laverton', tagline: 'Out west, where the sheds are big and the poodles are bigger.', station: 'station' },
  brunswick: { name: 'Brunswick', tagline: 'Trams, terraces and an oat milk surcharge.', station: 'brunswick' },
  reservoir: { name: 'Reservoir', tagline: 'Lemon trees, weatherboards and a lake full of opinions (ducks).', station: 'reservoir' },
};
export const SUBURB_ORDER = ['laverton', 'brunswick', 'reservoir'];

// home: true marks your place, where pets you've found hang out.
export const ZONES = {
  home: { name: 'Home', suburb: 'laverton', build: buildHome, grass: LAWN, indoor: true, home: true, tagline: 'Your new place. Mid-renovation.' },
  yard: { name: 'Backyard', suburb: 'laverton', build: buildYard, grass: LAWN, home: true, tagline: 'Plenty of room for zoomies.' },
  allen: { name: 'Allen St', suburb: 'laverton', build: buildAllen, grass: LAVERTON_GRASS, tagline: 'A quiet court. Mostly quiet. There is a poodle.' },
  woods: { name: 'Woods St', suburb: 'laverton', build: buildWoods, grass: LAVERTON_GRASS, tagline: 'Trish and Gordon\'s street.' },
  lohse: { name: 'Lohse St Reserve', suburb: 'laverton', build: buildLohse, grass: LAVERTON_GRASS, tagline: 'Gum trees, a playground and a very clean toilet block.' },
  station: { name: 'Laverton Station', suburb: 'laverton', build: buildStation, grass: LAVERTON_GRASS, tagline: 'Werribee line. Trains roughly as advertised.' },
  brunswick: { name: 'Brunswick Station', suburb: 'brunswick', build: buildBrunswick, grass: BRUNSWICK_GRASS, tagline: 'Upfield line. Mind the gap, and the cyclists.' },
  sydney: { name: 'Sydney Rd', suburb: 'brunswick', build: buildSydney, grass: BRUNSWICK_GRASS, tagline: 'Trams, bakeries and somebody\'s band.' },
  donald: { name: 'Donald St', suburb: 'brunswick', build: buildDonald, grass: BRUNSWICK_GRASS, tagline: 'Rose\'s street. Salami\'s street, really.' },
  hope: { name: 'Hope St', suburb: 'brunswick', build: buildHope, grass: BRUNSWICK_GRASS, tagline: 'Mem and Corni\'s place, and a lot of balcony plants.' },
  reservoir: { name: 'Reservoir Station', suburb: 'reservoir', build: buildResStation, grass: RES_GRASS, tagline: 'Mernda line, up on the skyrail.' },
  loddon: { name: 'Loddon Ave', suburb: 'reservoir', build: buildLoddon, grass: RES_GRASS, tagline: 'Seb and Sinead\'s units. Poppy\'s kingdom.' },
  glasgow: { name: 'Glasgow Ave', suburb: 'reservoir', build: buildGlasgow, grass: RES_GRASS, tagline: 'Tim and Nick\'s street. Stanley approves. Barely.' },
  track: { name: 'Athletics Track', suburb: 'reservoir', build: buildTrack, grass: RES_GRASS, tagline: 'Edwardes Lake Park. Tiny humans running in circles.' },
  lake: { name: 'Edwardes Lake', suburb: 'reservoir', build: buildLake, grass: RES_GRASS, tagline: 'A lake full of opinions (ducks).' },
  lakepark: { name: 'Lake Park', suburb: 'reservoir', build: buildLakePark, grass: RES_GRASS, tagline: 'Steam engines, pink slides and an ice cream van, rumour has it.' },
  wetlands: { name: 'Edgars Creek Wetlands', suburb: 'reservoir', build: buildWetlands, grass: RES_GRASS, tagline: 'Reeds, frogs and paths that all look the same.' },
};

// Kept for the Petdex tabs: pets are grouped by suburb.
export const REGIONS = SUBURBS;
export const REGION_ORDER = SUBURB_ORDER;

const cache = {};
export function getMap(id) { return cache[id] || (cache[id] = ZONES[id].build()); }
