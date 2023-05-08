const Purchase = require('../models/purchase');
const User = require('../models/user')
const Film = require('../models/film');

module.exports = (app) => {
  // GET all films
  app.get('/films', async (req, res) => {
    try {
      const films = await Film.find();
      res.render('films/index', { films });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  // GET a specific film by ID
  app.get('/films/:id', async (req, res) => {
    try {
      const film = await Film.findById(req.params.id);
      if (!film) {
        return res.status(404).send('Film not found');
      }
      res.render('films/show', { film });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  // POST a new film
  app.post('/films', async (req, res) => {
    try {
      const { name, price, description, image } = req.body;
      const film = new Film({ name, price, description, image });
      await film.save();
      res.redirect('/films');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  // PUT update a specific film by ID
  app.put('/films/:id', async (req, res) => {
    try {
      const { name, price, description, image } = req.body;
      const updatedFilm = await Film.findByIdAndUpdate(req.params.id, { name, price, description, image }, { new: true });
      if (!updatedFilm) {
        return res.status(404).send('Film not found');
      }
      res.json({ updatedFilm });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  // DELETE a specific film by ID
  app.delete('/films/:id', async (req, res) => {
    try {
      const deletedFilm = await Film.findByIdAndDelete(req.params.id);
      if (!deletedFilm) {
        return res.status(404).send('Film not found');
      }
      res.json({ deletedFilm });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
};

