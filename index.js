const Blockchain = require("./blockchain");
const { send } = require("micro");

const blockchain = new Blockchain();

module.exports = async (request, response) => {
  try {
    const route = request.url;

    // Keep track of the peers that have contacted us
    blockchain.addPeer(request.headers.host);

    let output;

    switch (route) {
      case "/new_block":
        output = blockchain.newBlock();
        break;

      case "/last_block":
        output = blockchain.lastBlock();
        break;

      case "/get_peers":
        output = blockchain.getPeers();
        break;

      case "/submit_transaction":
        if (!request.body) {
          throw new Error("No transaction provided");
        }
        output = blockchain.addTransaction(request.body);
        break;

      default:
        output = blockchain.lastBlock();
    }

    send(response, 200, output);
  } catch (error) {
    console.error(error);
    send(response, 500, { error: "Internal Server Error" });
  }
};