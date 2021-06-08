const config 				= require('iauu/env');
const nodemailer 		= require('nodemailer');
const aws       		= require('aws-sdk');

const smtpEndpoint 	= config.mail.host;
const port 					= config.mail.port;

const smtpUsername 	= config.mail.user;
const smtpPassword 	= config.mail.password;

let transporter 		= {};

async function start() {
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	// let testAccount = await nodemailer.createTestAccount(); 

	// create reusable transporter object using the default SMTP transport
	transporter = nodemailer.createTransport({
		host: 	smtpEndpoint,
		port: 	port,
		secure: false, // true for 465, false for other ports
		auth: {
			user: smtpUsername,
			pass: smtpPassword
		},
		tls: { rejectUnauthorized: false }
	});
}

async function send(to, from, subject, message) {
	from = 'mail@iauu.com.br';
	console.log('Trying to send email...');
	try {
		const result = await transporter.sendMail({ to, from, subject, html: message });
		console.log('Mail sent...');
		return result;
	} catch (error) {
		console.log('Failed sending mail...')
		console.log(error);
	}        
}

start().catch((error) => { throw error })

module.exports = { send }