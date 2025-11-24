# Database Migration Required

After making these changes, you need to run the following command to update your database:

```bash
npx prisma migrate dev --name add_follow_model
```

This will:
1. Create the `Follow` table in your database
2. Update the Prisma Client with the new model

If you encounter any issues, you can also try:

```bash
npx prisma generate
npx prisma db push
```

This adds the Follow model without creating a migration file.
