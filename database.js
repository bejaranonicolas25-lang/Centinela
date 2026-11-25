// CENTINELA_CLOUD_DB - Base de datos completa - Creada por NICO
// Guarda: usuarios, niveles, canciones, voces, evoluciones, respaldo

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./CENTINELA_CLOUD_DB.db');

db.serialize(() => {
  // 1. USUARIOS - JEFE
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    nivel_actual INTEGER DEFAULT 1,
    puntos INTEGER DEFAULT 0,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    respaldo INTEGER DEFAULT 1
  )`);

  // 2. NIVELES - CADA CODIGO ES UN NIVEL PARA APRENDER
  db.run(`CREATE TABLE IF NOT EXISTS niveles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL,
    nombre TEXT NOT NULL,
    dificultad TEXT NOT NULL,
    descripcion TEXT,
    bonus INTEGER DEFAULT 100,
    desbloqueado INTEGER DEFAULT 0
  )`);

  // 3. PERSONAJES - VIGISET Y CENTINELA
  db.run(`CREATE TABLE IF NOT EXISTS personajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    evolucion TEXT NOT NULL,
    imagen TEXT,
    dialogo TEXT,
    voz TEXT,
    sacrificio TEXT
  )`);

  // 4. CANCIONES - CADA NIVEL CON SU VIDA
  db.run(`CREATE TABLE IF NOT EXISTS canciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    archivo TEXT NOT NULL,
    nivel_id INTEGER,
    momento TEXT,
    FOREIGN KEY (nivel_id) REFERENCES niveles(id)
  )`);

  // 5. SEGURIDAD - LLAVES, CIFRADOS, DATOS
  db.run(`CREATE TABLE IF NOT EXISTS seguridad (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    llave TEXT NOT NULL,
    cifrado TEXT NOT NULL,
    nivel_seguridad TEXT DEFAULT 'EXTREMISTA'
  )`);

  // 6. PROGRESO DEL JUGADOR
  db.run(`CREATE TABLE IF NOT EXISTS progreso (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    nivel_id INTEGER,
    completado INTEGER DEFAULT 0,
    puntos_ganados INTEGER DEFAULT 0,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (nivel_id) REFERENCES niveles(id)
  )`);

  // INSERTAMOS LOS NIVELES, JEFE
  const niveles = [
    ['JOHN', 'JOHN', 'FACIL', 'Aprende que es una llave', 100],
    ['JACKSON', 'JACKSON', 'MEDIO', 'Aprende a cifrar', 200],
    ['JDC', 'JDC', 'DIFICIL', 'Ingenieria en datos', 300],
    ['CCC', 'CCC', 'MUY DIFICIL', 'Frena al Intruso', 400],
    ['BPS', 'BPS', 'EXTREMISTA', 'Seguridad maxima', 500]
  ];

  const stmt = db.prepare("INSERT OR IGNORE INTO niveles (codigo, nombre, dificultad, descripcion, bonus) VALUES (?, ?, ?, ?, ?)");
  niveles.forEach(n => stmt.run(n));
  stmt.finalize();

  console.log("✅ CENTINELA_CLOUD_DB creada, JEFE. Lista para el juego.");
});

module.exports = db;
