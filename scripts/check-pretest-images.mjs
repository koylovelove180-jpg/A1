import { readFileSync } from 'node:fs';

const text = readFileSync('src/data/lessonData.js', 'utf8');
const preTestBlock = text.match(/quizMode: 'pre'[\s\S]*?questions: \[([\s\S]*?)\]\s*\n\s*\},/);
const urls = [...preTestBlock[0].matchAll(/image: '([^']+)'/g)].map((m) => m[1]);

for (let i = 0; i < urls.length; i += 1) {
  const url = urls[i];
  if (url.startsWith('/')) {
    console.log(`Q${i + 1}: local ${url}`);
    continue;
  }
  try {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(`Q${i + 1}: ${res.status} ${url.slice(0, 80)}...`);
  } catch (error) {
    console.log(`Q${i + 1}: ERR ${error.message}`);
  }
}
