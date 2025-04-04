import {COMMANDS} from '@/js/port';
import {isCssDarkScheme} from '@/js/util';

/** @namespace OffscreenAPI */
Object.assign(COMMANDS, {
  isDark: isCssDarkScheme,
  createObjectURL: URL.createObjectURL,
  revokeObjectURL: URL.revokeObjectURL,
});
