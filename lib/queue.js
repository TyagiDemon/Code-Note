import jackrabbit from "jackrabbit";

const rabbit = jackrabbit(process.env.QUEUE_URL);
const exchange = rabbit.default();

// exchange.publish({ data }, { key: key });

module.exports = exchange;
