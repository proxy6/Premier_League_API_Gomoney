require('dotenv').config();
import * as request from 'supertest';
import app from "../server";
import database from '../database'
import User from '../model/user.model'
import mongoose from 'mongoose'
import {v4 as uuidv4} from 'uuid'
import LoginUser from '../controller/user.controller';

describe('USER Login /identity/login', ()=>{
    beforeAll(async()=>{
        await database()
    })

    afterAll(async()=>{
        await mongoose.disconnect()
    })
    describe('Request Fails if request payload is empty', ()=>{
        let response
        beforeAll(async ()=>{
            response = await request(app).post('/identity/login')
        })
        it('returns 400 status is no request body', ()=>{
            expect(response.status).toBe(400)
            expect(response.body).toEqual({message: "Request Body is empty"})
        })
        
    })
    describe('Request fails if User is Not Found', () => {
		let response;
		const exampleEmail = 'example@gmail.com';
		const Args = {
			name: exampleEmail,
			password: 'thisisapassword'
		};

		beforeAll(async () => {
            await User.findOne({email: exampleEmail})
			response = await request(app).post('/identity/login').send(Args);
		});

		it('returns 404 status code', () => {
			expect(response.status).toBe(404);
		});

		it('returns error message', () => {
			expect(response.body).toEqual({message: "User Does not Exist"});
		});
	});
    describe('Request fails if User Exist but Password is Not Correct', () => {
		let response;
		const exampleEmail = 'example@gmail.com';
		const Args = {
			email: exampleEmail,
			password: 'thisisapass',
            name: "Example Name"
		};

		beforeAll(async () => {
            await LoginUser.findOrCreate(exampleEmail, Args)
			response = await request(app)
            .post('/identity/login')
            .send({
                email: exampleEmail,
				password: 'nothepassword'
            })
		});
		it('returns 401 status code', () => {
			expect(response.status).toBe(401);
		});
		it('returns error message', () => {
			expect(response.body).toEqual({message: "Email or Password Incorrect"});
		});
	});
    describe('Request succeds if User Password is Correct', () => {
		let response;
		const exampleEmail = 'thisisanemail@gmail.com';
		const Args = {
			email: exampleEmail,
			password: 'thisisapassword',
            name: "Example Name"
		};

		beforeAll(async () => {
            await LoginUser.findOrCreate(exampleEmail, Args)
			response = await request(app).post('/identity/login').send({
                name: exampleEmail,
			    password: 'thisisapassword'
            });
		});

		it('returns 201 status code', () => {
			expect(response.statusCode).toBe(201);
		});

		it('returns user login details', () => {
			expect(response.body).toHaveProperty('token');
			expect(response.body).toHaveProperty('data');
			expect(Object.keys(response.body.data).sort())
				.toEqual(['name','email','role', '_id', 'createdAt', 'updatedAt'].sort());
		});
	});

});