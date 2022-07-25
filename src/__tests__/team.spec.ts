require('dotenv').config();
import * as request from 'supertest';
import app from '../server';
import database from '../database'
import Team from '../model/team.model';
import CreateMockUser from '../__mock__/user'
import mongoose from 'mongoose'
import {v4 as uuidv4} from 'uuid'
import User from 'src/model/user.model';

describe('Add Teams POST /team', ()=>{
    let token;
	let id;
    beforeAll(async()=>{
        await database()
        const user = await CreateMockUser()
		token = user.token;
		id = user._id;
    })

    afterAll(async()=>{
        await mongoose.disconnect()
    })

    describe('Request Fails if request payload is empty', ()=>{
        let response
        beforeAll(async ()=>{
            response = await request(app).post('/team')
        })
        it('returns 400 status is no request body', ()=>{
            expect(response.status).toBe(400)
            expect(response.body).toEqual({message: "Request Body is empty"})
        })
        
    })
    describe('Request fails if User is not Authorized', () => {
		let response;;
		const Args = {
			name: 'Exampe Name',
			short_name: 'example Short Name',
			stadium: 'Example Stadium',
            created_by: id
		};

		beforeAll(async () => {
            response = await request(app)
            .post('/team')
            .send(Args)
            .set('Authorization', `Bearer ${token}`);
		});

		it('returns 401 status code', () => {
			expect(response.status).toBe(401);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({message: "User is not Authorized"});
		});
	});
    describe('Request succeeds if User is Authorized', () => {
		let response;
		const Args = {
			name: 'Exampe Name',
			short_name: 'example Short Name',
			stadium: 'Example Stadium',
            created_by: id
		};

		beforeAll(async () => {
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

});
describe('View All Teams GET /team', ()=>{
    let token;
	let id;
    beforeAll(async()=>{
        await database()
        const user = await CreateMockUser()
		token = user.token;
		id = user._id;
    })

    afterAll(async()=>{
        await mongoose.disconnect()
    })
    describe('Request fails if User is not Authenticated', () => {
		let response;;
		beforeAll(async () => {
            response = await request(app)
            .get('/team')
            .set('Authorization', `Bearer ${token}`);
		});

		it('returns 401 status code', () => {
			expect(response.status).toBe(401);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({message: "User is not Authorized"});
		});
	});
    describe('Request is Successful but Response Body is Empty', ()=>{
        let response
        beforeAll(async ()=>{
            response = await request(app)
            .get('/team')
            .set('Authorization', `Bearer ${token}`);
        })
        it('returns 404 status is no response body', ()=>{
            expect(response.status).toBe(404)
            expect(response.body).toEqual({message: "No Record found"})
        })
        
    })
    describe('Request succeeds if User is Authorized', () => {
		let response;
		const Args = {
			name: 'Exampe Name',
			short_name: 'example Short Name',
			stadium: 'Example Stadium',
            created_by: id
		};

		beforeAll(async () => {
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
	});

    });
})

