// Import Chai for testing
import * as chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
const { expect } = chai;



chai.use(chaiHttp);
const url = 'http://localhost:4000';

describe('Deposit Mutation', () => {
  it('deposit money into users own account', (done) => {
    chai.request(url)
      .post('/graphql')
      .send({ query: 'mutation { deposit(userId: "1", amount: 50) { balance } }' })
      .end((err, res) => {
        expect(res.body.data.deposit.balance).to.equal(150);
        done();
      });
  });
});
