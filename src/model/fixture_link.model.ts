import { Schema, model, Types } from 'mongoose';
export interface IFixtureLink{
    link: String;
    isValid: Boolean;
    fixture: Types.ObjectId
}

const fixtureLinkSchema = new Schema<IFixtureLink>({
    link: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    fixture: {type: 'ObjectId', ref: "Fixture"}
  }, {
    timestamps: true
  });
  const FixtureLink = model<IFixtureLink>('FixtureLink', fixtureLinkSchema);
  export default FixtureLink