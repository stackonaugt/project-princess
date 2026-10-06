// PLENTY RD (HIGH ST), Preston, just up from Bell St. From the owner's photos:
// the sage green Stolberg Hotel on the corner, a car park, the Plenty & More
// cafe with its lime umbrellas, Plenty Road Convenience (door into the shop:
// smokes, American lollies and vapes), and Anaconda (door into the camping
// store). Across the road: the big grey building with the "meeting place"
// mural over its car park, The Secondhand Man, the printers and Preston
// Wheels & Tyres. The tram runs down the middle. High St heads north to
// Preston Station and the market.
//
//   y2-8 north side   y9 footpath   y10-13 Plenty Rd (tram 11-12)   y14 footpath
//   y15-17 south side   y18-24 houses, lemon trees and a weedy lot
import { MapBuilder } from '../MapBuilder.js';
import { street, furnish } from './citykit.js';

export function buildPreston() {
  const b = new MapBuilder({ id: 'preston', w: 48, h: 26, fill: 'c', seed: 305 });
  street(b, 9, { rows: 4, tram: true });
  b.fill(0, 0, 48, 3, 'b');

  // North side
  b.put('stolberg', 1, 6);
  b.fill(11, 3, 4, 6, 'P');
  b.put('car', 12, 4, { v: 'silver' });
  b.put('plentycafe', 15, 6);
  b.put('umbrella', 15, 9); b.put('umbrella', 18, 9);
  b.put('convenience', 19, 6);
  b.exit(23, 9, 1, 1, 'vapeshop', 'door', 'Plenty Road Convenience');
  b.fill(24, 3, 5, 6, 'P');
  b.put('car', 25, 4, { v: 'white' }); b.put('ute', 25, 7, { v: 'silver' });
  b.put('anaconda', 29, 6);
  b.exit(30, 9, 2, 1, 'anaconda', 'door', 'Anaconda');
  b.put('weatherboard', 44, 6, { v: 'cream' });
  // High St heads north to Preston Station and the market
  b.vline(41, 0, 8, 'f').vline(42, 0, 9, '#').vline(43, 0, 8, 'f');
  b.sign(40, 9, ['High St.', 'North to Preston Station, the skyrail and Preston Market.']);
  b.sign(14, 9, ['The Stolberg Hotel.', 'Corner of Bell St and Plenty Rd. Happy hour, a beer garden and a very good parma.']);
  furnish(b, 9, { skip: [14, 15, 18, 23, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43], seed: 0 });

  // South side
  b.put('muralbuilding', 1, 15);
  b.put('busshelter', 13, 14);
  b.put('secondhandman', 15, 15);
  b.put('printers', 21, 15);
  b.put('wheelstyres', 25, 15);
  furnish(b, 14, { skip: [13, 14, 46], seed: 3, step: 8 });

  // Behind: weatherboards, lemon trees and a weedy lot
  b.fill(0, 18, 48, 7, '.');
  b.fill(0, 18, 14, 1, 'b');
  b.sign(14, 18, ['The mural.', '"Many, many years ago, some Elders decided their people needed a meeting place." This is Wurundjeri country.']);
  b.put('weatherboard', 31, 15, { v: 'mint' }); b.put('weatherboard', 36, 15, { v: 'lemon' }); b.put('weatherboard', 41, 15, { v: 'blue' });
  b.put('tree', 46, 17, { v: 'lemon' }); b.put('tree', 39, 21, { v: 'lemon' });
  b.fenceH(30, 47, 19, 'picket', [33, 38, 43]);
  b.wildGrass(8, 22, 5, 1.5); b.wildGrass(24, 22, 4, 1.4);
  b.put('billboard', 42, 21, { v: 'trains' });
  b.sign(45, 14, ['Plenty Rd, Preston.', 'Reservoir is the next suburb up. You can smell the lemon trees.']);

  b.forage(15, 22, ['lemon', 'sardine']);
  b.forage(37, 23, ['tennis', 'chicken']);
  b.magpies([[5, 23], [30, 23]]);

  b.exit(0, 9, 1, 1, 'coburg', 'east', 'Bell St');
  b.exit(47, 14, 1, 1, 'loddon', 'southeast', 'Loddon Ave, Reservoir');
  b.exit(41, 0, 3, 1, 'prestonhigh', 'south', 'Preston Station');
  b.entry('vapeshop', 22, 9, 'down').entry('anaconda', 32, 9, 'down').entry('west', 1, 9, 'right').entry('east', 46, 14, 'left').entry('north', 41, 1, 'down');
  b.scatter([0, 0, b.w, b.h], 0.012, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
