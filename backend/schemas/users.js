const zod = require('zod')

module.exports.signUpSchema = zod.object({
  username: zod.string().toLowerCase().trim().min(3).max(16),
  password: zod.string().min(6).max(16),
  firstName: zod.string().trim().min(2).max(16),
  lastName: zod.string().trim().min(2).max(16)
})

module.exports.signInSchema = zod.object({
  username: zod.string().toLowerCase().trim().min(3).max(16),
  password: zod.string().min(6).max(16),
})

module.exports.updateSchema = zod.object({
  password: zod.string().min(6).max(16).optional(),
  firstName: zod.string().trim().min(2).max(16).optional(),
  lastName: zod.string().trim().min(2).max(16).optional()
})

module.exports.bulkSchema = zod.string()