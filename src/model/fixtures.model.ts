import { Schema, model, Types } from 'mongoose';
export interface IFixture{
    home_team: Types.ObjectId;
    away_team: Types.ObjectId;
    home_team_score: Number;
    away_team_score: Number;
    season: String;
    created_by: Types.ObjectId;
    matchtime: Date;
}

const fixtureSchema = new Schema<IFixture>({
    home_team: {type: 'ObjectId', ref: "Team", required: true},
    away_team: {type: 'ObjectId', ref: "Team", required: true},
    home_team_score: {type: Number},
    away_team_score: {type: Number},
    season: {type: String, required: true},
    created_by: {type: 'ObjectId', ref: "User"},
    matchtime: {type:Date, required: true}
  }, {
    timestamps: true
  });
  
  const Fixture = model<IFixture>('Fixture', fixtureSchema);
  export default Fixture