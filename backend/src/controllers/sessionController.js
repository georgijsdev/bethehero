const { index } = require("./orgController");
const connection = require('../database/connection');
const { request } = require('http');
const { response } = require('express');

module.exports = {
   async create(request, response) {
      const { id } = request.body;

      const org = await connection('orgs')
         .where('id', id)
         .select('name')
         .first();

      if (!org) {
         return response.status(400).json({error: 'No Organization was found!'});
      }

      return response.json(org);
   }
}