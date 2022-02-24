import { LocationInfo } from './location-info';
import { LocationType } from './location-type';

describe('LocationInfo', () => {
  it('should create an instance', () => {
    expect(new LocationInfo(0, 0, LocationType.SPINNING)).toBeTruthy();
  });
});
