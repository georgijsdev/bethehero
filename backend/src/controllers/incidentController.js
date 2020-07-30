const { create, index } = require("./orgController");
const connection = require('../database/connection');
const { request } = require('http');
const { response } = require('express');

module.exports = {
   async index(request, response) {
      const {page = 1} = request.query;

      const [count] = await connection('incidents').count();

      console.log(count);

      const incidents = await connection('incidents')
         .join('orgs', 'orgs.id', '=', 'incidents.org_id')
         .limit(5)
         .offset((page - 1) * 5)
         .select([
            'incidents.*',
            'orgs.name',
            'orgs.email',
            'orgs.whatsapp',
            'orgs.city'
         ]);
      
      response.header('X-Total-Count', count['count(*)']);
   
      return response.json(incidents);
   },

   async create(request, response) {
      const {title, description, value } = request.body;

      const org_id = request.headers.authorization;

      const [id] = await connection('incidents').insert({
         title,
         description,
         value,
         org_id,
      });

      return response.json({id});
   },

   async delete(request, response){
      const {id} = request.params;
      const org_id = request.headers.authorization;

      const incident = await connection('incidents')
         .where('id', id)
         .select('org_id')
         .first();

      if (incident.org_id !== org_id) {
         return response.status(401).json({ error: 'Operation not allowed.' });
      }

      await connection('incidents').where('id', id).delete();

      return response.status(204).send();
   }
};