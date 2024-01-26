const zod = require('zod')

module.exports.transferSchema = zod.object({
  to: zod.string(),
  amount: zod.number()
})