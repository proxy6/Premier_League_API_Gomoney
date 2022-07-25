import Fixture from '../model/fixtures.model';
import Team from '../model/team.model';

class SearchService {

    static async TeamSearch(searchPhrase) {
        Team.find({$text: {$search: searchPhrase}},
        { score:{$meta: "textScore"}})
        .sort({
            score: {$meta: "textScore"}
        })

    }
    
    static async FixtureSearch(searchPhrase) {
        Fixture.find({$text: {$search: searchPhrase}},
        { score:{$meta: "textScore"}})
        .sort({
            score: {$meta: "textScore"}
        })

    }
}

export default SearchService