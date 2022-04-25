const app = require('./src/config/express');
const port = app.get('port');

const database = require('./src/config/mongodb');

try {
    database.mongoose.connect(database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, () => {
      console.log('Conectado ao MongoDB!');
  });
} catch (error) {
    console.log('Houve um problema ao conectar ao mongodb.')
    console.log(error)
};

const dbhandler = database.mongoose.connection
dbhandler.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port} !`);
});