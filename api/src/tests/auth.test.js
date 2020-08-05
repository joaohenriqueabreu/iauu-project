const moment = require('moment')

const BadRequestException = require('../exception/bad')

const RegisterUserService = require('../services/auth/registerUser')
const LoginUserService = require('../services/auth/loginUser')
const VerifyUserService = require('../services/auth/verifyUser')
const ResetPasswordService = require('../services/auth/resetPassword')
const FacebookLoginService = require('../services/auth/facebookLogin')
const GoogleLoginService = require('../services/auth/googleLogin')
const AssignRoleService = require('../services/auth/assignRole')

const { User, Artist, Contractor } = require('../models')
const UnauthorizedException = require('../exception/unauthorized')

const name = 'User Name'
const pwd = '123456'
const email = 'user@gmail.com'
const socialId = '123456789'

beforeAll(async () => {
  await User.deleteMany({})
  await Artist.deleteMany({})
  await Contractor.deleteMany({})

  // Mock Facebook and Google fetching
  jest.spyOn(FacebookLoginService.prototype, 'fetchProfile').mockImplementation(() => { return { 
    id: socialId,
    email: email,
    name: name,
    picture: {
      data: {
        url: 'some url'
      }
    }
  }})
  jest.spyOn(GoogleLoginService.prototype, 'fetchProfile').mockImplementation(() => { return { id: socialId } })

  // Mock sending mail
  jest.spyOn(RegisterUserService.prototype, 'sendRegistrationMail').mockReturnThis()
  return
})

afterAll(async () => {
  await User.deleteMany({})
  await Artist.deleteMany({})
  await Contractor.deleteMany({})
})

// Share user among tests
let user = {}

describe('User registration', () => {
  it('should save user', async () => {
    const registerUserSvc = new RegisterUserService(name, email, pwd)
    await registerUserSvc.register()

    user = registerUserSvc.getUser()
    expect(user).toBeInstanceOf(User)
    expect(user.email).toEqual(email)
    expect(user.name).toEqual(name)
    expect(user.password).toEqual(expect.anything())
    expect(user.password).not.toEqual(pwd)
    expect(user.status).toBe('pending')
    expect(user.verification.token).toEqual(expect.anything())
    expect(user.verification.is_verified).toBeFalsy()
    expect(user.verification.issued_at).toBeInstanceOf(Date)
  })

  it('should fail when missing attribute', async () => {
    try {
      const registerUserSvc = new RegisterUserService(name, email)
      await registerUserSvc.register()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })

  it('should fail if user exists', async () => {
    try {
      const registerUserSvc = new RegisterUserService(name, email, pwd)
      await registerUserSvc.register()
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException)
    }
  })
})

describe('Verify email', () => {
  // Set user verification as pending
  beforeEach(async () => {
    user = await User.fetchWithSensitiveDataById(user.id)

    user.verification.is_verified = false
    user.status = 'pending'
    await user.save()
  })

  it('should verify user', async () => {
    const verifyUserService = new VerifyUserService(user.verification.token)
    await verifyUserService.verify()

    const verifiedUser = verifyUserService.getUser()
    expect(verifiedUser.access_token).toEqual(expect.anything())
    expect(verifiedUser.status).toBe('unassigned')
    expect(verifiedUser.verification.is_verified).toBeTruthy()
  })

  it('should fail on invalid token', async () => {
    try {
      const verifyUserService = new VerifyUserService('this is an invalid token')
      await verifyUserService.verify()
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException)
    }
  })

  it('should fail on expired token', async () => {
    try {
      user.verification.issued_at = moment().add('-2', 'days').toISOString()
      await user.save()

      const verifyUserService = new VerifyUserService(user.verification.token)
      await verifyUserService.verify()
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException)
    }
  })

  it('should verify user when bypassing even with expired token', async () => {
    user.verification.issued_at = moment().add('-2', 'days').toISOString()
    await user.save()

    const verifyUserService = new VerifyUserService(user.verification.token, true)
    await verifyUserService.verify()
  })
})

describe('Login user', () => {
  it('should login user with valid email and password', async () => {
    const loginUserSvc = new LoginUserService(email, pwd)
    await loginUserSvc.login()

    const loggedInUser = loginUserSvc.getUser()
    expect(loggedInUser).toBeInstanceOf(User)
  })

  it('should not login with invalid email', async () => {
    try {
      const loginUserSvc = new LoginUserService('other@email.com', pwd)
      await loginUserSvc.login()
  
      const loggedInUser = loginUserSvc.getUser()
      expect(loggedInUser).toBeInstanceOf(User)
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException)
    }
  })

  it('should not login with invalid password', async () => {
    try {
      const loginUserSvc = new LoginUserService(email, 'invalid password')
      await loginUserSvc.login()
  
      const loggedInUser = loginUserSvc.getUser()
      expect(loggedInUser).toBeInstanceOf(User)
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException)
    }
  })

  it('should not login unverified user', async () => {
    try {
      user = await User.fetchWithSensitiveDataById(user.id)

      user.verification.is_verified = false
      user.status = 'pending'
      await user.save()

      const loginUserSvc = new LoginUserService(email, pwd)
      await loginUserSvc.login()
  
      const loggedInUser = loginUserSvc.getUser()
      expect(loggedInUser).toBeInstanceOf(User)
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException)
    }
  })

  it('should login user with valid Facebook ID', async () => {
    user.social.facebook_id = socialId
    await user.save()

    const loginUserSvc = new FacebookLoginService('any token')
    await loginUserSvc.login()

    const loggedInUser = loginUserSvc.getUser()
    expect(loggedInUser).toBeInstanceOf(User)
    expect(loggedInUser.social.facebook_id).toEqual(socialId)
  })

  it('should create user with another Facebook ID', async () => {
    user.social.facebook_id = 'another-id'
    await user.save()

    const loginUserSvc = new FacebookLoginService('any token')
    await loginUserSvc.login()

    const loggedInUser = loginUserSvc.getUser()
    expect(loggedInUser).toBeInstanceOf(User)
    expect(loggedInUser.social.facebook_id).toEqual('another-id')
  })

  it('should login user with valid Google ID', async () => {
    user.social.google_id = socialId
    await user.save()

    const loginUserSvc = new GoogleLoginService('any token')
    await loginUserSvc.login()

    const loggedInUser = loginUserSvc.getUser()
    expect(loggedInUser).toBeInstanceOf(User)
    expect(loggedInUser.social.google_id).toEqual(socialId)
  })

  it('should create user with another Google ID', async () => {
    user.social.google_id = 'another-id'
    await user.save()

    const loginUserSvc = new GoogleLoginService('any token')
    await loginUserSvc.login()

    const loggedInUser = loginUserSvc.getUser()
    expect(loggedInUser).toBeInstanceOf(User)
    expect(loggedInUser.social.google_id).toEqual('another-id')
  })
})

describe('Role assignment', () => {
  // Assume user verified for role assignment and unassign role
  beforeEach(async () => {
    user = await User.fetchWithSensitiveDataById(user.id)

    user.verification.is_verified = true
    user.status = 'unassigned'
    user.artist = undefined
    user.contrator = undefined
    await user.save()
  })

  it('should create artist', async () => {
    expect(user.artist).toBeUndefined()
    const assigRoleSvc = new AssignRoleService({ id: user.id }, 'artist')
    await assigRoleSvc.assign()

    const artistUser = await User.findById(user.id).populate('artist')
    expect(artistUser.status).toEqual('active')
    expect(artistUser.artist).toBeInstanceOf(Artist)
  })

  it('should create contractor', async () => {
    expect(user.artist).toBeUndefined()
    const assigRoleSvc = new AssignRoleService({ id: user.id }, 'contractor')
    await assigRoleSvc.assign()

    const artistUser = await User.findById(user.id).populate('contractor')
    expect(artistUser.status).toEqual('active')
    expect(artistUser.contractor).toBeInstanceOf(Contractor)
  })

  it('should not assign for active user', async () => {
    user.status = 'active'
    await user.save()

    try {

    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException)
    }
  })
})