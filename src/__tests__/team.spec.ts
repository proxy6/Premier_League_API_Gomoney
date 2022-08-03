require('dotenv').config();
import * as request from 'supertest';
import app from '../../src/server';
import database from '../../src/database'
import Team from '../../src/model/team.model';
import CreateMockUser from '../../src/__mock__/user'
import mongoose from 'mongoose'
import {v4 as uuidv4} from 'uuid'
import User from '../../src/model/user.model';
import UserController from '../../src/controller/user.controller';
import * as jwt from 'jsonwebtoken'
import { Secret, JwtPayload } from 'jsonwebtoken';

export const SECRET_KEY: Secret = 'JWT_Secret';

export interface CustomRequest extends Request {
 token: string | JwtPayload;
}
describe('TEAMS API', ()=>{

    describe('Add Teams POST /team', ()=>{
        let token;
	    let id;
        let response;

        beforeAll(async()=>{
        await database()
        })
        afterAll(async()=>{
        await mongoose.disconnect()
        })
        describe('Request succeeds if User is Not Authenticated POST /Team', () => {
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
                id= user._id
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
                console.log(user.body.newUser)
                id = user.body.newUser._id
            })
            beforeAll(async () => {
                console.log(id)
                console.log(token)
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
			    expect(response.status).toBe(401);
		    });

            it('returns team details', () => {
			    expect(response.body).toHaveProperty('message');
			    expect(response.body).toHaveProperty('data');
			    expect(Object.keys(response.body.data).sort())
				    .toEqual(['name','short_name','stadium', 'created_by', '_id', 'createdAt', 'updatedAt'].sort());
		    });
	    });
    })
    // describe('View All Teams GET /team', ()=>{
    // let token;
	// let id;
    // beforeAll(async()=>{
    //     await database()
    //     const user = await CreateMockUser()
	// 	token = user.token;
    // })

    // afterAll(async()=>{
    //     await mongoose.disconnect()
    // })
    // describe('Request fails if User is not Authenticated', () => {
	// 	let response;;
	// 	beforeAll(async () => {
    //         response = await request(app)
    //         .get('/team')
    //         .set('Authorization', `Bearer ${token}`);
	// 	});

	// 	it('returns 401 status code', () => {
	// 		expect(response.status).toBe(401);
	// 	});

	// 	it('returns error message', () => {
	// 		expect(response.body).toEqual({message: "User is not Authorized"});
	// 	});
	// });
    // describe('Request is Successful but Response Body is Empty', ()=>{
    //     let response
    //     beforeAll(async ()=>{
    //         response = await request(app)
    //         .get('/team')
    //         .set('Authorization', `Bearer ${token}`);
    //     })
    //     it('returns 404 status is no response body', ()=>{
    //         expect(response.status).toBe(404)
    //         expect(response.body).toEqual({message: "No Record found"})
    //     })
        
    // })
    // describe('Request succeeds if User is Authorized', () => {
	// 	let response;
	// 	const Args = {
	// 		name: 'Exampe Name',
	// 		short_name: 'example Short Name',
	// 		stadium: 'Example Stadium',
    //         created_by: id
	// 	};

	// 	beforeAll(async () => {
    //         response = await request(app)
    //         .post('/team')
    //         .send(Args)
    //         .set('Authorization', `Bearer ${token}`);
	// 	});

	// 	it('returns 201 status code', () => {
	// 		expect(response.status).toBe(201);
	// 	});

    //     it('returns team details', () => {
	// 		expect(response.body).toHaveProperty('message');
	// 		expect(response.body).toHaveProperty('data');
	// });

    // });
    // })

})
