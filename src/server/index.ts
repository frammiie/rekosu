import { action, query } from '@solidjs/router';
import {
  getBeatmap as gB,
  getSimilarBeatmapsets as gSB,
  getRecentBeatmapsets as gRBMS,
  getUser as gU,
  getUserScores as gUS,
} from './queries';
import { trackRecentBeatmapset as tRBMS } from './actions';

export const getBeatmap = query(gB, 'getBeatmap');
export const getSimilarBeatmapsets = query(gSB, 'getSimilarBeatmapsets');
export const getRecentBeatmapsets = query(gRBMS, 'getRecentBeatmapsets');
export const getUser = query(gU, 'getUser');
export const getUserScores = query(gUS, 'getUserScores');

export const trackRecentBeatmapset = action(tRBMS, 'trackRecentBeatmapset');
