const validateRequest     = require('joi');
const BadRequestException = require('../exception/bad');

const validate = (data, req, next, schema) => {
  console.log('Validating Request...')
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  }

  const { error, value } = schema.validate(data, options)
  if (error) {
    next(new BadRequestException(`Validation error: ${error.details.map((x) => x.message).join(', ')}`));
  }

  console.log('Request Validated...');

  // Allows multiple validations combined
  if (req.data === undefined) {
    req.data = value  
  } else {
    req.data = { ...req.data, ...value }
  }

  next(); 
}

const newCrendentials = (req, res, next) => {
  const schema = validateRequest.object({
    name:           validateRequest.string().required(),
    email:          validateRequest.string().email().required(),
    password:       validateRequest.string().required(),
    referral_token: validateRequest.string().optional(),
    artist_token:   validateRequest.string().optional()
  })

  return validate(req.body, req, next, schema);
}

const credentials = (req, res, next) => {
  const schema = validateRequest.object({
    email: validateRequest.string().required(),
    password: validateRequest.string().required(),
  })

  return validate(req.body, req, next, schema);
}

const adminCredentials = (req, res, next) => {
  const schema = validateRequest.object({
    token: validateRequest.string().required(),
    id: validateRequest.string().required(),
  })

  return validate(req.body, req, next, schema);
}

const verify = (req, res, next) => {
  console.log('Validating verify request...')
  const schema = validateRequest.object({
    token: validateRequest.string().required(),
  })

  return validate(req.body, req, next, schema);
}

const token = (req, res, next) => {
  const schema = validateRequest.object({
    token: validateRequest.string().valid('artist, contractor').required(),
  })

  return validate(req.headers, req, next, schema);
}

const forgotPassword = (req, res, next) => {
  const schema = validateRequest.object({
    email: validateRequest.string().required(),
  })

  return validate(req.body, req, next, schema);
}

const resetPassword = (req, res, next) => {
  const schema = validateRequest.object({
    token: validateRequest.string().required(),
    password: validateRequest.string().required(),
    passwordConfirm: validateRequest.string().required(),
  })

  return validate(req.body, req, next, schema);
}

const role = (req, res, next) => {
  const schema = validateRequest.object({
    role: validateRequest.string().required()
  })

  return validate(req.body, req, next, schema);
}

const social = (req, res, next) => {
  const schema = validateRequest.object({
    token: validateRequest.string().required()
  })

  return validate(req.body, req, next, schema);
}

const social2 = (req, res, next) => {
  const schema = validateRequest.object({
    token: validateRequest.string().required(),
    provider: validateRequest.string().required()
  });

  return validate(req.body, req, next, schema);
}

const id = (req, res, next) => {
  const schema = validateRequest.object({
    id: validateRequest.string().required()    
  });

  return validate(req.params, req, next, schema);
}

const status = (req, res, next) => {
  const schema = validateRequest.object({
    status: validateRequest.string().required()
  });
  return validate(req.params, req, next, schema);
}

// Raw query and body parsing to data
const query = (req, res, next) => {
  req.data = { ...req.data, ...req.query }
  next();
}

const body = (req, res, next) => {
  req.data = { ...req.data, ...req.body }
  next();
}

const file = (req, res, next) => {
  const schema = validateRequest.object({
    file: validateRequest.object().required()
  });

  return validate(req.body, req, next, schema);
}

const uploadedFiles = (req, res, next) => {
  req.data = req.files
  next();
}

const document = (req, res, next) => {
  const schema = validateRequest.object({
    document: validateRequest.object().required()
  });

  return validate(req.body, req, next, schema);
}

const documentId = (req, res, next) => {
  const schema = validateRequest.object({
    documentId: validateRequest.string().required()    
  });

  return validate(req.params, req, next, schema);
}

const slug = (req, res, next) => {
  const schema = validateRequest.object({
    slug: validateRequest.string().required()    
  })

  return validate(req.params, req, next, schema)
}

const profile = (req, res, next) => {
  const schema = validateRequest.object({
    profile: validateRequest.object().required()
  })

  return validate(req.body, req, next, schema)
}

const bankAccount = (req, res, next) => {
  const schema = validateRequest.object({
    bankAccount: validateRequest.object().required()
  });

  return validate(req.body, req, next, schema);
}

const payment = (req, res, next) => {
  const schema = validateRequest.object({
    method:     validateRequest.object().required(),
    instalment: validateRequest.string().optional(),
  });

  return validate(req.body, req, next, schema);
}

const product = (req, res, next) => {
  const schema = validateRequest.object({
    product: validateRequest.object().required()
  })

  return validate(req.body, req, next, schema)
}

const schedule = (req, res, next) => {
  const schema = validateRequest.object({
    id:   validateRequest.string().required(),
    year: validateRequest.number().optional()
  })

  return validate(req.params, req, next, schema)
}

const timeslot = (req, res, next) => {
  const schema = validateRequest.object({
    timeslot: validateRequest.object().required(),    
  })

  return validate(req.body, req, next, schema)
}

const search = (req, res, next) => {
  const schema = validateRequest.object({
    term:     validateRequest.string().optional().allow(''),
    location: validateRequest.string().optional().allow(''),
    price:    validateRequest.number().optional().min(1).max(5),
    sort:     validateRequest.string().optional().allow(''),
    page:     validateRequest.number().optional(),
  })

  return validate(req.query, req, next, schema)
}

const proposal = (req, res, next) => {
  const schema = validateRequest.object({
    proposal: validateRequest.object().required(),
    artist:   validateRequest.string().required(),
  });

  return validate(req.body, req, next, schema)
}

const counterOffer = (req, res, next) => {
  const schema = validateRequest.object({
    counterOffer: validateRequest.object().required(),
  })

  return validate(req.body, req, next, schema)
}

const category = (req, res, next) => {
  const schema = validateRequest.object({
    category: validateRequest.string().required()
  })

  return validate(req.params, req, next, schema)
}

const filters = (req, res, next) => {
  const schema = validateRequest.object({
    filters: validateRequest.object().optional()
  })

  return validate(req.query, req, next, schema)
}

const feedback = (req, res, next) => {
  const schema = validateRequest.object({
    presentation: validateRequest.string().required(),
    artist:       validateRequest.string().required(),
    rating:       validateRequest.number().min(1).max(5).required(),
    notes:        validateRequest.string().optional().allow('')
  });

  return validate(req.body, req, next, schema)
}

const billing = (req, res, next) => {
  const schema = validateRequest.object({
    artist:       validateRequest.string().required(),    
    contractor:   validateRequest.string().required(),
    presentation: validateRequest.string().required(),
  });

  return validate(req.body, req, next, schema)
}

const instalments = (req, res, next) => {
  const schema = validateRequest.object({
    instalments: validateRequest.array().required(),
  });

  return validate(req.body, req, next, schema);
}

module.exports = { 
  id,
  query,
  body,
  slug,
  status,
  token,
  social,
  social2,
  newCrendentials, 
  credentials, 
  adminCredentials,
  verify, 
  forgotPassword, 
  resetPassword, 
  profile,
  bankAccount,
  payment,
  role, 
  product,
  search,
  schedule,
  timeslot,
  proposal,
  counterOffer,
  category,
  file,
  uploadedFiles,
  document,
  documentId,
  filters,
  feedback,
  billing,
  instalments,
 }
