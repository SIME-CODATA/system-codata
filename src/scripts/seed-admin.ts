import { connectMongo } from '@/core/database/mongo'
import { UserModel } from '@/modules/users/infra/schema'
import { hashPassword } from '@/core/security/password'

async function runSeed() {
  console.log('🔄 Conectando ao banco de dados...')
  
  try {
    await connectMongo()
    console.log('✅ Conectado ao MongoDB.')

    const adminEmail = 'admin@codata.local'
    const existingAdmin = await UserModel.findOne({ email: adminEmail })
    if (existingAdmin) {
      console.log('⚠️ O usuário Super Admin já existe. Nenhuma ação necessária.')
      process.exit(0)
    }
    console.log('⏳ Criando usuário Super Admin...')
    const hashedPassword = await hashPassword('Codata@2026')
    await UserModel.create({
      name: 'Administrador CODATA',
      email: adminEmail,
      passwordHash: hashedPassword,
      role: 'superAdmin',
      jobTitle: 'Gestão de TI',
      isActive: true,
    })
    console.log('🎉 Super Admin criado com sucesso!')
    console.log('--------------------------------------------------')
    console.log('📧 E-mail: admin@codata.local')
    console.log('🔑 Senha:  Codata@2026')
    console.log('--------------------------------------------------')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro fatal ao rodar o seed:', error)
    process.exit(1)
  }
}

runSeed()