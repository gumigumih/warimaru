const randomNames = [
  'あおい',
  'ひなた',
  'みなと',
  'つむぎ',
  'そら',
  'ゆい',
  'りん',
  'はる',
  'なぎ',
  'まこと',
  'しおん',
  'れん',
  'いろは',
  'すい',
  'こはる',
  'いつき',
];

export const getRandomName = (usedNames: string[] = []) => {
  const used = new Set(usedNames.map(name => name.trim()).filter(Boolean));
  const candidates = randomNames.filter(name => !used.has(name));
  const source = candidates.length > 0 ? candidates : randomNames;
  return source[Math.floor(Math.random() * source.length)];
};
