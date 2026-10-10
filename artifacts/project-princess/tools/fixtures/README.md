# Supplied terrain PNG checks

From the workspace root, with the Project Princess preview running:

```sh
pnpm --filter @workspace/project-princess run check:supplied-terrain
```

Both `check:studio-terrain` and `node tools/check-terrain-landmarks.mjs` also
run this suite. `STUDIO_URL` supports another preview host or base path.

## Coverage

- Source-built maps, not saved Studio responses: Allen, Glasgow, Reading Room,
  Edwardes Lake, Coburg Lake, Wetlands, Lake Park, Gardens, Nicholson, Flinders
  and Civic Parade.
- Decoded 32px PNG artwork, including road, footpath, water, timber and wall,
  with asymmetric marks, fully transparent edge/interior holes and partial
  alpha. All four quarter turns must remain visually distinct.
- The actual `WorldScene.buildGround` texture creation and inverse display
  scaling, plus `onResize` camera zoom for a 390×844 phone. The rasterized
  ground is then displayed with nearest-neighbour sampling at DPR 1, 2 and 3.
  Scene image/texture services are lightweight stand-ins; this is not a
  full Phaser WebGL screenshot test.
- The Studio painter's 12, 16, 24 and 32px cell transforms.
- 308 independent full-ground comparisons and 154 one-pixel negative controls.

The reference assembles PNG mosaics before clipping each whole surface, rather
than invoking the gameplay painter or drawing individual images under a clip.
It shares the terrain trace builders: existing geometry tests verify those
builders, while this suite isolates supplied-art assembly and scaling seams.
Colour is compared premultiplied by alpha, with at most three 8-bit values of
compositing rounding allowed per pixel. There is no allowed mismatch percentage.
Fixture detail boundaries avoid ambiguous nearest-neighbour sampling ties at
fractional Studio zooms; curve edges themselves are not snapped or masked out.

## Failure diagnostics

Failures exit nonzero and write small PNG crops around the first differing
pixel, including **expected**, **actual**, **diff**, and a side-by-side
**expected | actual | diff** comparison. Logs name the map, rotation, scale,
mismatch count and crop coordinates. `report.json` describes the current run;
old images in the same directory are not evidence of a current failure.

Default output: `/tmp/project-princess-supplied-terrain`.
Set `SUPPLIED_TERRAIN_SCREENSHOTS` to choose another directory and also export
the eleven unscaled gameplay texture samples.

To confirm both detection and failure-image generation without changing code:

```sh
TERRAIN_INJECT_SEAM=gap pnpm --filter @workspace/project-princess run check:supplied-terrain
TERRAIN_INJECT_SEAM=protrusion pnpm --filter @workspace/project-princess run check:supplied-terrain
```

Each command intentionally fails on exactly one phone DPR-3 Allen join pixel.
Unset the variable for normal checks.

## Saved-data safety

Each run gets an isolated browser context. The page is a blank fixture document,
not the game or Studio entry point. Every non-read HTTP request is blocked and
reported as a failure. Authoring bytes and local/session storage must remain
identical. Artwork is generated and decoded only in memory; it is never written
into sprite folders, assignments or map overrides. The temporary custom-image
registry is restored, and the browser context is always closed.
