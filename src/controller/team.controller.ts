import {Request, Response} from 'express'
import TeamService from '../service/team.service'
const service = new TeamService()
export const addTeam = async(req: Request, res: Response)=>{
    let {name, short_name, stadium, userId} = req.body
    //write validation
    try{
      const team = await service.CreateTeam({name, short_name, stadium, userId})
      res.status(201).json({message: "Team Created", data: team})
    }catch(e){
        res.status(500).json({message: "Error Creating Teams"})
    }
}
export const viewAllTeams = async (req: Request, res: Response)=>{
    try{
        let team = await service.ViewAllTeams()
        if(!team) return res.status(404).json({message: "No Record found"})
        res.status(201).json({message: "Records Fetched", data:team})
    }catch(e){
        res.status(500).json({message: "Error Finding Teams"})
    }
}
export const viewSingleTeam = async (req: Request, res: Response)=>{
    let teamId = req.params.teamId
    try{
        const team = await service.ViewSingleTeam({teamId})    
        if(!team) return res.status(404).json({message: "No Record found"})
        res.status(201).json({message: "Record Fetched", data:team})
    }catch(e){
        res.status(500).json({message: "Error Finding Team"})
    }
}
export const editTeam = async (req: Request, res: Response)=>{
    let {name, short_name, stadium} = req.body
    let teamId = req.params.teamId
    try{
        let team = await service.EditTeam({name, short_name, stadium, teamId})
        if(team.matchedCount == 0) return res.status(404).json({message: "No Record found"})
        res.status(201).json({message: "Record Edited"})
    }catch(e){
        res.status(500).json({message: "Error Updating Team"})
    }
}
export const deleteTeam = async (req: Request, res: Response)=>{
    let teamId = req.params.teamId
    try{
        const team = await service.DeleteTeam({teamId})
        if(team.deletedCount == 0) return res.status(404).json({message: "No Record found"})
        res.status(201).json({message: "Record Deleted"})  
        }catch(e){
        res.status(500).json({message: "Error Deleting Team"})
    }
}