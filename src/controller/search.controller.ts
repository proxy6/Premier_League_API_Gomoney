import { Request, Response} from "express"
import SearchService from '../service/search.service'

export const TeamSearch = async (req: Request, res: Response)=>{
    //full text search of teams 
    try{
        const searchResult = SearchService.TeamSearch(req.body.searchPhrase)
        if(!searchResult) return res.status(404).json({message: "No Records Found"})
        res.status(201).json({data: searchResult})
    }catch(e){
        res.status(500).json({message: "An Error Occured", data: e})
    }
}

export const FixtureSearch = async (req: Request, res: Response)=>{
    //full text search of teams 
    try{
        const searchResult = SearchService.FixtureSearch(req.body.searchPhrase)
        if(!searchResult) return res.status(404).json({message: "No Records Found"})
        res.status(201).json({data: searchResult})
    }catch(e){
        res.status(500).json({message: "An Error Occured", data: e})
    }

}