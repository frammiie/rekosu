import { action, query } from '@solidjs/router';
import {
  getBeatmap as gB,
  getSimilarBeatmapsets as gSB,
  getRecentBeatmapsets as gRBMS,
} from './queries';
import { trackRecentBeatmapset as tRBMS } from './actions';

export const getBeatmap = query(gB, 'getBeatmap');
export const getSimilarBeatmapsets = query(gSB, 'getSimilarBeatmapsets');
export const getRecentBeatmapsets = query(gRBMS, 'getRecentBeatmapsets');

export const trackRecentBeatmapset = action(tRBMS, 'trackRecentBeatmapset');
