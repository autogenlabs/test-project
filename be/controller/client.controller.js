const { Client } = require('../models');

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const newClient = await Client.create(req.body);
    return res.status(201).json(newClient);
  } catch (error) {
    return res.status(500).json({ message: "Error creating client", error });
  }
};

// Get all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving clients", error });
  }
};

// Get client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (client) {
      return res.status(200).json(client);
    } else {
      return res.status(404).json({ message: "Client not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving client", error });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (client) {
      await client.update(req.body);
      return res.status(200).json(client);
    } else {
      return res.status(404).json({ message: "Client not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error updating client", error });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (client) {
      await client.destroy();
      return res.status(200).json({ message: "Client deleted" });
    } else {
      return res.status(404).json({ message: "Client not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error deleting client", error });
  }
};
