const server = require('./api/server');

const port = process.env.PORT || 5432;


server.listen(port, () => { console.log(`\n ** SERVER LISTENING ON PORT: ${port} ** \n`) })