// User validation schemas
const userSchema = {
  name: {
    type: 'string',
    required: true,
    min: 2,
    max: 100
  },
  email: {
    type: 'string',
    required: true,
    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  password: {
    type: 'string',
    required: true,
    min: 8,
    max: 100
  },
  role: {
    type: 'string',
    required: false,
    enum: ['USER', 'ADMIN', 'EDITOR'],
    default: 'USER'
  },
  isActive: {
    type: 'boolean',
    required: false,
    default: true
  },
  metadata: {
    type: 'object',
    required: false,
    props: {
      preferences: {
        type: 'object',
        required: false,
        props: {
          theme: {
            type: 'string',
            required: false,
            enum: ['light', 'dark'],
            default: 'light'
          },
          notifications: {
            type: 'boolean',
            required: false,
            default: true
          }
        }
      }
    }
  },
  skills: {
    type: 'array',
    required: false,
    items: {
      type: 'string'
    }
  }
};

// User update validation schema (omit password)
const userUpdateSchema = {
  name: {
    type: 'string',
    required: false,
    min: 2,
    max: 100
  },
  email: {
    type: 'string',
    required: false,
    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  role: {
    type: 'string',
    required: false,
    enum: ['USER', 'ADMIN', 'EDITOR']
  },
  isActive: {
    type: 'boolean',
    required: false
  }
};

module.exports = {
  userSchema,
  userUpdateSchema
}; 