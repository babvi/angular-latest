export class ProfileProperty {
  constructor(
    public uuid : string,
    public property_type: string,
    public translations: String[],
    public is_active: Number
  ) {  }
}
