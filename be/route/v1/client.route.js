const express = require('express');
const router = express.Router();
const clientController = require('../../controller/client.controller');

// Create a new client
router.post('/', clientController.createClient);

// Get all clients
router.get('/', clientController.getClients);

// Get a client by ID
router.get('/:id', clientController.getClientById);

// Update a client by ID
router.put('/:id', clientController.updateClient);

// Delete a client by ID
router.delete('/:id', clientController.deleteClient);

module.exports = router;
