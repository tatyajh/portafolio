import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function loadData(relativePath) {
  const source = await readFile(path.join(root, relativePath), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const { PROJECTS } = await loadData('src/data/projects/projects.ts');
const { localizeProject } = await loadData('src/data/translations.ts');

assert.equal(new Set(PROJECTS.map(project => project.id)).size, PROJECTS.length, 'Duplicate project identifiers');
assert.deepEqual(PROJECTS.filter(project => project.role === 'design-development').map(project => project.id).sort(),
  ['mivaquita', 'portafolio', 'tirame-un-poemita', 'verse'], 'Preserve the confirmed interface design credits');
assert.equal(PROJECTS.find(project => project.id === 'gyg')?.role, 'webmaster');

for (const original of PROJECTS) {
  for (const locale of ['es', 'en']) {
    const project = localizeProject(original, locale);
    assert.equal(project.role, original.role, 'Translation must not change authorship');
    assert.deepEqual(project.links.map(link => link.url), original.links.map(link => link.url), 'Translation must not change destinations');
    assert.ok(project.preview?.alt.trim(), `Missing visual description: ${project.id}`);
    assert.ok(project.preview.image || project.preview.layout === 'typographic', `Missing screenshot: ${project.id}`);
    for (const image of [project.preview.image, project.preview.detailImage].filter(Boolean)) {
      assert.ok(image.startsWith('/media/'), `Only local, reviewed images: ${image}`);
      await access(path.join(root, 'public', image));
    }
    for (const link of project.links) assert.equal(new URL(link.url).protocol, 'https:');
    if (['venux', 'venux-web'].includes(project.id)) {
      assert.equal(project.role, 'figma-development');
      assert.ok(!JSON.stringify(project).includes('github.com'), 'Never expose Venux source code');
      assert.ok(project.links.some(link => link.url === 'https://venux-web.vercel.app'), 'Venux must link to its web version');
    }
    if (['venux', 'venux-web', 'hotel', 'posticks', 'gyg'].includes(project.id)) {
      assert.equal(project.behanceUrl, undefined, 'Do not publish unrequested Behance case links');
    }
    if (project.behanceUrl) {
      const url = new URL(project.behanceUrl);
      assert.equal(url.hostname, 'www.behance.net');
      assert.match(url.pathname, /^\/gallery\/\d+\//);
      assert.ok(!url.pathname.includes('155711895'), 'The Neuron reference is not a personal case study');
    }
  }
}
console.log(`Verified ${PROJECTS.length} projects in Spanish and English: credits, assets, destinations and Venux privacy.`);
