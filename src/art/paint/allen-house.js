// Allen St pilot. Same 136x92 texture and 8x3 collision footprint as before.
// Colour clusters and architecture follow the supplied frontage photograph.
export function paintAllenHouse(p) {
  const r = (c,x,y,w,h) => p.r(c,x,y,w,h);
  const brick = ['#c5a575','#d9bd88','#bda078','#d1ae7a','#b8a17f'];
  r('#827059',4,51,128,40);
  for(let y=52,row=0;y<90;y+=3,row++) for(let x=4-(row%2)*3;x<132;x+=7) {
    const l=Math.max(4,x), w=Math.min(132,x+6)-l;
    if(w>0) r(brick[(row*7+Math.floor((x+3)/7)*3+15)%5],l,y,w,2);
  }
  r('#796248',4,87,128,4); r('#ab8962',4,87,128,1);
  // Chimney and fine antenna, attached at the right end of the ridge.
  r('#675344',114,12,9,30); r('#c3a779',115,13,7,27);
  for(let y=16;y<39;y+=4) {r('#887154',115,y,7,1);r('#ead0a0',116,y-1,3,1);}
  r('#55504a',113,11,11,2); r('#b4b1a2',113,11,11,1);
  r('#595452',118,1,1,11); r('#595452',113,3,11,1);r('#595452',115,6,7,1);
  // Long terracotta tile roof. Shaded right hip, sunlit left tile shoulders.
  for(let y=20;y<51;y++) {
    const inset=Math.round((50-y)*0.42), left=1+inset, right=135-inset;
    r(y%4===2?'#854f43':'#a7634d',left,y,right-left,1);
    if(y%4===3) for(let x=left+((Math.floor(y/4)%2)*2);x<right-2;x+=5) {
      r('#c88c62',x,y,2,1); r('#b57755',x+2,y,2,1);
    }
    if(y%4===0) for(let x=left+1;x<right-1;x+=5)r('#925641',x,y,1,2);
    r('#d6a273',left,y,1,1);r('#72483f',right-2,y,2,1);
  }
  r('#65453c',14,18,108,1);r('#d29a6b',14,19,108,1);
  r('#e8e6ce',1,50,134,2);r('#b7c4bc',1,52,134,1);r('#666a63',3,53,130,2);
  r('#9e8c6b',4,55,128,3);
  const window=(x,w) => {
    r('#725e49',x-1,59,w+2,23);r('#eeead3',x,59,w,21);
    r('#46616b',x+1,60,w-2,19);r('#8da6a0',x+2,61,w-4,7);
    r('#b6c8b8',x+2,61,3,17);r('#d7d8bf',x+w-5,61,3,17);
    r('#f5ebd0',x+Math.floor(w/2),60,1,19);r('#d3d7c8',x+1,69,w-2,1);
    r('#698682',x+5,73,3,5);r('#a9b5a4',x+7,63,3,1);
    r('#e5d7ad',x-1,81,w+2,1);r('#8e7354',x-1,82,w+2,1);
  };
  window(13,23);window(46,25);
  // Recessed porch: screen door, railing and the vertical enclosed panel.
  r('#685d50',77,56,52,30);r('#999d8b',79,57,17,27);
  r('#eae7d3',79,58,11,27);r('#444b48',80,59,9,25);
  for(let y=60;y<84;y+=2)r('#70786a',81,y,7,1);
  r('#c4c6ae',88,60,1,23);r('#e4bc70',86,73,1,2);
  r('#cad1ba',93,61,12,23);r('#708c8a',94,62,10,11);r('#eeecd7',98,61,1,22);
  r('#f2e9cb',75,54,2,33);r('#b3bbad',77,54,1,33);
  r('#e5e5ce',107,54,2,34);r('#9ca79f',109,55,1,33);
  r('#303f44',110,56,19,17);
  for(let x=111;x<129;x+=2)r(x%4===1?'#526269':'#748077',x,56,1,17);
  r('#bdcbc5',110,74,19,13);
  for(let x=111;x<129;x+=3){r('#8eaaa6',x,74,1,13);r('#d8ddd0',x+1,74,1,13);}
  r('#e8e6d0',130,54,2,34);
  r('#eee8ca',91,75,15,1);for(let x=92;x<107;x+=4)r('#e6e5cd',x,76,1,10);
  r('#737970',77,86,30,2);r('#c2bda7',76,88,21,1);r('#82847b',75,89,23,1);r('#b3b5a7',73,90,27,2);
  r('#736953',91,57,4,1);r('#f7dfa0',92,58,2,2);
}
