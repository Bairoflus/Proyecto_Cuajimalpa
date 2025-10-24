import { connectDB } from '../config/database';
import { getReportsCollection, getUsersCollection } from '../models/collections';

/**
 * Script para migrar reportes existentes que no tienen el campo paramedico correcto
 * Actualiza el campo paramedico basándose en el creadoPor
 */
async function migrateReports() {
  try {
    console.log('🔄 Iniciando migración de reportes...');

    await connectDB();
    const reportsCollection = getReportsCollection();
    const usersCollection = getUsersCollection();

    // Obtener todos los reportes sin paramedico o con paramedico vacío
    const reportsToMigrate = await reportsCollection
      .find({
        $or: [
          { paramedico: { $exists: false } },
          { paramedico: '' }
        ]
      } as any)
      .toArray();

    console.log(`📊 Encontrados ${reportsToMigrate.length} reportes para migrar`);

    if (reportsToMigrate.length === 0) {
      console.log('✅ No hay reportes que necesiten migración');
      process.exit(0);
    }

    let migrated = 0;
    let skipped = 0;

    for (const report of reportsToMigrate) {
      try {
        // Buscar el usuario que creó el reporte
        const user = await usersCollection.findOne({ username: report.creadoPor });

        if (user) {
          // Actualizar el reporte con el fullName del usuario
          await reportsCollection.updateOne(
            { _id: report._id },
            {
              $set: {
                paramedico: user.fullName,
                updatedAt: new Date()
              }
            }
          );
          console.log(`  ✅ Migrado: ${report.folio} → paramedico: ${user.fullName}`);
          migrated++;
        } else {
          console.log(`  ⚠️  Usuario no encontrado para reporte ${report.folio} (creadoPor: ${report.creadoPor})`);
          skipped++;
        }
      } catch (error) {
        console.error(`  ❌ Error migrando reporte ${report.folio}:`, error);
        skipped++;
      }
    }

    console.log('\n📈 Resumen de migración:');
    console.log(`  - Total reportes: ${reportsToMigrate.length}`);
    console.log(`  - Migrados exitosamente: ${migrated}`);
    console.log(`  - Omitidos: ${skipped}`);
    console.log('\n✅ Migración completada');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateReports();
