const connection = require('../database/connection');
const { request } = require('http');
const { response } = require('express');

const crypto = require('crypto');

module.exports = {
   async index(request, response) {
      const orgs = await connection('orgs').select('*');
   
      return response.json(orgs);
   },

   async create(request, response) {
      const {name, email, whatsapp, city } = request.body;

      const id = crypto.randomBytes(4).toString('HEX');

      await connection('orgs').insert({
         id,
         name,
         email,
         whatsapp,
         city,
      })

      return response.json({id});
   }
};