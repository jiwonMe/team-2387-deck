// Conceptual motion, not a visualization of measured business metrics.
// IDs: 0 archive, 1 scanner, 2 binding press, 3 bookcase,
//      4 cash register, 5 sample printer, 6 document vault, 7 classroom.
export const scenes = [
  { machine: 7, drawer: -1, head: 0, press: 0, output: 8 }, // cover: curated classroom worksheet
  { machine: 0, drawer: 4, head: 0, press: 0, output: 0 },   // small school cohorts
  { machine: 2, drawer: -1, head: 0, press: -30, output: 10 }, // value: finished set
  { machine: 0, drawer: 3, head: 0, press: 0, output: 0 },   // semester: updated files
  { machine: 1, drawer: -1, head: -65, press: 0, output: 0 }, // curation engine
  { machine: 1, drawer: -1, head: 65, press: 0, output: 0 }, // source comparison
  { machine: 3, drawer: -1, head: 0, press: 0, output: 24 }, // bookstore
  { machine: 4, drawer: -1, head: 0, press: 0, output: 23 }, // four revenue streams
  { machine: 5, drawer: -1, head: 0, press: 0, output: 20 }, // sample-led GTM
  { machine: 2, drawer: -1, head: 0, press: -32, output: 0 }, // reusable production
  { machine: 6, drawer: -1, head: 0, press: 0, output: 24 }, // accumulated records
] as const;
