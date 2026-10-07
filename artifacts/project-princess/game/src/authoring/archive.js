import { AUTHORING } from './overrides.js';

export function isArchived(kind, id, document = AUTHORING) {
  return document.custom?.[kind]?.[id]?.archived === true;
}

// Retain every definition for saves, battle forms, moves and artwork. Only
// encounter/discovery surfaces filter archived content; owned pets stay usable.
export function petVisible(id, found, document = AUTHORING) {
  return !isArchived('pets', id, document) || found;
}

export function petWorldMode(pet, regionId, atHome, found, inParty, document = AUTHORING) {
  if (inParty && found) return 'follow';
  if (atHome) return found && pet.homeSpot?.zone === regionId ? 'home' : null;
  return !isArchived('pets', pet.id, document) && pet.zone === regionId ? 'wild' : null;
}
