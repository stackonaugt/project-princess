// The three suburbs. Order matters: it's the order shown in the Petdex.
import { buildLaverton } from '../world/maps/laverton.js';
import { buildBrunswick } from '../world/maps/brunswick.js';
import { buildReservoir } from '../world/maps/reservoir.js';

export const REGIONS = {
  laverton: {
    name: 'Laverton', build: buildLaverton,
    tagline: 'Out west, where the sheds are big and the poodles are bigger.',
    // grass: base, alt, dark tuft, light tip
    grass: ['#a9bb5e', '#a0b257', '#879a45', '#c6d47e'],
    station: 'Laverton',
  },
  brunswick: {
    name: 'Brunswick', build: buildBrunswick,
    tagline: 'Trams, terraces and an oat milk surcharge.',
    grass: ['#7cbd4e', '#74b548', '#5a9a38', '#9ad466'],
    station: 'Brunswick',
  },
  reservoir: {
    name: 'Reservoir', build: buildReservoir,
    tagline: 'Lemon trees, weatherboards and a lake full of opinions (ducks).',
    grass: ['#68b04a', '#61a845', '#4b8f36', '#86ca5e'],
    station: 'Reservoir',
  },
};

export const REGION_ORDER = ['laverton', 'brunswick', 'reservoir'];

const cache = {};
export function getMap(id) { return cache[id] || (cache[id] = REGIONS[id].build()); }
