import { hash } from '@node-rs/argon2';
async function main() {
  const h = await hash('password123', { memoryCost: 65536, timeCost: 3, parallelism: 4 });
  console.log(h);
}
main();
