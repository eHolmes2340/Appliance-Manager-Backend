import request from 'supertest';
import http from 'http';


let server; 

beforeAll(async () => {
    const imported = await import('../src/index.js'); // Dynamically import index.js
    server = http.createServer(imported.default);
    await new Promise((resolve) => server.listen(3001, resolve));
  });;

  afterAll((done) => {
    server.close(done);
  });


  describe('Server integration tests', () => {
    test('should respond to invalid route with 404', async () => {
      const res = await request('http://localhost:3001/api').get('/api/applianceInformation');
      expect(res.statusCode).toBe(404);
    });

    test('should respond from /api/users or existing route with 200 (if exists)', async () => {
        const res = await request('http://localhost:3001').get('/api/users');
        // If route doesn't exist in your code, expect 404 instead
        expect([200, 404]).toContain(res.statusCode);
      });

   test('should respond from /api/users or existing route with 200 (if exists)', async () => {
        const res = await request('http://localhost:3001').get('/api/users');
        // If route doesn't exist in your code, expect 404 instead
        expect([200, 404]).toContain(res.statusCode);
     });
});