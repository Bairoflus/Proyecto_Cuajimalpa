import { MongoClient, Db } from 'mongodb';

let db: Db;
let client: MongoClient;

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cuajimalpa';

  client = new MongoClient(mongoUri);
  await client.connect();

  // Obtener el nombre de la base de datos de la URI o usar 'cuajimalpa' por defecto
  const dbName = new URL(mongoUri).pathname.slice(1) || 'cuajimalpa';

  // Verificar si la base de datos existe, si no, crearla
  const adminDb = client.db('admin');
  const databases = await adminDb.admin().listDatabases();
  const dbExists = databases.databases.some((database: any) => database.name === dbName);

  if (!dbExists) {
    console.log(`Base de datos '${dbName}' no existe, creándola...`);
    // Crear la base de datos accediéndola y creando una colección inicial
    const newDb = client.db(dbName);
    await newDb.createCollection('_init');
    // Eliminar la colección temporal ya que MongoDB la creó automáticamente
    await newDb.collection('_init').drop();
    console.log(`Base de datos '${dbName}' creada exitosamente`);
  } else {
    console.log(`Base de datos '${dbName}' ya existe`);
  }

  db = client.db(dbName);

  console.log('MongoDB conectado exitosamente');
  console.log(`Base de datos: ${dbName}`);
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error('Base de datos no inicializada. Llama a connectDB() primero');
  }
  return db;
};

export const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('Conexión a MongoDB cerrada');
  }
};

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

