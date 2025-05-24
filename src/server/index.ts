import { query } from '@solidjs/router';
import { getBeatmap as gB, getSimilarBeatmapsets as gSB } from './actions';

export const getBeatmap = query(gB, 'getBeatmap');
export const getSimilarBeatmapsets = query(gSB, 'getSimilarBeatmapsets');
