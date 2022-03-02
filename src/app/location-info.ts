import { LocationType } from './location-type';

export class LocationInfo {
  constructor(
    public id: String,
    public x: number,
    public y: number,
    public type: LocationType
  ) {}
}
