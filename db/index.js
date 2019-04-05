// nope

const makeQuery = async (client, text, options) => {


    try {
        return await client.query(text, options);
    } catch (err) {
        console.log('Error making the query >>>', err);
    }
};


module.exports = makeQuery;