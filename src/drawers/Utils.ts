//@ts-ignore
import parseColor from "color-parse";
import {ISeriesStyle} from "../core/ISeriesDataOptions";

const FIELDS = ['fill', 'stroke'];

/**
 * Convert CSS style color onto array [r, g, b, a]
 * @param {ISeriesStyle} style
 */
export function parseStyle (style: ISeriesStyle): ISeriesStyle {
    const parsed: Record<string, any> = {...style};

    for(let key of FIELDS) {
        const orig = (<any>style)[key];
        // default
        parsed[key] = [0,0,0,1];

        if (orig == null) {
            continue;
        }

        // decode HEX and strings
        if (typeof orig === "string" || typeof orig === 'number') {
            const color = parseColor(orig);

            if (color && color.space && color.space.indexOf('rgb') !== 0) {
                throw new Error('Unknown style:' + orig);
            }

            if (color) {
                parsed[key] = [
                    color.values[0] / 0xff,
                    color.values[1] / 0xff,
                    color.values[2] / 0xff,
                    color.alpha];
            }
            // maybe array
        } else if(orig && orig.length === 4) {
            parsed[key] = orig;
        }
    }

    return parsed as ISeriesStyle;
}
