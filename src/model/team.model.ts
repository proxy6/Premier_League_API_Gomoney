import { Schema, model, Types } from 'mongoose';
export interface ITeam{
    name: String;
    short_name: String;
    stadium: String;
    created_by: Types.ObjectId
}

const teamSchema = new Schema<ITeam>({
    name: { type: String, required: true },
    short_name: { type: String, required: true },
    stadium: {type: String, required: true},
    created_by: {type: 'ObjectId', ref: "User"}
  }, {
    timestamps: true
  });
  teamSchema.index({name: "text", short_name: "text"})
  const Team = model<ITeam>('Team', teamSchema);
  export default Team