const server = require('./api/server');

const port = process.env.PORT || 4500;


server.listen(port, () => { console.log(`\n ** SERVER LISTENING ON PORT: ${port} ** \n`) })