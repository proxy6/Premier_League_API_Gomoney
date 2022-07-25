import RedisDB from "../redis_db"
import Team, { ITeam } from "../model/team.model"

class TeamService{
    static async CreateTeam(teamData: Partial<ITeam>){
        try{
            return Team.create(teamData)
        }catch(e){
            throw new Error('Unable to Create Team')
        }
    }
    static async ViewAllTeams(){
        try{
        const cached= await RedisDB.GET('teams')
        if(cached){
        console.log(cached) 
        return JSON.parse(cached)
        }
        const team = await Team.find({})
        await RedisDB.SET('teams', JSON.stringify(team))
        return team
    }catch(e){
        console.log(e)
        throw new Error('Unable to View Teams')
    }
    }
    static async ViewSingleTeam(teamData: any){
        const {teamId} = teamData
        try{
            const team = await Team.findOne({_id: teamId})
            return team
        }catch(e){
            throw new Error('Unable to View Team')
        }
    }
    static async EditTeam(teamData:any){
        const {teamId, name, short_name, stadium} = teamData
        try{
            let team = await Team.updateOne({_id: teamId}, {name, short_name, stadium})
            return team
        }catch(e){
            throw new Error('Unable to Update Team')
        }
    }
    static async DeleteTeam(teamData: any){
        const {teamId} = teamData
        try{
            const team = await Team.deleteOne({_id: teamId})
            return team
        }catch(e){
            throw new Error('Unable to Delete Team')
        }
}
}

export default TeamService;