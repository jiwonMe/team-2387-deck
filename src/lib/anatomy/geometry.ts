import * as k from '../../vendor/anatomy/iso-kit';

// Original machines made with Anatomy. World coordinates: x/y floor, z up.
// Every moving assembly stays within its guide's travel; no floating layers.
const W = 600, H = 530;
const base = { x: -126, y: -85, w: 252, d: 170, r: 7 };
export const projection = k.fitProjection(k.boxCorners(base, -18, 156), W, H, { pad: 40, azimuth: 42, elevation: 32 });
const P = projection;
const at = (x: number, y: number, z: number) => k.iso([x, y, z], P);
const line = (d: string, tone: k.Tone = 'lo') => k.lineSvg(d, { tone });
function slab(x: number, y: number, w: number, d: number, z: number, h: number, tone: k.Tone = 'mid', lit = false) {
  return k.solidSvg(k.slabOf({ x, y, w, d, r: Math.min(2, w / 4, d / 4) }, z, h, P, 5, Math.min(.7, h / 4)), { tone, lit });
}
function screws(x: number, y: number, w: number, d: number, z: number) {
  const pts = k.corners({ x, y, w, d, r: 0 }, 3);
  return pts.map(([a,b]) => line(k.planOutline({ x:a-1, y:b-1, w:2, d:2, r:.7 }, z, P), 'lo')).join('')
    + k.dotsSvg(pts.map(([a,b]) => at(a,b,z)), { size: .45 });
}
function paper(x: number, y: number, w: number, d: number, z: number, lit = false) {
  let s = slab(x, y, w, d, z, .7, 'hi', lit);
  for (let row = 0; row < 5; row++) s += k.lineSvg(k.lineOnTop([x+5,y+7+row*5], [x+w-5-(row%2)*8,y+7+row*5], z+.7, P), { tone: 'lo', free: true });
  return s;
}
function plinth() {
  let s = `<path class="iso-halo" d="${k.haloOf(base,-18,12,P)}"/>`;
  for (const [x,y] of k.corners(base, 19).sort((a,b)=>k.depthOf([...a,0],P)-k.depthOf([...b,0],P))) {
    s += slab(x-6,y-6,12,12,-18,5,'lo') + slab(x-4,y-4,8,8,-13,3,'lo');
  }
  s += k.solidSvg(k.slabOf(base,-10,10,P,8,1.2),{tone:'lo'});
  s += line(k.planOutline(k.insetPlan(base,5),0,P),'faint') + screws(-120,-79,240,158,0);
  s += slab(-104,67,208,7,0,.6,'lo');
  const ticks = k.topTicks(-100,100,5,5,67.5,.6,[2,4.5],P);
  s += line(ticks.minor,'lo') + line(ticks.major,'mid');
  return s;
}
const svg = (body: string, label: string) => k.figureSvg({width:W,height:H,label,body});

function archive() {
  let s = plinth();
  // Rear wall, partitions and shelf decks form an actual open-front cabinet.
  s += slab(-100,-58,200,5,0,140,'mid');
  s += slab(-104,-58,4,102,0,142) + slab(-2,-53,4,96,0,142) + slab(100,-58,4,102,0,142);
  for (let level=0;level<3;level++) {
    const z = 5+level*44;
    s += slab(-100,-53,200,96,z,4,'mid');
    for(let col=0;col<2;col++) {
      const x=-94+col*98, id=level*2+col;
      s += slab(x,-49,3,86,z+4,2,'lo') + slab(x+85,-49,3,86,z+4,2,'lo');
      let tray = slab(x+3,-47,82,84,z+6,2,'hi');
      tray += slab(x+3,-47,82,2,z+8,23,'mid');
      tray += slab(x+3,-45,2,80,z+8,23,'mid');
      for(let j=0;j<3;j++) tray += paper(x+9,-37,66,62,z+8+j*.8,id===2 && j===2);
      tray += slab(x+83,-45,2,80,z+8,23,'mid');
      tray += slab(x+3,35,82,4,z+6,28,'hi');
      tray += slab(x+32,39,4,5,z+17,4) + slab(x+55,39,4,5,z+17,4) + slab(x+32,43,27,3,z+17,4,'hi');
      tray += screws(x+3,35,82,4,z+34);
      s += `<g data-drawer="${id}" data-axis="y">${tray}</g>`;
    }
  }
  s += slab(-104,-58,208,102,142,5,'hi') + screws(-104,-58,208,102,147);
  s += line(k.planOutline({x:-98,y:-52,w:196,d:90,r:2},147,P),'faint');
  return svg(s, '학교별 문항을 보관하고 선택한 서랍을 여는 분류 서랍장');
}
function scanner() {
  let s = plinth();
  s += slab(-110,-65,220,120,0,9,'mid') + screws(-110,-65,220,120,9);
  s += slab(-100,-55,200,100,9,2,'hi');
  s += line(k.planOutline({x:-96,y:-51,w:192,d:92,r:2},11,P),'lo');
  for(let n=0;n<2;n++) {
    const x=-88+n*92;
    for(let j=0;j<3;j++) s += paper(x,-42,80,73,11+j*.8,n===1&&j===2);
    s += slab(x+25,-45,30,5,14,2,'mid');
  }
  // Two linear rails, four mounting blocks, end stops.
  for(const y of [-64,49]) {
    for(const x of [-112,102]) s += slab(x,y-2,10,10,9,7) + screws(x,y-2,10,10,16);
    s += slab(-102,y,204,5,12,4,'hi');
  }
  let head='';
  for(const y of [-66,46]) {
    head += slab(-11,y,22,11,16,5,'hi') + screws(-11,y,22,11,21);
    head += slab(-7,y+2,14,7,21,24,'mid');
  }
  head += slab(-11,-64,22,121,45,9,'hi',true);
  head += slab(-8,-57,16,107,54,3,'mid');
  for(let i=0;i<9;i++) head += line(k.planOutline({x:-4,y:-47+i*10,w:8,d:3,r:1},57,P),'lo');
  head += screws(-11,-64,22,121,54);
  s += `<g data-head data-axis="x">${head}</g>`;
  // Control console: recessed display, inset keys, captive square trim knobs.
  s += slab(-70,56,140,8,0,5,'mid');
  for(let i=0;i<8;i++) s += slab(-60+i*15,58,9,4,5,1.2,i===0?'hi':'lo');
  return svg(s,'双쪽 원전과 변형 문항 위를 이동하는 레일식 비교 스캐너'.replace('双쪽','두 쪽의'));
}
function press() {
  let s=plinth();
  s += slab(-93,-60,186,112,0,9,'mid') + screws(-93,-60,186,112,9);
  // Rear columns support a vertically guided binding crosshead.
  for(const x of [-86,72]) {
    s += slab(x,-51,14,18,9,7) + screws(x,-51,14,18,16);
    s += slab(x+3,-48,8,12,16,110,'hi');
  }
  s += slab(-86,-51,172,18,126,9,'hi') + screws(-86,-51,172,18,135);
  s += slab(-61,-32,122,76,9,3,'lo');
  for(let j=0;j<9;j++) s += paper(-55,-27,110,64,12+j*.85,j===8);
  let carriage='';
  for(const x of [-90,68]) carriage += slab(x,-53,22,23,53,14,'mid') + screws(x,-53,22,23,67);
  carriage += slab(-90,-30,180,12,55,9,'hi');
  carriage += slab(-61,-18,122,64,55,7,'hi',true);
  carriage += screws(-61,-18,122,64,62);
  carriage += line(k.planOutline({x:-55,y:-12,w:110,d:52,r:2},62,P),'lo');
  // Captive fasteners on the platen.
  for(const x of [-43,34]) carriage += slab(x,9,9,9,62,4,'mid') + screws(x,9,9,9,66);
  s += `<g data-platen data-axis="z">${carriage}</g>`;
  // Output guide and a bound set on a slide-out support.
  s += slab(-65,47,130,13,9,3,'mid');
  let output=slab(-61,47,122,13,12,2,'mid');
  output+=slab(-53,47,106,12,14,5,'hi') + slab(-53,47,5,12,19,1,'mid');
  s += `<g data-output data-axis="y">${output}</g>`;
  return svg(s,'선별한 문항을 학교별 한 묶음으로 압착하는 제본 프레스');
}
function bookcase() {
  let s=plinth();
  s+=slab(-98,-50,196,5,0,138) + slab(-101,-50,3,92,0,138) + slab(98,-50,3,92,0,138);
  for(let row=0;row<2;row++) {
    const z=8+row*65;
    s+=slab(-98,-45,196,87,z,4,'hi');
    for(let i=0;i<9;i++) {
      const x=-90+i*20, h=43+(i%3)*5;
      let book=slab(x,-33,16,65,z+4,h,'hi');
      book+=slab(x+1,-31,14,61,z+4+h,1,'lo');
      book+=slab(x,30,16,2,z+4,h,'mid');
      book+=slab(x+3,32,10,1,z+13,2,'lo')+slab(x+3,32,10,1,z+h-5,2,'lo');
      s+=i===3&&row===1?`<g data-output data-axis="y">${book}</g>`:book;
    }
  }
  s+=slab(-101,-50,202,92,138,5,'hi')+screws(-101,-50,202,92,143);
  return svg(s,'부교재 구매와 출처 확인을 나타내는 책장. 한 권이 앞으로 나옵니다.');
}
function register() {
  let s=plinth();
  s+=slab(-91,-55,182,105,0,8,'lo');
  // Cash drawer has a floor, side walls, dividers and a pull.
  let drawer=slab(-84,-48,168,91,8,3,'hi');
  drawer+=slab(-84,-48,168,3,11,16)+slab(-84,-45,3,85,11,16)+slab(81,-45,3,85,11,16);
  for(let i=0;i<4;i++) {
    const x=-78+i*40;
    drawer+=slab(x,-43,2,76,11,12,'lo');
    for(let j=0;j<3;j++) drawer+=slab(x+4,-25,28,46,11+j*.8,.7,'hi');
  }
  drawer+=slab(-84,40,168,5,8,24,'hi');
  drawer+=slab(-19,45,4,5,18,4)+slab(15,45,4,5,18,4)+slab(-19,50,38,4,18,4,'hi');
  s+=`<g data-output data-axis="y">${drawer}</g>`;
  s+=slab(-91,-55,182,105,32,12,'hi')+screws(-91,-55,182,105,44);
  s+=slab(-80,-47,160,30,44,52,'mid');
  s+=slab(-74,-42,148,22,96,3,'hi');
  s+=slab(-63,-37,126,12,99,.8,'lo');
  for(let i=0;i<8;i++) s+=slab(-55+i*14,-35,8,8,99.8,.6,'mid');
  for(let r=0;r<4;r++) for(let c=0;c<7;c++) {
    s+=slab(-66+c*20,-10+r*13,13,9,44,3,'lo');
    s+=slab(-65+c*20,-9+r*13,11,7,47,2,'hi',r===3&&c===6);
  }
  return svg(s,'구독과 학교 슬롯, 분석 크레딧, 교재 마진을 설명하는 금전등록기');
}
function printer() {
  let s=plinth();
  s+=slab(-94,-57,188,108,0,8,'lo');
  // Rear paper magazine and guides.
  s+=slab(-82,-50,164,44,8,79,'mid');
  for(let j=0;j<6;j++) s+=paper(-63,-43,126,33,87+j*.7);
  s+=slab(-82,-50,6,44,87,11)+slab(76,-50,6,44,87,11);
  s+=slab(-94,-6,188,57,8,57,'mid');
  s+=slab(-94,-6,188,57,65,6,'hi')+screws(-94,-6,188,57,71);
  // Output recess remains dark; the paper travels over a supported tray.
  s+=slab(-72,51,144,2,20,20,'lo');
  s+=slab(-78,51,156,29,14,3,'mid');
  s+=slab(-78,51,4,29,17,4)+slab(74,51,4,29,17,4);
  let sheet=paper(-65,29,130,46,25,true);
  s+=`<g data-output data-axis="y">${sheet}</g>`;
  s+=slab(-78,50,156,4,42,6,'hi');
  for(let i=0;i<8;i++) s+=line(k.planOutline({x:-74+i*12,y:5,w:7,d:23,r:1},71,P),'lo');
  s+=slab(35,9,38,22,71,1,'lo');
  for(let i=0;i<3;i++) s+=slab(39+i*10,13,6,6,72,1,'hi');
  return svg(s,'샘플 문항을 출력 트레이로 내보내는 프린터');
}
function vault() {
  let s=plinth();
  s+=slab(-79,-51,158,104,0,10,'lo');
  s+=slab(-79,-51,158,8,10,130,'mid')+slab(-79,-43,8,96,10,130)+slab(71,-43,8,96,10,130);
  for(let z=18;z<130;z+=36) {
    s+=slab(-71,-43,142,87,z,4,'hi');
    for(let i=0;i<3;i++) s+=paper(-60,-31,120,65,z+4+i*.8);
  }
  // The door slides on a top/bottom guide, avoiding rotational intersections.
  s+=slab(-100,53,200,6,8,5,'mid')+slab(-100,53,200,6,137,5,'mid');
  let door=slab(-73,53,146,8,13,124,'hi');
  for(const x of [-68,63]) for(const z of [20,64,120]) door+=slab(x,61,5,2,z,5,'mid');
  door+=slab(-22,61,44,3,52,44,'mid');
  door+=slab(-15,64,30,2,59,30,'lo');
  for(let i=0;i<4;i++) for(let j=0;j<4;j++) door+=slab(-12+i*7,66,4,1,62+j*7,4,'hi');
  door+=slab(39,61,5,9,53,5)+slab(39,61,5,9,85,5)+slab(39,70,5,4,53,37,'hi');
  s+=`<g data-output data-axis="x">${door}</g>`;
  s+=slab(-79,-51,158,104,140,6,'hi')+screws(-79,-51,158,104,146);
  return svg(s,'학교별 출처와 변형 기록을 축적하는 문서 금고');
}
function classroom() {
  let s=plinth();
  // Freestanding classroom board: feet, uprights, frame, recessed writing face.
  for(const x of [-100,86]) {
    s+=slab(x-6,-63,20,34,0,4,'lo');
    s+=slab(x,-56,7,8,4,144,'mid');
  }
  s+=slab(-104,-57,202,6,65,88,'mid');
  s+=slab(-98,-50,190,2,71,76,'lo');
  s+=slab(-104,-49,202,8,64,3,'hi');
  // Six problem cards mounted on the board. Marks live on each card's face.
  for(let row=0;row<2;row++) for(let col=0;col<3;col++) {
    const x=-87+col*59, z=81+row*32;
    let card=slab(x,-47,47,1, z,25,'hi');
    for(let j=0;j<3;j++) card+=slab(x+5,-45.9,30-j*5,.4,z+6+j*5,.6,'lo');
    // Selection checkbox is physically on the card, not a floating label.
    card+=slab(x+36,-45.9,5,.4,z+17,5,'mid');
    s+=col===1?`<g class="anatomy-accent">${card}</g>`:card;
  }
  // Four student desks: legs, aprons, desktops, seat and backrest.
  // Back row first, then front row, preserving the common camera's depth.
  for(const y of [-17,35]) for(const x of [-94,3]) {
    for(const [dx,dy] of [[0,0],[58,0],[0,31],[58,31]]) s+=slab(x+dx,y+dy,3,3,0,31,'mid');
    s+=slab(x,y,61,3,25,6,'mid')+slab(x,y+31,61,3,25,6,'mid');
    s+=slab(x-3,y-3,67,40,31,4,'hi');
    s+=screws(x-3,y-3,67,40,35);
    s+=paper(x+5,y+2,44,27,35,false);
    // Seat remains tucked under the desk, its back projects just beyond it.
    s+=slab(x+16,y+35,29,14,18,3,'mid');
    for(const dx of [16,42]) s+=slab(x+dx,y+44,3,3,0,37,'mid');
    s+=slab(x+16,y+45,29,3,30,10,'hi');
  }
  // A selected worksheet advances across the front desk, within its surface.
  let selected=paper(-86,39,44,27,36.5,true);
  selected+=slab(-82,41,4,22,37.2,.5,'hi',true);
  s+=`<g class="anatomy-accent" data-output data-axis="x">${selected}</g>`;
  return svg(s,'칠판의 여러 문제 중 선택한 문항이 학생 책상의 학습지로 이어지는 학교 교실');
}
export const machines = [archive(), scanner(), press(), bookcase(), register(), printer(), vault(), classroom()];
export const axes = {
  x:k.axisVector(P,[1,0,0]), y:k.axisVector(P,[0,1,0]), z:k.axisVector(P,[0,0,1]),
};
