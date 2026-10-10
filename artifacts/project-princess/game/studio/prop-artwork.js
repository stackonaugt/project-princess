// Both loaded PNG images and generated canvases are map artwork sources.
// Images use decoded dimensions, not their potentially CSS-sized width.
export function propArtworkSize(source, definition, cell = 16) {
  const sourceWidth = source.naturalWidth ?? source.width;
  const sourceHeight = source.naturalHeight ?? source.height;
  const worldWidth = definition?.tex?.[0] ?? sourceWidth;
  if (![sourceWidth, sourceHeight, worldWidth, cell].every(value =>
    Number.isFinite(value) && value > 0)) {
    throw new TypeError('Prop artwork must have positive, finite dimensions.');
  }
  const scale = worldWidth / sourceWidth * cell / 16;
  return { width: sourceWidth * scale, height: sourceHeight * scale };
}

export function propArtworkBounds(object, size, cell) {
  const footprint = {
    left: object.x * cell, top: object.y * cell,
    right: (object.x + object.w) * cell, bottom: (object.y + object.h) * cell,
  };
  if (!size) return {
    left: footprint.left - 3, top: footprint.top - 3,
    right: footprint.right + 3, bottom: footprint.bottom + 3,
  };
  const { width, height } = size;
  const centerX = (object.x + object.w / 2) * cell;
  const anchorY = footprint.bottom;
  const angle = ((object.rotation || 0) % 4) * Math.PI / 2;
  const cos = Math.cos(angle), sin = Math.sin(angle);
  const corners = [[-width / 2, -height], [width / 2, -height],
    [width / 2, 0], [-width / 2, 0]].map(([x, y]) => [
    centerX + x * cos - y * sin, anchorY + x * sin + y * cos,
  ]);
  return {
    left: Math.min(...corners.map(point => point[0]), footprint.left) - 3,
    top: Math.min(...corners.map(point => point[1]), footprint.top) - 3,
    right: Math.max(...corners.map(point => point[0]), footprint.right) + 3,
    bottom: Math.max(...corners.map(point => point[1]), footprint.bottom) + 3,
  };
}
