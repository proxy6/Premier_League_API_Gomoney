import { AnyAaaaRecord } from "dns"
import Fixture from "../model/fixtures.model"
import FixtureLink from "../model/fixture_link.model"

class FixtureService{
    async CreateFixture(data: any){
        const {home_team, away_team, season, userId, matchtime, link} = data
        try{
            let fixture = new Fixture({
                home_team,
                away_team,
                season,
                created_by: userId,
                matchtime
            })
            if(fixture){
            const fixture_link = new FixtureLink({
                fixture: fixture._id,
                link,
                created_by: userId
            })
            await fixture_link.save()
            }
            const newFixture = await fixture.save()
            return newFixture
        }catch(e){
            throw new Error('Unable to Create Fixture')
        }
    }
    async ViewFixtureByUniqueLink(data: any){
        const {uniqueLink} = data
        try{
            const link = await FixtureLink.findOne({link: uniqueLink})
            if(!link) return
            const fixture = await Fixture.findOne({_id: link.fixture})
            return fixture
        }catch(e){
        throw new Error ('Unable to View Fixture by Unique Link')
        }
    }
    async GetAllFixtures(){
        try{
            const fixtures = await Fixture.find()
            return fixtures
        }catch(e){
            throw new Error('Unable to Get All Fixtures')
        }
    }
    async GetSingleFixture(data: any){
        const {fixtureId} = data
        try{
            const fixture = await Fixture.findOne({_id: fixtureId})
            return fixture
        }catch(e){
            throw new Error('Unable to Fetch Data')
        }
    }
    async EditFixture(data: any){
        const {home_team, away_team, home_team_score, away_team_score, season, matchtime, created_by, fixtureId} = data
        try{
            const fixture = await Fixture.updateOne({_id: fixtureId}, {
                home_team,
                away_team,
                home_team_score,
                away_team_score, 
                season, 
                matchtime, 
                created_by
            })
            return fixture
        }catch(e){
            throw new Error('Unable to Update Fixture')
        }
    }
    async DeleteFixture(data:any){
        const {fixtureId} = data
        try{
            const fixture = await Fixture.deleteOne({_id: fixtureId})
            return fixture
        }catch(e){
            throw new Error('Unable to Delete Fixture')
        }
    }
    async PendingFixture(){
        try{
        const fixture = await Fixture.find({matchtime:{$gt: new Date()}})
        return fixture
        }catch(e){
            throw new Error('Unable to Fetch Fixtures')
        }
    }
    async CompletedFixture(){
        try{
            const fixture = await Fixture.find({matchtime:{$lt: new Date()}})
            return fixture
            }catch(e){
                throw new Error('Unable to Fetch Fixtures')
            }  
    }
}

export default FixtureService