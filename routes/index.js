var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/presidents', function(req, res, next) {
  res.render('presidents', { title: 'Express' });
});

/**
* Sets up a route handler for POST requests
*/ 
router.post('/submitFoodPreferences', (req, res, next) => {
  // Form data
  const iceCreamFlavor = req.body.iceCreamFlavor;
  const pizzaToppings = req.body.pizzaToppings;
  const favoriteFruit = req.body.favoriteFruit;
  const cuisine = req.body.cuisine;
  const spiciness = req.body.spiciness;

  // Checks if any food elements are missing
  if (!iceCreamFlavor || !pizzaToppings || !favoriteFruit || !cuisine || !spiciness) {
      res.status(422).send("Incomplete data!.");
      return;
  }


  // Debugging purposes
  console.log(req.body.iceCreamFlavor);
  console.log(req.body.pizzaToppings);
  console.log(req.body.favoriteFruit);
  console.log(req.body.cuisine);
  console.log(req.body.spiciness);

  // For cookie and a thank you message for the POST request
  res.cookie('favoriteFruit', req.body.favoriteFruit, { maxAge: 900000, httpOnly: false });
  // res.send("Thanks for sharing your food preferences! :) Your favorite fruit is: " + req.body.favoriteFruit);
  res.render('results', {favoriteFruit: req.body.favoriteFruit});
});

// router.post('/myaction', function(req, res, next) {
//   console.log(req.body.color);
//   console.log(req.body.mynumber);
//   res.render('results', { title: 'Personality Quiz Results', personality: "You like pizza" });
// });

module.exports = router;
