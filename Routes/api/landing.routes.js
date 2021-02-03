'use strict';

const router = require('express').Router();
const options = require('../../options');
// Middlewares
const { validate, body, query } = require('../../Middlewares/validation.middleware');
// Models
const resModel = require('../../Models/responseModel');
// Controllers
const MailingController = require('../../Controllers/mailingController');

// /api/landing/apointment/
router.post('/apointment',
    validate([body('email').isEmail()]),
    (req, res) => {
        let { subject, name, phone, email, position, company_name, sphere, company_site, company_location, promo } = req.body;
        var message = {
            from: options.mailerTransport.options.auth.user,
            to: options.contacts.email.appointment,
            subject: subject,
            text: `Имя: ${name}, Телефон: ${phone}, Почта: ${email}, Должность: ${position}, Компания: ${company_name}, Сфера деятельности: ${sphere}, Сайт: ${company_name}, Локация: ${company_location}, Промокод: ${promo}`,
            html: `<!DOCTYPE HTML><table><tbody> <tr><td>Имя:</td><td>${name}</td></tr> <tr><td>Телефон:</td><td>${phone}</td></tr> <tr><td>Почта:</td><td>${email}</td></tr> <tr><td>Должность:</td><td>${position}</td></tr> <tr><td>Компания:</td><td>${company_name}</td></tr> <tr><td>Сфера деятельности:</td><td>${sphere}</td></tr> <tr><td>Сайт:</td><td>${company_name}</td></tr> <tr><td>Локация:</td><td>${company_location}</td></tr> <tr><td>Промокод:</td><td>${promo}</td></tr> </tbody></table>`,
        };
        options.mailerTransport.sendMail(message, async (err) => {
            if (err) return res.send(new resModel.ErrorModel(`Unable to send Email, ${err}`));
            else res.send(new resModel.CompleteModel({ subject, name, phone, email, position, company_name, sphere, company_site, company_location, promo }));
        });
    });

module.exports = router;