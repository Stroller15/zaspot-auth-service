import request from 'supertest';
import app from '../../src/app';

describe('POST /auth/register', () => {
    // happy path
    describe('Given all fields', () => {
        it('should return the 201 status code', async () => {
            // Arrange - prepare data required for the test
            const userData = {
                firstname: 'Lokesh',
                lastName: 'Jha',
                email: 'lokesh@mern.space',
                password: 'secret',
            };

            // Act - Trigger the main work
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert - Test expected output
            expect(response.statusCode).toBe(201);
        });
    });

    // sad path
    describe('Fields are missing', () => {});
});
