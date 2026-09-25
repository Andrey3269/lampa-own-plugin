const base = process.argv[2] || 'https://lampa-own-stack.vercel.app/api';

const urls = [
  `${base}/health`,
  `${base}/lite/withsearch`,
  `${base}/lite/events?title=Big%20Buck%20Bunny`,
  `${base}/lite/own?provider=own&title=Big%20Buck%20Bunny`,
  `${base}/externalids?title=Big%20Buck%20Bunny`
];

for (const url of urls) {
  const res = await fetch(url);
  const text = await res.text();
  console.log(`\n${res.status} ${url}\n${text}`);
  if (!res.ok) process.exitCode = 1;
}
