import './utilities/polyfill';
import 'proxy-polyfill/proxy.min';
import { SimpleSheet } from './simplesheet';

if (!window.SimpleSheet) {
    window.SimpleSheet = SimpleSheet;
}
