import Team from "../model/team.model"

class TeamService{
    async CreateTeam(teamData: any){
        const {name, short_name, stadium, userId} = teamData
        try{
            const team = await new Team({
                name,
                short_name,
                stadium,
                created_by: userId
            })
        const newTeam = await team.save()
        return newTeam
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