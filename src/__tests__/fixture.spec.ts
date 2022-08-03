require('dotenv').config();
import * as request from 'supertest';
import app from '../server';
import database from '../database'
import mongoose from 'mongoose'
import {v4 as uuidv4} from 'uuid'
import {MockUser} from '../__mock__/user'
import AdminMockUser from '../__mock__/user'

describe('FIXTURE API', ()=>{
    let token;
    let id;
    let response;
    let user;
    let adminUser

    beforeAll(async()=>{
    await database()
        user = await MockUser()
        adminUser = await AdminMockUser()
    })
    afterAll(async()=>{
    await mongoose.disconnect()
    })
    describe('Add Fixture POST /fixture', ()=>{
        let link = uuidv4().replace(/-/g, '')
        const Args = {
            home_team: "62d5bd48125c87a4328c9e7b",
            away_team: "62d5cfb323b14081e912d926",
            season: "2022/2023",
            userId: "62d53eb20578e03024d9d19c",
            matchtime: new Date(),
            link
        };
        describe('Request succeeds if User is Not Authenticated POST /Fixture', () => {
        
            beforeAll(async () => {
                response = await request(app)
                .post('/fixture')
                .send(Args)
            });
        
            it('returns error details', () => {
        	expect(response.body).toEqual( {message: "User is not Authenticated"});
            });
        })
        describe('Request fails if User is Authenticated But Not Authorized', () => {
		    beforeAll(async () => {
                response = await request(app)
                .post('/fixture')
                .send(Args)
                .set({'Authorization': `Bearer ${user.token}`});
    
		    });
		    it('returns 401 status code', () => {
			    expect(response.status).toBe(401);
		    });

		    it('returns error message', () => {
			    expect(response.body).toEqual({message: "User is not Authorized"});
		    });
	    });
        describe('Request Fails if User is Authenthenticated and Authorized But request payload is empty', ()=>{
            beforeAll(async ()=>{
                response = await request(app)
                .post('/fixture')
                .send()
                .set({'Authorization': `Bearer ${adminUser.token}`})
                
            })
            it('returns 400 status is no request body', ()=>{
                expect(response.status).toBe(400)
                expect(response.body).toEqual({message: "Request Body is empty"})
            })
            
        })
        describe('Request succeeds if User is Authenticated Authorized with the required payload', () => {
            beforeAll(async () => {
                response = await request(app)
                .post('/fixture')
                .send(Args)
                .set('Authorization', `Bearer ${adminUser.token}`);
		    });

		    it('returns 201 status code', () => {
			    expect(response.status).toBe(201);
		    });

            it('returns Fixture details', () => {
			    expect(response.body).toHaveProperty('message');
			    expect(response.body).toHaveProperty('data');
                expect(response.body.data).toHaveProperty('unique_link');
			    expect(Object.keys(response.body.data.fixture).sort())
				    .toEqual(['home_team','away_team','season', 'created_by', 'matchtime', '_id', '__v', 'createdAt', 'updatedAt'].sort());
		    });
	    });
    })
    describe('View Single Team GET /fixture/fixtureId', ()=>{
        let fixtureId;
        let link = uuidv4().replace(/-/g, '')
        const Args = {
            home_team: "62d5bd48125c87a4328c9e7b",
            away_team: "62d5cfb323b14081e912d926",
            season: "2022/2023",
            userId: "62d53eb20578e03024d9d19c",
            matchtime: new Date(),
            link
        };
        beforeAll(async ()=>{
            response = await request(app)
            .post('/fixture')
            .send(Args)
            .set({'Authorization': `Bearer ${adminUser.token}`})
            fixtureId = response.body.data.fixture._id
        })
        describe('Request succeeds if User is Not Authenticated', () => {
            beforeAll(async () => {
            response = await request(app)
            .get(`/fixture/${fixtureId}`)
            });                                                                                                         
            it('returns 401 status code', () => {
        	expect(response.status).toBe(401);
            });
        
            it('returns error details', () => {
        	expect(response.body).toEqual( {message: "User is not Authenticated"});
            });
        })
        describe('Request succeeds if User is Authenticated and Authorized', () => {
            beforeAll(async () => {
                response = await request(app)
                .get(`/fixture/${fixtureId}`)
                .set('Authorization', `Bearer ${user.token}`);
		    });

		    it('returns 201 status code', () => {
			    expect(response.status).toBe(201);
		    });

            it('returns Fixture details', () => {
                expect(response.body).toHaveProperty('message');
			    expect(response.body).toHaveProperty('data');
			    expect(Object.keys(response.body.data).sort())
				    .toEqual(['home_team','away_team','season', 'created_by', 'matchtime', '_id', '__v', 'createdAt', 'updatedAt'].sort());
		    });
	    });
    })
    describe('Edit Fixture PATCH /fixture/edit/fixtureId', ()=>{
        let fixtureId;
        let link = uuidv4().replace(/-/g, '')
        const Args = {
            home_team: "62d5bd48125c87a4328c9e7b",
            away_team: "62d5cfb323b14081e912d926",
            season: "2022/2023",
            userId: "62d53eb20578e03024d9d19c",
            matchtime: new Date(),
            link
        };
        beforeAll(async ()=>{
            response = await request(app)
            .post('/fixture')
            .send(Args)
            .set({'Authorization': `Bearer ${adminUser.token}`})
            fixtureId = response.body.data.fixture._id
        })
        describe('Request succeeds if User is Not Authenticated', () => {
            beforeAll(async () => {
                const Args = {
                    season: '2023/2024'
                };
            response = await request(app)
            .patch(`/fixture/edit/${fixtureId}`)
            .send(Args)
            });
        
            it('returns 401 status code', () => {
        	expect(response.status).toBe(401);
            });
        
            it('returns error details', () => {
        	expect(response.body).toEqual( {message: "User is not Authenticated"});
            });
        })
        describe('Request fails if User is Authenticated But Not Authorized', () => {
		    beforeAll(async () => {
                const Args = {
                    season: '2034/2035'
                };
                response = await request(app)
                .patch(`/fixture/edit/${fixtureId}`)
                .send(Args)
                .set({'Authorization': `Bearer ${user.token}`});
    
		    });
          

		it('returns 401 status code', () => {
			expect(response.status).toBe(401);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({message: "User is not Authorized"});
		});
	    });
        describe('Request Fails if User is Authenthenticated and Authorized But request payload is empty', ()=>{
            beforeAll(async ()=>{
                response = await request(app)
                .patch(`/fixture/edit/${fixtureId}`)
                .send()
                .set({'Authorization': `Bearer ${adminUser.token}`})
                
            })
            it('returns 400 status is no request body', ()=>{
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty('message', "Request Body is empty")
            })
            
        })
        describe('Request succeeds if User is Authenticated and Authorized with the required payload', () => {
            beforeAll(async () => {
                const Args = {
                    season: '2023/2024'
                };
                response = await request(app)
                .patch(`/fixture/edit/${fixtureId}`)
                .send(Args)
                .set('Authorization', `Bearer ${adminUser.token}`);
		    });

		    it('returns 201 status code', () => {
			    expect(response.status).toBe(201);
		    });

            it('returns team details', () => {
			    expect(response.body).toHaveProperty('message', "Record Edited");
		    });
	    });
    })
    describe('Delete Fixture DELETE /fixture/delete/fixtureId', ()=>{
        let fixtureId;
        let link = uuidv4().replace(/-/g, '')
        const Args = {
            home_team: "62d5bd48125c87a4328c9e7b",
            away_team: "62d5cfb323b14081e912d926",
            season: "2022/2023",
            userId: "62d53eb20578e03024d9d19c",
            matchtime: new Date(),
            link
        };
        beforeAll(async ()=>{
            response = await request(app)
            .post('/fixture')
            .send(Args)
            .set({'Authorization': `Bearer ${adminUser.token}`})
            fixtureId = response.body.data.fixture._id
        })
        describe('Request succeeds if User is Not Authenticated', () => {
            beforeAll(async () => {
            response = await request(app)
            .delete(`/fixture/delete/${fixtureId}`)
            });
        
            it('returns 401 status code', () => {
        	expect(response.status).toBe(401);
            });
        
            it('returns error details', () => {
        	expect(response.body).toEqual( {message: "User is not Authenticated"});
            });
        })
        describe('Request fails if User is Authenticated But Not Authorized', () => {
		    beforeAll(async () => {
                response = await request(app)
                .delete(`/fixture/delete/${fixtureId}`)
                .set({'Authorization': `Bearer ${user.token}`});
		    });   

		it('returns 401 status code', () => {
			expect(response.status).toBe(401);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({message: "User is not Authorized"});
		});
	    });
        describe('Request Fails if User is Authenthenticated and Authorized But Team Record is not Found', ()=>{
            beforeAll(async ()=>{
                response = await request(app)
                .delete(`/fixture/delete/${fixtureId}`)
                .set({'Authorization': `Bearer ${adminUser.token}`})
                
            })
            beforeAll(async ()=>{
                response = await request(app)
                .delete(`/fixture/delete/${fixtureId}`)
                .set({'Authorization': `Bearer ${adminUser.token}`})
                
            })

            it('returns 404 status is no request body', ()=>{
                expect(response.status).toBe(404)   
                expect(response.body).toHaveProperty('message', "No Record Found")
            })
            
        })
        describe('Request succeeds if User is Authenticated and Authorized with the Record Deleted Successfully', () => {
            let fixtureId;
            let link = uuidv4().replace(/-/g, '')
            const Args = {
                home_team: "62d5bd48125c87a4328c9e7b",
                away_team: "62d5cfb323b14081e912d926",
                season: "2022/2023",
                userId: "62d53eb20578e03024d9d19c",
                matchtime: new Date(),
                link
            };
            beforeAll(async ()=>{
                response = await request(app)
                .post('/fixture')
                .send(Args)
                .set({'Authorization': `Bearer ${adminUser.token}`})
                fixtureId = response.body.data.fixture._id
            })
            beforeAll(async () => {
                response = await request(app)
                .delete(`/fixture/delete/${fixtureId}`)
                .set('Authorization', `Bearer ${adminUser.token}`);
		    });

		    it('returns 201 status code', () => {
			    expect(response.status).toBe(201);
		    });

            it('returns team details', () => {
			    expect(response.body).toHaveProperty('message', "Record Deleted");
		    });
	    });
   
    })
})
