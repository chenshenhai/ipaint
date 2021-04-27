import { loadImage } from './lib/loader';
import { delay, compose, throttle } from './lib/time';
import { downloadImageFromCanvas } from './lib/file';

export default {
  time: {
    delay,
    compose,
    throttle,
  },
  loader: {
    loadImage
  },
  file: {
    downloadImageFromCanvas,
  }
}