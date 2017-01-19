import A from 'A';
import * as B from 'B';
import { CC as C } from 'C';
import D from 'D';

/* A(0) */
/* const a = 1 !== 1 ? A(1) : 'normal'; */
/* const b = B.something(2, B.ok); */
/* const c = C(3); */

const used = D(4);

function run() {
  const e = 'ok';
  const A = 'fine';
  /* a(4); */
  /* b(5); */
  /* const d = c(6); */
  /* d(7); */
  /* return d; */
}

/* const e = run(used); */


run(used);

/* e(8); */
