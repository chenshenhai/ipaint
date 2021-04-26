import { loadImage } from './lib/loader';
import { delay, compose, throttle } from './lib/time';

export default {
  time: {
    delay,
    compose,
    throttle,
  },
  loader: {
    loadImage
  }
}