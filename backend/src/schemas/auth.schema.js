const z = require('zod');

const registerSchema = z.object({
  username: z.string({ 
    error: (issue) => issue.input === undefined ? "Username is required" : "Username must be a string" 
  }).min(3, "Username must be at least 3 characters"),
  email: z.string({ 
    error: (issue) => issue.input === undefined ? "Email is required" : "Email must be a string" 
  }).email("Invalid email format"),
  password: z.string({ 
    error: (issue) => issue.input === undefined ? "Password is required" : "Password must be a string" 
  }).min(8, "Password must be at least 8 characters")
});

const loginSchema = z.object({
  username: z.string({ 
    error: () => "Username must be a string" 
  }).optional(),
  email: z.string({ 
    error: () => "Email must be a string" 
  }).email("Invalid email format").optional(),
  password: z.string({ 
    error: (issue) => issue.input === undefined ? "Password is required" : "Password must be a string" 
  })
}).refine(data => data.username || data.email, {
  message: "Either username or email must be provided",
  path: ['username', 'email']
});

module.exports = {
  registerSchema,
  loginSchema
};
