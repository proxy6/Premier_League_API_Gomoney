import { Response } from 'express';
import User from './model/user.model';
import Team from './model/team.model'
import Fixture from './model/fixtures.model';
import {faker} from '@faker-js/faker';
import {v4 as uuidv4} from 'uuid'
import FixtureLink from './model/fixture_link.model';

const seedTeam = async () => {
  try {

        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const user = User.create({
        email: faker.internet.email(),
        name: firstName + lastName,
        password: 'password123',
        })
        const Teams = [];
        for (let i = 0; i < 50; i++) {
        const newTeam = {
        name: faker.company.companyName(),
        short_name: firstName + lastName,
        created_by: (await user)._id,
        stadium: faker.setLocale('de')
    
      };
      Teams.push(newTeam);
    }
    
    await Team.insertMany(Teams);
    console.log('Team Has been added successfully ');
  } catch (error) {
    console.log(error);
  }
};

const seedFixtures = async () => {
    try {
          const firstName = faker.name.firstName();
          const lastName = faker.name.lastName();
          const user = await User.create({
          email: faker.internet.email(),
          name: firstName + lastName,
          password: 'password123',
          })
          
          const FixtureLinks = [];
          for (let i = 0; i < 20; i++) {
            let id = uuidv4()
            let str = id.replace(/-/g, '')
            let link = str
          const newFixtures = {
            home_team: faker.setLocale('en'),
            away_team: faker.setLocale('de'),
            season: '2023/2024',
            userId: (await user)._id,
            matchtime: faker.date.future()
        };
        const fixture = await Fixture.create(newFixtures)
        const newFixtureLink ={
            fixture: fixture._id,
            link,
            created_by: user._id

        }
        FixtureLinks.push(newFixtureLink);
      }
      
      await FixtureLink.insertMany(FixtureLinks);
      console.log('Fixtures Has been added successfully ');
    } catch (error) {
      console.log(error);
    }
  };

export const BulkAddTeam = async (res: Response) => {
  try {
    await seedTeam();
    res.status(201).send('add seeded');
  } catch (error) {
    res.status(422).send({ error, message: 'Something went wrong!' });
  }
};
export const BulkAddFixures = async (res: Response) => {
    try {
      await seedFixtures();
      res.status(201).send('add seeded');
    } catch (error) {
      res.status(422).send({ error, message: 'Something went wrong!' });
    }
  };

  
