import {Request, Response} from 'express'
import {v4 as uuidv4} from 'uuid'
import Fixture from '../model/fixtures.model'
import FixtureLink from '../model/fixture_link.model'
import FixtureService from '../service/fixture.service'
const service = new FixtureService()
export const createFixture = async(req: Request, res: Response)=>{
    let {home_team, away_team, season, userId, matchtime} = req.body
    let id = uuidv4()
    let str = id.replace(/-/g, '')
    let link = `https://${req.headers.host}${req.baseUrl}/${str}`
    try{
        let fixture = await service.CreateFixture({home_team, away_team, season, userId, matchtime, link, str})
        res.status(201).json({message: "fixture created", data:{fixure:fixture, unque_link:link}})
    }catch(e){
        res.status(500).json({message: "Error Creating Fixture"})
    }

}
export const viewFixtureByUniqueLink = async(req: Request, res: Response)=>{
    let uniqueLink = req.params.uniqueLink
    try{
        const fixture = await service.ViewFixtureByUniqueLink({uniqueLink})
        if(!fixture) return res.status(404).json({message: "No Record Found"})
        res.status(201).json({message: "Record Retrieved", data: fixture})
    }catch(e){
        res.status(500).json({message: "Error Fetching Fixture"})
    }
}
export const getAllFixtures = async(req: Request, res: Response)=>{
    try{
        const fixtures = await service.GetAllFixtures()
        if(!fixtures) return res.status(404).json({message: "No Record Found"})
        res.status(201).json({message: "Records Fetched", data: fixtures})
    }catch(e){
        res.status(500).json({message: "Error Fetching Records"})
    }
}
export const getSingleFixture = async(req: Request, res: Response)=>{
    let fixtureId =  req.params.fixtureId
    try{
        const fixture = await service.GetSingleFixture({fixtureId})
        if(!fixture) res.status(404).json({message: "No Record Found"})
        res.status(201).json({message: "Record Fetched", data: fixture})
    }catch(e){
        res.status(500).json({message: "Error Fetching Record"})
    }
}

export const editFixture = async(req: Request, res: Response)=>{
    let fixtureId =  req.params.fixtureId
    try{
        const fixture = await service.EditFixture({...req.body, fixtureId} )
        if(fixture.matchedCount == 0) return res.status(404).json({message: "No Record Found"})
        return res.status(201).json({message: "Record Edited"})
    }catch(e){
        res.status(500).json({message: "Error Editing Record"})
    }
}
export const deleteFixture = async(req: Request, res: Response)=>{
    let fixtureId =  req.params.fixtureId
    try{
        const fixture = await service.DeleteFixture({fixtureId})
        if(fixture.deletedCount == 0) return res.status(404).json({message: "No Record Found"})
        return res.status(201).json({message: "Record Deleted"})
    }catch(e){
        res.status(500).json({message: "Error Deleting Record"})
    }
}
export const pendingFixture = async(req: Request, res: Response)=>{
    try{
        const fixture = await service.PendingFixture()
        if(!fixture) return res.status(404).json({message: "No Record Found"})
        return res.status(201).json({message: "Record Fetched", data: fixture})
    }catch(e){
    res.status(500).json({message: "Error Fetching Record"})
    }
}
export const completedFixture = async(req: Request, res: Response)=>{
    try{
        const fixture = await service.CompletedFixture()
        if(!fixture) return res.status(404).json({message: "No Record Found"})
        return res.status(201).json({message: "Record Fetched", data: fixture})
    }catch(e){
    res.status(500).json({message: "Error Fetching Record"})
    }

  
}
