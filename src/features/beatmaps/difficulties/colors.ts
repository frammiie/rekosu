import chroma from 'chroma-js';

const difficulty = {
  domain: [0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9],
  colors: [
    '#4290FB',
    '#4FC0FF',
    '#4FFFD5',
    '#7CFF4F',
    '#F6F05C',
    '#FF8068',
    '#FF4E6F',
    '#C645B8',
    '#6563DE',
    '#18158E',
    '#000000',
  ],
};

const difficultyScale = chroma
  .scale(difficulty.colors)
  .domain(difficulty.domain);

export function difficultyColor(value: number): string {
  return difficultyScale(value).hex();
}

const similarity = {
  domain: [0.65, 0.75, 0.85, 0.95],
  colors: ['#FF4E6F', '#FF8068', '#F6F05C', '#7CFF4F'],
};

const similarityScale = chroma
  .scale(similarity.colors)
  .domain(similarity.domain);

export function similarityColor(value: number): string {
  return similarityScale(value).hex();
}
