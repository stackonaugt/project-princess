import { readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reserveRemovedIds, validateEntities } from './studio-entities.mjs';
import { suppliedArtCatalog, validateEntityArt } from './studio-art.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gameRoot = path.join(projectRoot, 'game');
const overridesPath = path.join(gameRoot, 'src/authoring/overrides.json');
const spritesRoot = path.join(gameRoot, 'assets/sprites');
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const revisionOf = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

export const STUDIO_SECTIONS = Object.freeze({
  story: {
    title: 'Stories & dialogue',
    modules: {
      'data/story.js': [
        'CHAPTERS', 'GOALS', 'CH1', 'CH1_PAPER', 'CH1_HELEN',
        'CH1_ENROLLED', 'SCHOOL_FEE', 'SCHOOL_LINES', 'SCHOOL_DEFAULT',
        'CH2_RECIPE', 'CH3_PRANKS', 'CH4', 'PADDY_SPILL',
        'PADDY_SPILL_HINT', 'LUNCH', 'RECIPES', 'PRANKS', 'RSVP',
        'TRIVIA', 'PARTY_STORIES', 'PARTY_MINGLE', 'PADDY_PARTY',
        'PADDY_SPEECH', 'PARTY_END', 'THE_END',
      ],
      'data/dialogue.js': ['PEOPLE', 'PET_TEXT', 'PLACES'],
    },
  },
  gameplay: {
    title: 'Pets & gameplay',
    modules: {
      'data/pets.js': ['PETS'],
      'data/moves.js': ['MOVES', 'PET_MOVES'],
      'data/items.js': ['ITEMS'],
    },
  },
  world: {
    title: 'Characters & shops',
    modules: {
      'data/npcs.js': ['NPCS'],
      'data/shops.js': ['SHOPS'],
      'data/routines.js': ['ROUTINE_OVERRIDES'],
    },
  },
});

const sendJson = (response, status, value) => {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(value));
};

function safeJson(value, depth = 0) {
  if (depth > 48) throw new Error('The edited data is nested too deeply.');
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('Values must be finite numbers.');
    return value;
  }
  if (Array.isArray(value)) return value.map(item => safeJson(item, depth + 1));
  if (value && typeof value === 'object') {
    const result = {};
    for (const [key, item] of Object.entries(value)) {
      if (['__proto__', 'constructor', 'prototype'].includes(key)) {
        throw new Error(`The field "${key}" cannot be saved.`);
      }
      result[key] = safeJson(item, depth + 1);
    }
    return result;
  }
  throw new Error('Only ordinary JSON values can be saved.');
}

async function readOverrides() {
  try {
    const result = JSON.parse(await readFile(overridesPath, 'utf8'));
    if (result.version !== 1 || !result.maps || !result.data) {
      throw new Error('The authoring data file has an unsupported version.');
    }
    return result;
  } catch (error) {
    if (error.code === 'ENOENT') return { version: 1, maps: {}, data: {} };
    throw error;
  }
}

async function readRequestBody(request) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > MAX_BODY_BYTES) throw new Error('The save is too large (maximum 2 MB).');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function validateMapEdits(mapId, edits, map, objects, regions, tileNames) {
  const regionIds = Object.keys(regions.ZONES);
  const inBounds = (x, y) => Number.isInteger(x) && Number.isInteger(y) &&
    x >= 0 && y >= 0 && x < map.w && y < map.h;
  if (!edits || typeof edits !== 'object' || Array.isArray(edits)) throw new Error(`Invalid edits for ${mapId}.`);
  for (const tile of edits.tiles || []) {
    if (!inBounds(tile.x, tile.y) || !Object.hasOwn(tileNames, tile.tile)) {
      throw new Error(`A painted tile falls outside ${mapId}.`);
    }
  }
  const objectEdits = edits.objects || {};
  for (const index of objectEdits.remove || []) {
    if (!Number.isInteger(index) || index < 0 || index >= map.objects.length) throw new Error(`Invalid object index on ${mapId}.`);
  }
  for (const move of objectEdits.move || []) {
    if (!Number.isInteger(move.index) || move.index < 0 || move.index >= map.objects.length ||
        !inBounds(move.x, move.y) ||
        move.x + map.objects[move.index].w > map.w ||
        move.y + map.objects[move.index].h > map.h) throw new Error(`An object move falls outside ${mapId}.`);
  }
  for (const object of objectEdits.add || []) {
    if (!Object.hasOwn(objects, object.kind) || !inBounds(object.x, object.y) ||
        object.x + objects[object.kind].foot[0] > map.w ||
        object.y + objects[object.kind].foot[1] > map.h ||
        (object.v !== undefined && typeof object.v !== 'string')) throw new Error(`Invalid object placement on ${mapId}.`);
  }
  const exitEdits = edits.exits || {};
  for (const index of exitEdits.remove || []) {
    if (!Number.isInteger(index) || index < 0 || index >= map.exits.length) throw new Error(`Invalid exit index on ${mapId}.`);
  }
  for (const update of exitEdits.update || []) {
    if (!Number.isInteger(update.index) || update.index < 0 || update.index >= map.exits.length ||
        (update.to !== undefined && update.to !== null && !regionIds.includes(update.to)) ||
        (update.label !== undefined && typeof update.label !== 'string')) {
      throw new Error(`Invalid exit update on ${mapId}.`);
    }
  }
  for (const exit of exitEdits.add || []) {
    if (![exit.x, exit.y, exit.w, exit.h].every(Number.isInteger) ||
        exit.x < 0 || exit.y < 0 || exit.w < 1 || exit.h < 1 ||
        exit.x + exit.w > map.w || exit.y + exit.h > map.h ||
        !['string', 'object'].includes(typeof exit.to) ||
        (exit.to !== null && !regionIds.includes(exit.to)) ||
        typeof exit.label !== 'string') throw new Error(`Invalid exit on ${mapId}.`);
  }
  const changedExits = (exitEdits.update || []).map(update => ({ ...map.exits[update.index], ...update }))
    .concat(exitEdits.add || []);
  for (const exit of changedExits) {
    if (![exit.x, exit.y, exit.w, exit.h].every(Number.isInteger) ||
        exit.x < 0 || exit.y < 0 || exit.w < 1 || exit.h < 1 ||
        exit.x + exit.w > map.w || exit.y + exit.h > map.h) throw new Error(`Exit geometry falls outside ${mapId}.`);
    if (exit.to && !Object.hasOwn(regions.ZONES[exit.to].build().entries, exit.entry)) {
      throw new Error(`The arrival entry "${exit.entry}" does not exist in ${exit.to}.`);
    }
  }
}

export function editorValue(name, value) {
  const result = JSON.parse(JSON.stringify(value));
  if (name === 'PETS') for (const pet of result) {
    for (const key of ['bio', 'clue', 'funFact', 'favouriteSpot', 'lines', 'night', 'rain', 'asleep']) delete pet[key];
    if (pet.evolution) delete pet.evolution.bio;
  }
  if (name === 'NPCS') for (const npc of Object.values(result)) {
    for (const key of ['role', 'lines', 'hints', 'giftLine', 'byHero', 'advice', 'leaving']) delete npc[key];
  }
  return result;
}

export function sameTypes(base, edited, label, complete = false) {
  if (base === null) {
    if (edited !== null) throw new Error(`${label} must remain empty.`);
    return;
  }
  if (Array.isArray(base)) {
    if (!Array.isArray(edited)) throw new Error(`${label} must remain a list.`);
    if (base.length) for (const [index, value] of edited.entries()) sameTypes(base[Math.min(index, base.length - 1)], value, label, true);
    return;
  }
  if (typeof base === 'object') {
    if (!edited || typeof edited !== 'object' || Array.isArray(edited)) throw new Error(`${label} must remain an object.`);
    if (complete && Object.keys(base).some(key => !Object.hasOwn(edited, key))) throw new Error(`${label} is missing required fields.`);
    for (const [key, value] of Object.entries(edited)) {
      if (!(key in base)) throw new Error(`${label}: adding the field "${key}" needs a code change.`);
      sameTypes(base[key], value, `${label}.${key}`, complete);
    }
    return;
  }
  if (typeof edited !== typeof base) throw new Error(`${label} must remain a ${typeof base}.`);
}

function validateSchedules(value, regions, npcs, maps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (const [id, rules] of Object.entries(value)) {
    if (!Object.hasOwn(npcs, id)) throw new Error(`Unknown character "${id}".`);
    const places = new Set(Object.values(regions.ZONES).flatMap(zone =>
      ((maps?.[zone.build().id] || zone.build()).npcs || []).filter(npc => npc.id === id && npc.at).map(npc => npc.at)));
    if (!Array.isArray(rules)) throw new Error(`The schedule for ${id} must be a list of rules.`);
    for (const rule of rules) {
      if (!Array.isArray(rule.days) || rule.days.some(day => !days.includes(day)) ||
          !Number.isFinite(rule.from) || !Number.isFinite(rule.until) ||
          rule.from < 0 || rule.until > 1560 || rule.until <= rule.from ||
          (rule.place !== null && !places.has(rule.place))) {
        throw new Error(`The schedule for ${id} has an invalid day, time or place.`);
      }
    }
  }
}

function createEditorApiPlugin() {
  return {
    name: 'project-princess-dev-studio-api',
    configureServer(server) {
      let saving = false;
      const loadRegions = () => server.ssrLoadModule('/src/data/regions.js');
      const loadObjects = async () => (await server.ssrLoadModule('/src/art/paint/objects.js')).OBJECTS;

      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url || '/', 'http://studio.local');
        if (!url.pathname.startsWith('/__studio_api/')) return next();

        response.setHeader('Cache-Control', 'no-store');
        response.setHeader('X-Content-Type-Options', 'nosniff');
        const origin = request.headers.origin;

        try {
          if (origin && (origin === 'null' || new URL(origin).host !== request.headers.host)) {
            return sendJson(response, 403, { error: 'Studio saves must come from this workspace.' });
          }
          if (request.method === 'GET' && url.pathname === '/__studio_api/catalog') {
            const regions = await loadRegions();
            const objects = await loadObjects();
            const { TILE_NAMES } = await server.ssrLoadModule('/src/art/paint/tiles.js');
            const serializableSections = {};
            for (const [id, section] of Object.entries(STUDIO_SECTIONS)) {
              serializableSections[id] = { title: section.title, modules: section.modules };
            }
            const npcModule = await server.ssrLoadModule('/src/data/npcs.js');
            const schedulePlaces = {};
            for (const id of regions.ROUTE) for (const npc of regions.getMap(id).npcs || []) {
              if (!npc.at) continue;
              schedulePlaces[npc.id] ||= new Set();
              schedulePlaces[npc.id].add(npc.at);
            }
            const saved = await readOverrides();
            const activeSprites = await readdir(path.join(gameRoot, 'assets/sprites/objects'));
            const templateSprites = await readdir(path.join(gameRoot, 'assets/sprites/templates/objects'));
            return sendJson(response, 200, {
              sections: serializableSections,
              regions: regions.ROUTE.filter(id => regions.ZONES[id]).map(id => ({
                id, name: regions.ZONES[id].name, indoor: !!regions.ZONES[id].indoor,
              })),
              objectKinds: Object.entries(objects).map(([id, object]) => ({
                id, foot: object.foot || [1, 1], solid: object.solid !== false,
                flat: !!object.flat, roof: !!object.roof,
                variants: Array.isArray(object.variants) ? object.variants : [],
              })),
              spriteFiles: { active: activeSprites, templates: templateSprites },
              suppliedArt: await suppliedArtCatalog(spritesRoot),
              scheduleCharacters: Object.entries(schedulePlaces).map(([id, places]) => ({
                id, name: npcModule.NPCS[id]?.name || id, places: [...places],
              })),
              tiles: Object.entries(TILE_NAMES).map(([id, name]) => ({ id, name })),
              saved,
              builtIn: {
                pets: (await server.ssrLoadModule('/src/authoring/overrides.js')).BASE_VALUES['data/pets.js|PETS']?.map(pet => pet.id) ||
                  (await server.ssrLoadModule('/src/data/pets.js')).PETS.filter(pet => !saved.custom?.pets?.[pet.id]).map(pet => pet.id),
                npcs: Object.keys(npcModule.NPCS).filter(id => !saved.custom?.npcs?.[id]),
              },
              revision: revisionOf(saved),
            });
          }

          if (request.method === 'GET' && url.pathname === '/__studio_api/art') {
            return sendJson(response, 200, await suppliedArtCatalog(spritesRoot));
          }

          if (request.method === 'GET' && url.pathname === '/__studio_api/map') {
            const regionId = url.searchParams.get('id');
            const regions = await loadRegions();
            const descriptor = regions.ZONES[regionId];
            if (!descriptor) return sendJson(response, 404, { error: 'Unknown region.' });
            const built = descriptor.build();
            const { id, w, h, ground, objects, exits, entries, npcs, spawns, plots } = built;
            return sendJson(response, 200, {
              map: { id, w, h, ground, objects, exits, entries, npcs, spawns, plots },
              edits: (await readOverrides()).maps[regionId] || null,
            });
          }

          if (request.method === 'GET' && url.pathname === '/__studio_api/data') {
            const sectionId = url.searchParams.get('section');
            const section = STUDIO_SECTIONS[sectionId];
            if (!section) return sendJson(response, 404, { error: 'Unknown content section.' });
            const data = {};
            for (const [moduleName, exportNames] of Object.entries(section.modules)) {
              const module = await server.ssrLoadModule(`/src/${moduleName}`);
              data[moduleName] = {};
              for (const exportName of exportNames) {
                if (!(exportName in module)) continue;
                data[moduleName][exportName] = editorValue(exportName, module[exportName]);
              }
            }
            return sendJson(response, 200, { data, saved: await readOverrides() });
          }

          if (request.method === 'PUT' && url.pathname === '/__studio_api/save') {
            if (saving) return sendJson(response, 409, { error: 'Another save is in progress. Try again after it finishes.' });
            saving = true;
            try {
            if (!String(request.headers['content-type'] || '').startsWith('application/json')) {
              return sendJson(response, 415, { error: 'Studio saves must be JSON.' });
            }
            const submitted = safeJson(await readRequestBody(request));
            const previous = await readOverrides();
            if (request.headers['if-match'] !== revisionOf(previous)) {
              return sendJson(response, 409, { error: 'Another save changed the project. Export your draft, then reload the studio before saving.' });
            }
            const regions = await loadRegions();
            const objects = await loadObjects();
            const { TILE_NAMES } = await server.ssrLoadModule('/src/art/paint/tiles.js');
            const regionIds = regions.ROUTE.filter(id => regions.ZONES[id]);
            const maps = submitted?.maps || {};
            const data = submitted?.data || {};
            const custom = submitted.custom;
            const retiredIds = reserveRemovedIds(submitted, previous);
            if (submitted?.version !== 1 || Array.isArray(maps) || Array.isArray(data) ||
                !maps || typeof maps !== 'object' || !data || typeof data !== 'object') {
              return sendJson(response, 400, { error: 'The authoring document has an invalid format.' });
            }
            for (const [mapId, edits] of Object.entries(maps)) {
              const descriptor = regions.ZONES[mapId];
              if (!descriptor) throw new Error(`Unknown map "${mapId}".`);
              validateMapEdits(mapId, edits, descriptor.build(), objects, regions, TILE_NAMES);
            }
            // Load all allowlisted modules to obtain original, pre-override schemas.
            for (const section of Object.values(STUDIO_SECTIONS)) {
              for (const moduleName of Object.keys(section.modules)) await server.ssrLoadModule(`/src/${moduleName}`);
            }
            const { BASE_VALUES } = await server.ssrLoadModule('/src/authoring/overrides.js');
            const { mapWithEdits } = await server.ssrLoadModule('/src/authoring/map-overrides.js');
            const { PET_FRAMES } = await server.ssrLoadModule('/src/art/sprites.js');
            const effective = validateEntities({ maps, data, custom }, BASE_VALUES, regions, mapWithEdits, sameTypes, editorValue, PET_FRAMES, previous);
            await validateEntityArt(custom, spritesRoot);
            for (const [sectionId, files] of Object.entries(data)) {
              const section = STUDIO_SECTIONS[sectionId];
              if (!section || !files || typeof files !== 'object' || Array.isArray(files)) {
                throw new Error(`Unknown content section "${sectionId}".`);
              }
              for (const [moduleName, values] of Object.entries(files)) {
                const allowedExports = section.modules[moduleName];
                if (!allowedExports || !values || typeof values !== 'object' || Array.isArray(values) ||
                    Object.keys(values).some(key => !allowedExports.includes(key))) {
                  throw new Error(`Unsupported data in ${moduleName}.`);
                }
                for (const [exportName, edited] of Object.entries(values)) {
                  if (exportName === 'ROUTINE_OVERRIDES') {
                    validateSchedules(edited, regions, effective.npcs, effective.maps);
                  } else {
                    const source = BASE_VALUES[`${moduleName}|${exportName}`];
                    sameTypes(editorValue(exportName, source), edited, exportName);
                    if (exportName === 'PETS' &&
                        (edited.length !== source.length ||
                         edited.some((pet, index) => pet.id !== source[index].id))) {
                      throw new Error('Pet IDs and the pet list must remain unchanged.');
                    }
                  }
                }
              }
            }

            const saved = { version: 1, maps, data, ...(custom ? { custom } : {}), ...(retiredIds ? { retiredIds } : {}) };
            const output = `${JSON.stringify(saved, null, 2)}\n`;
            const temporaryPath = `${overridesPath}.save-${process.pid}`;
            await writeFile(temporaryPath, output, 'utf8');
            await rename(temporaryPath, overridesPath);
            server.moduleGraph.invalidateAll();
            server.watcher.emit('change', overridesPath);
            return sendJson(response, 200, { ok: true, saved, revision: revisionOf(saved) });
            } finally { saving = false; }
          }
          return sendJson(response, 404, { error: 'Unknown studio endpoint.' });
        } catch (error) {
          return sendJson(response, 400, { error: error instanceof Error ? error.message : 'Studio request failed.' });
        }
      });
    },
  };
}

export { createEditorApiPlugin };
