// Suburbs and the zones (areas) inside them. Each zone is its own map; you
// move between zones by walking through exits or catching the train.
import { buildHome } from '../world/maps/home.js';
import { buildYard } from '../world/maps/yard.js';
import { buildAllen } from '../world/maps/allen.js';
import { buildWoods } from '../world/maps/woods.js';
import { buildLohse } from '../world/maps/lohse.js';
import { buildStation } from '../world/maps/station.js';
import { buildBrunswick } from '../world/maps/brunswick.js';
import { buildReservoir } from '../world/maps/reservoir.js';

// grass: base, alt, dark tuft, light tip
const LAVERTON_GRASS = ['#a9bb5e', '#a0b257', '#879a45', '#c6d47e'];
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
  brunswick: { name: 'Brunswick', suburb: 'brunswick', build: buildBrunswick, grass: ['#7cbd4e', '#74b548', '#5a9a38', '#9ad466'], tagline: SUBURBS.brunswick.tagline },
  reservoir: { name: 'Reservoir', suburb: 'reservoir', build: buildReservoir, grass: ['#68b04a', '#61a845', '#4b8f36', '#86ca5e'], tagline: SUBURBS.reservoir.tagline },
};

// Kept for the Petdex tabs: pets are grouped by suburb.
export const REGIONS = SUBURBS;
export const REGION_ORDER = SUBURB_ORDER;

const cache = {};
export function getMap(id) { return cache[id] || (cache[id] = ZONES[id].build()); }
