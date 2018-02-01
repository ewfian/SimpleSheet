import './utilities/polyfill';
import { SimpleSheet } from './simplesheet';

if (!window.SimpleSheet) {
    window.SimpleSheet = SimpleSheet;
}
