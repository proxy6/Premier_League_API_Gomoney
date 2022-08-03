require('dotenv').config();
import * as request from 'supertest';
import app from '../../src/server';
import database from '../../src/database'
import mongoose from 'mongoose'
import {v4 as uuidv4} from 'uuid'

describe('TEAMS API', ()=>{
    let token;
    let id;
    let response;

    beforeAll(async()=>{
    await database()
    })
    afterAll(async()=>{
    await mongoose.disconnect()
    })
    describe('Add Teams POST /team', ()=>{
        describe('Request succeeds if User is Not Authenticated', () => {
            const Args = {
        	name: 'Exampe Name',
        	short_name: 'example Short Name',
        	stadium: 'Example Stadium',
            created_by: '1'
            };
            beforeAll(async () => {
            response = await request(app)
            .post('/team')
            });
        
            it('returns 401 status code', () => {
        	expect(response.status).toBe(401);
            });
        
            it('returns error details', () => {
        	expect(response.body).toEqual( {message: "User is not Authenticated"});
            });
        })
        describe('Request fails if User is Authenticated But Not Authorized', () => {
            beforeAll(async ()=>{
                let user;
                let UserArgs = {
                name: 'Sentry Suit',
                email: `${uuidv4()}@gmail.com`,
                password: 'examplepassword',
                role: "user"
                };
                user = await request(app)
                .post('/identity/signup')
                .send(UserArgs)
                token = user.body.token
                id= user.body.newUser._id
            })
		    beforeAll(async () => {
                const Args = {
                    name: 'Exampe Name',
                    short_name: 'example Short Name',
                    stadium: 'Example Stadium',
                    created_by: id
                };
                response = await request(app)
                .post('/team')
                .send(Args)
                .set({'Authorization': `Bearer ${token}`});
    
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
                let user;
                let UserArgs = {
                name: 'Sentry Suit',
                email: `${uuidv4()}@gmail.com`,
                password: 'examplepassword',
                role: "admin"
                };
                user = await request(app)
                .post('/identity/signup')
                .send(UserArgs)
                token = user.body.token
                id= user._id
            })
            beforeAll(async ()=>{
                response = await request(app)
                .post('/team')
                .send()
                .set({'Authorization': `Bearer ${token}`})
                
            })
            it('returns 400 status is no request body', ()=>{
                expect(response.status).toBe(400)
                expect(response.body).toEqual({message: "Request Body is empty"})
            })
            
        })
        describe('Request succeeds if User is Authenticated Authorized with the required payload', () => {
            beforeAll(async ()=>{
                let user;
                let UserArgs = {
                name: 'Sentry Suit',
                email: `${uuidv4()}@gmail.com`,
                password: 'examplepassword',
                role: "admin"
                };
                user = await request(app)
                .post('/identity/signup')
                .send(UserArgs)
                token = user.body.token
                id = user.body.newUser._id
            })
            beforeAll(async () => {
                const Args = {
                    name: 'Exampe Name',
                    short_name: 'example Short Name',
                    stadium: 'Example Stadium',
                    userId: id
                };
                response = await request(app)
                .post('/team')
                .send(Args)
                .set('Authorization', `Bearer ${token}`);
		    });

		    it('returns 201 status code', () => {
			    expect(response.status).toBe(201);
		    });

            it('returns team details', () => {
			    expect(response.body).toHaveProperty('message');
			    expect(response.body).toHaveProperty('data');
			    expect(Object.keys(response.body.data).sort())
				    .toEqual(['name','short_name','stadium', 'created_by', '_id', '__v', 'createdAt', 'updatedAt'].sort());
		    });
	    });
    })
    describe('View Single Team GET /team/teamId', ()=>{
        let teamId
        beforeAll(async () => {
            const Args = {
                name: 'Exampe Name',
                short_name: 'example Short Name',
                stadium: 'Example Stadium',
                userId: id
            };
            let team = await request(app)
            .post("/team")
            .send(Args)
            .set({'Authorization': `Bearer ${token}`})
            teamId = team.body.data._id
        })
        describe('Request succeeds if User is Not Authenticated', () => {
            beforeAll(async () => {
            response = await request(app)
            .get(`/team${teamId}`)
            });
        
            it('returns 401 status code', () => {
        	expect(response.status).toBe(401);
            });
        
            it('returns error details', () => {
        	expect(response.body).toEqual( {message: "User is not Authenticated"});
            });
        })
        describe('Request succeeds if User is Authenticated and Authorized', () => {
            
            beforeAll(async ()=>{
                let user;
                let UserArgs = {
                name: 'Sentry Suit',
                email: `${uuidv4()}@gmail.com`,
                password: 'examplepassword',
                role: "admin"
                };
                user = await request(app)
                .post('/identity/signup')
                .send(UserArgs)
                token = user.body.token
                id = user.body.newUser._id
            })
            beforeAll(async () => {
                response = await request(app)
                .get(`/team/${teamId}`)
                .set('Authorization', `Bearer ${token}`);
		    });

		    it('returns 201 status code', () => {
			    expect(response.status).toBe(201);
		    });

            it('returns team details', () => {
			    expect(response.body).toHaveProperty('message');
			    expect(response.body).toHaveProperty('data');
			    expect(Object.keys(response.body.data).sort())
				    .toEqual(['name','short_name','stadium', 'created_by', '_id', '__v', 'createdAt', 'updatedAt'].sort());
		    });
	    });
    })
    describe('Edit Team PATCH /team/edit/teamId', ()=>{
        let teamId
        let user;
        beforeAll(async ()=>{
            let UserArgs = {
            name: 'Sentry Suit',
            email: `${uuidv4()}@gmail.com`,
            password: 'examplepassword',
            role: "admin"
            };
            user = await request(app)
            .post('/identity/signup')
            .send(UserArgs)
            token = user.body.token
            id= user.body.newUser._id
        })
        beforeAll(async ()=>{
            const newArgs = {
                name: 'Exampe Name',
                short_name: 'example Short Name',
                stadium: 'Example Stadium',
                userId: id
            };
            response = await request(app)
            .post('/team')
            .send(newArgs)
            .set({'Authorization': `Bearer ${token}`})
            teamId = response.body.data._id
        })
        describe('Request succeeds if User is Not Authenticated', () => {
            beforeAll(async () => {
                const Args = {
                    name: 'Renamed Name',
                    short_name: 'Renamed example Short Name',
                };
            response = await request(app)
            .patch(`/team/edit/${teamId}`)
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
            let userToken;
            beforeAll(async ()=>{
                let user;
                let UserArgs = {
                name: 'Sentry Suit',
                email: `${uuidv4()}@gmail.com`,
                password: 'examplepassword',
                role: "user"
                };
                user = await request(app)
                .post('/identity/signup')
                .send(UserArgs)
                userToken = user.body.token
                id= user.body.newUser._id
            })
		    beforeAll(async () => {
                const Args = {
                    name: 'Renamed Name',
                    short_name: 'Renamed example Short Name',
                };
                response = await request(app)
                .patch(`/team/edit/${teamId}`)
                .send(Args)
                .set({'Authorization': `Bearer ${userToken}`});
    
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
                .patch(`/team/edit/${teamId}`)
                .set({'Authorization': `Bearer ${token}`})
                
            })
            it('returns 400 status is no request body', ()=>{
                expect(response.status).toBe(400)
                expect(response.body).toHaveProperty('message', "Request Body is empty")
            })
            
        })
        describe('Request succeeds if User is Authenticated and Authorized with the required payload', () => {
            beforeAll(async () => {
                const Args = {
                    name: 'Renamed Exampe Name',
                    short_name: 'Renamed example Short Name',
                };
                response = await request(app)
                .patch(`/team/edit/${teamId}`)
                .send(Args)
                .set('Authorization', `Bearer ${token}`);
		    });

		    it('returns 201 status code', () => {
			    expect(response.status).toBe(201);
		    });

            it('returns team details', () => {
			    expect(response.body).toHaveProperty('message', "Record Edited");
		    });
	    });
   
    })
    describe('Delete Team DELETE /team/delete/teamId', ()=>{
        let teamId
        let user;
        beforeAll(async ()=>{
            let UserArgs = {
            name: 'Sentry Suit',
            email: `${uuidv4()}@gmail.com`,
            password: 'examplepassword',
            role: "admin"
            };
            user = await request(app)
            .post('/identity/signup')
            .send(UserArgs)
            token = user.body.token
            id= user.body.newUser._id
        })
        beforeAll(async ()=>{
            const newArgs = {
                name: 'Exampe Name',
                short_name: 'example Short Name',
                stadium: 'Example Stadium',
                userId: id
            };
            response = await request(app)
            .post('/team')
            .send(newArgs)
            .set({'Authorization': `Bearer ${token}`})
            teamId = response.body.data._id
        })
        describe('Request succeeds if User is Not Authenticated', () => {
            beforeAll(async () => {
            response = await request(app)
            .delete(`/team/delete/${teamId}`)
            });
        
            it('returns 401 status code', () => {
        	expect(response.status).toBe(401);
            });
        
            it('returns error details', () => {
        	expect(response.body).toEqual( {message: "User is not Authenticated"});
            });
        })
        describe('Request fails if User is Authenticated But Not Authorized', () => {
            let userToken;
            beforeAll(async ()=>{
                let user;
                let UserArgs = {
                name: 'Sentry Suit',
                email: `${uuidv4()}@gmail.com`,
                password: 'examplepassword',
                role: "user"
                };
                user = await request(app)
                .post('/identity/signup')
                .send(UserArgs)
                userToken = user.body.token
                id= user.body.newUser._id
            })
		    beforeAll(async () => {
                response = await request(app)
                .delete(`/team/delete/${teamId}`)
                .set({'Authorization': `Bearer ${userToken}`});
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
                .delete(`/team/delete/${teamId}`)
                .set({'Authorization': `Bearer ${token}`})
                
            })
            beforeAll(async ()=>{
                response = await request(app)
                .delete(`/team/delete/${teamId}`)
                .set({'Authorization': `Bearer ${token}`})
                
            })

            it('returns 404 status is no request body', ()=>{
                expect(response.status).toBe(404)   
                expect(response.body).toHaveProperty('message', "No Record found")
            })
            
        })
        describe('Request succeeds if User is Authenticated and Authorized with the required payload', () => {
            beforeAll(async ()=>{
                const newArgs = {
                    name: 'Exampe Name',
                    short_name: 'example Short Name',
                    stadium: 'Example Stadium',
                    userId: id
                };
                response = await request(app)
                .post('/team')
                .send(newArgs)
                .set({'Authorization': `Bearer ${token}`})
                teamId = response.body.data._id
            })
            beforeAll(async () => {
                response = await request(app)
                .delete(`/team/delete/${teamId}`)
                .set('Authorization', `Bearer ${token}`);
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
