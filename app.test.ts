import { sum } from './src/utils/util';

describe('App', () => {
    it('should work fine', () => {
        expect(sum(1, 2)).toBe(3);
    });
    it('should work fine again', () => {
        expect(sum(5, 2)).toBe(7);
    });
    it('should work fine again', () => {
        expect(sum(5, 5)).toBe(10);
    });
});
