// Conceptual motion, not a visualization of measured business metrics.
// IDs: 0 archive, 1 scanner, 2 binding press, 3 bookcase,
//      4 cash register, 5 sample printer, 6 document vault, 7 classroom.
export const scenes = [
  { machine: 7, drawer: -1, head: 0, press: 0, output: 8 },    // s1 cover: curated classroom worksheet
  { machine: 0, drawer: 4, head: 0, press: 0, output: 0 },     // s2 problem: small school cohorts
  { machine: 0, drawer: 1, head: 0, press: 0, output: 0 },     // s3 market size: target local academies (SAM/SOM)
  { machine: 2, drawer: -1, head: 0, press: -30, output: 10 }, // s4 value: finished curated set
  { machine: 0, drawer: 3, head: 0, press: 0, output: 0 },     // s5 semester loop: updated school files
  { machine: 1, drawer: -1, head: -65, press: 0, output: 0 },  // s6 engine: structural source scan
  { machine: 1, drawer: -1, head: 65, press: 0, output: 0 },   // s7 proof: multi-source & operator trace
  { machine: 4, drawer: -1, head: 0, press: 0, output: 11 },   // s8 model review: academy as payer
  { machine: 3, drawer: -1, head: 0, press: 0, output: 24 },   // s9 bookstore: textbook purchase link
  { machine: 4, drawer: -1, head: 0, press: 0, output: 24 },   // s10 revenue: core 50 + book margin 5
  { machine: 5, drawer: -1, head: 0, press: 0, output: 20 },   // s11 GTM: sample sheet output
  { machine: 2, drawer: -1, head: 0, press: -32, output: 0 },  // s12 cost leverage: reusable engine
  { machine: 6, drawer: -1, head: 0, press: 0, output: 24 },   // s13 moat & roadmap: accumulated records
] as const;
