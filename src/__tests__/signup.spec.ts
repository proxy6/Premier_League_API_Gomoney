require('dotenv').config();
import * as request from 'supertest';
import app from '../server';
import database from '../database'
import User from '../model/user.model'
import mongoose from 'mongoose'
import {v4 as uuidv4} from 'uuid'

describe('USER Signup /identity/signup', ()=>{
    beforeAll(async()=>{
        await database()
    })

    afterAll(async()=>{
        await mongoose.disconnect()
    })

    describe('Request Fails if request payload is empty', ()=>{
        let response
        beforeAll(async ()=>{
            response = await request(app).post('/identity/signup')
        })
        it('returns 400 status is no request body', ()=>{
            expect(response.status).toBe(400)
            expect(response.body).toEqual({message: "Request Body is empty"})
        })
        
    })

    describe('Request fails if email is not unique', () => {
		let response;
		const exampleEmail = 'example@gmail.com';
		const Args = {
			name: 'Exampe Name',
			email: exampleEmail,
			password: 'thisisapassword'
		};

		beforeAll(async () => {
            await User.findOne({email: exampleEmail})
			response = await request(app).post('/identity/signup').send(Args);
		});

		it('returns 400 status code', () => {
			expect(response.statusCode).toBe(400);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({message: "Email Exist"});
		});
	});
    describe('Request succeeds if email is unique', () => {
		let response;
		const Args = {
			name: 'Sentry Suit',
			email: `${uuidv4()}@gmail.com`,
			password: 'examplepassword'
		};

		beforeAll(async () => {
			response = await request(app).post('/identity/signup').send(Args);
		});

		it('returns 201 status code', () => {
			expect(response.statusCode).toBe(201);
		});

		it('returns user signup details', () => {
			expect(response.body).toHaveProperty('token');
			expect(response.body).toHaveProperty('data');
			expect(Object.keys(response.body.data).sort())
				.toEqual(['name','email','role', '_id', 'password', 'createdAt', 'updatedAt', '_v'].sort());
		});
	});
})