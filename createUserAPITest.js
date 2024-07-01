const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

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
