import Team, { ITeam } from "../model/team.model"

class TeamService{
    async CreateTeam(teamData: Partial<ITeam>){
        try{
            return Team.create(teamData)
        }catch(e){
            throw new Error('Unable to Create Team')
        }
    }
    async ViewAllTeams(){
        try{
        const team = await Team.find({})
        return team
    }catch(e){
        throw new Error('Unable to View Teams')
    }
    }
    async ViewSingleTeam(teamData: any){
        const {teamId} = teamData
        try{
            const team = await Team.findOne({_id: teamId})
            return team
        }catch(e){
            throw new Error('Unable to View Team')
        }
    }
    async EditTeam(teamData:any){
        const {teamId, name, short_name, stadium} = teamData
        try{
            let team = await Team.updateOne({_id: teamId}, {name, short_name, stadium})
            return team
        }catch(e){
            throw new Error('Unable to Update Team')
        }
    }
    async DeleteTeam(teamData: any){
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