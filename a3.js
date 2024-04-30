import { Framebuffer } from './framebuffer.js';
import { Rasterizer } from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(v1, v2) and drawTriangle(v1, v2, v3) below.
////////////////////////////////////////////////////////////////////////////////

// take two vertices defining line and rasterize to framebuffer
Rasterizer.prototype.drawLine = function(v1, v2) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;

  if (x1 === x2 && y1 === y2) {
    this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
    return;
  }

  let x_diff = x2 - x1;
  let y_diff = y2 - y1;
  let overall_distance = Math.sqrt(x_diff * x_diff + y_diff * y_diff);
  if (x_diff == 0){
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      let distance_to_a = Math.abs(y - y1);
      let distance_to_b = Math.abs(y - y2);
      let proportion_a = distance_to_b / overall_distance;
      let proportion_b = distance_to_a / overall_distance;
      let r = ((proportion_a * r1) + (proportion_b * r2));
      let g = ((proportion_a * g1) + (proportion_b * g2));
      let b = ((proportion_a * b1) + (proportion_b * b2));
      this.setPixel(Math.floor(x1), Math.floor(y), [r, g, b]);
    }
  }
  else {
    let slope = y_diff / x_diff;
    let step = x_diff > 0 ? 1 : -1;
    for (let x = x1; x != x2; x += step) {
      let y = y1 + (x - x1) * slope;
      let distance_to_a = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
      let distance_to_b = Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));
      let proportion_a = distance_to_b / overall_distance;
      let proportion_b = distance_to_a / overall_distance;
      let r = ((proportion_a * r1) + (proportion_b * r2));
      let g = ((proportion_a * g1) + (proportion_b * g2));
      let b = ((proportion_a * b1) + (proportion_b * b2));
      this.setPixel(Math.floor(x), Math.floor(y), [r, g, b]);
    }
    this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);
  }

  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw line
  //this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
  //this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);
}

// take 3 vertices defining a solid triangle and rasterize to framebuffer
Rasterizer.prototype.drawTriangle = function(v1, v2, v3) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;

  let top = Math.max(y1, y2, y3);
  let bottom = Math.min(y1, y2, y3);
  let left = Math.min(x1, x2, x3);
  let right = Math.max(x1, x2, x3);

  for (let x = left; x <= right; x++){
    for (let y = bottom; y <= top; y++){
      let p = [x, y];
      if (pointIsInsideTriangle(v1, v2, v3, p)){
        let a_edge1 = y2 - y1;
        let b_edge1 = x1 - x2;
        let c_edge1 = x2*y1 - x1*y2;

        let total_area = a_edge1*x3 + b_edge1*y3 + c_edge1;
        let area3 = (a_edge1*x + b_edge1*y + c_edge1) / total_area;

        let a_edge2 = y3 - y2;
        let b_edge2 = x2 - x3;
        let c_edge2 = x3*y2 - x2*y3;
        let area1 = (a_edge2*x + b_edge2*y + c_edge2) / total_area;

        //line v3 to v1
        let a_edge3 = y1 - y3;
        let b_edge3 = x3 - x1;
        let c_edge3 = x1*y3 - x3*y1;
        let area2 = (a_edge3*x + b_edge3*y + c_edge3) / total_area;

        let r = area3*r3 + area2*r2 + area1*r1;
        let g = area3*g3 + area2*g2 + area1*g1;
        let b = area3*b3 + area2*b2 + area1*b1;

        this.setPixel(Math.floor(x), Math.floor(y), [r, g, b]);
      }
    }
  }


  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw triangle
  // this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
  // this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);
  // this.setPixel(Math.floor(x3), Math.floor(y3), [r3, g3, b3]);
}

function pointIsInsideTriangle(v1,v2,v3,p){

  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;
  const [x, y] = p;

  //line v1 to v2
  let a_edge1 = y2 - y1;
  let b_edge1 = x1 - x2;
  let c_edge1 = x2*y1 - x1*y2;
  let check1 = a_edge1*x + b_edge1*y + c_edge1;

  //line v2 to v3
  let a_edge2 = y3 - y2;
  let b_edge2 = x2 - x3;
  let c_edge2 = x3*y2 - x2*y3;
  let check2 = a_edge2*x + b_edge2*y + c_edge2;

  //line v3 to v1
  let a_edge3 = y1 - y3;
  let b_edge3 = x3 - x1;
  let c_edge3 = x1*y3 - x3*y1;
  let check3 = a_edge3*x + b_edge3*y + c_edge3;

  if (check1 > 0 && check2 > 0 && check3 > 0){
    return true;
  }
  else if (check1 >= 0 && check2 >= 0 && check3 >= 0){

    if (check1 === 0){
      if (y2 == y1 && y3 > y){
        return true;
      }
      else if (x3 > x){
        return true;
      }
    }
    else if (check2 === 0){
      if (y2 == y3 && y1 > y){
        return true;
      }
      else if (x1 > x){
        return true;
      }
    }
    else if (check3 === 0){
      if (y3 == y1 && y2 > y){
        return true;
      }
      else if (x2 > x){
        return true;
      }
    }
  }
  else{
    return false;
  }
}

function barycentricCoordinates(v1, v2, v3, p){
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;
  const [x, y] = p;

  let a_edge1 = y2 - y1;
  let b_edge1 = x1 - x2;
  let c_edge1 = x2*y1 - x1*y2;

  let total_area = a_edge1*x3 + b_edge1*y3 + c_edge1;
  let area3 = (a_edge1*x + b_edge1*y + c_edge1) / total_area;

  let a_edge2 = y3 - y2;
  let b_edge2 = x2 - x3;
  let c_edge2 = x3*y2 - x2*y3;
  let area1 = (a_edge2*x + b_edge2*y + c_edge2) / total_area;

  //line v3 to v1
  let a_edge3 = y1 - y3;
  let b_edge3 = x3 - x1;
  let c_edge3 = x1*y3 - x3*y1;
  let area2 = (a_edge3*x + b_edge3*y + c_edge3) / total_area;

  let r = area3*r3 + area2*r2 + area1*r1;
  let g = area3*g3 + area2*g2 + area1*g1;
  let b = area3*b3 + area2*b2 + area1*b1;

  this.setPixel(Math.floor(x), Math.floor(y), [r, g, b]);
}


////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////

//Google Drive Logo
const DEF_INPUT = [

  "v,25,15,0.0,0.7,0.3;",
  "v,36,15,0.0,0.7,0.3;",
  "v,30,20,0.0,0.7,0.3;",
  "v,12,40,0.0,0.0,1.0;",
  "v,49,41,0.8,0.7,0.2;",
  "v,19,40,0.0,0.0,1.0;",
  "v,41,40,0.8,0.7,0.2;",
  "v,18,46,0.0,0.0,0.9;",
  "v,41,46,0.9,0.0,0.0;",
  "v,36,15,0.8,0.7,0.2;",
  "v,30,20,0.8,0.7,0.2;",
  "v,49,41,1.0,0.0,0.0;",
  "v,41,40,1.0,0.0,0.0;",
  "t,0,3,2;",
  "t,10,4,9;",
  "t,2,3,5;",
  "t,10,6,4;",
  "t,3,7,5;",
  "t,5,7,12;",
  "t,7,8,12;",
  "t,0,2,1;",
  "t,12,8,11;"
].join("\n");

  // "v,10,10,1.0,0.0,0.0;",
  // "v,52,52,0.0,1.0,0.0;",
  // "v,52,10,0.0,0.0,1.0;",
  // "v,10,52,1.0,1.0,1.0;",
  // "t,0,1,2;",
  // "t,0,3,1;",
  // "v,10,10,1.0,1.0,1.0;",
  // "v,10,52,0.0,0.0,0.0;",
  // "v,52,52,1.0,1.0,1.0;",
  // "v,52,10,0.0,0.0,0.0;",
  // "l,4,5;",
  // "l,5,6;",
  // "l,6,7;",
  // "l,7,4;"


// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };
