// scripts/migrateReferredBy.ts
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';

async function migrateReferredBy() {
  await dbConnect();
  const users = await UserModel.find({ referredBy: { $type: 'string' } });
  console.log(`Found ${users.length} users to migrate…`);
  for (const user of users) {
    const referrer = await UserModel.findOne({ email: user.referredBy });
    if (referrer) {
      user.referredBy = referrer._id;
      await user.save();
    }
  }
  console.log(`Migrated ${users.length} users’ referredBy to ObjectId.`);
  process.exit(0);
}

migrateReferredBy().catch(err => {
  console.error(err);
  process.exit(1);
});
