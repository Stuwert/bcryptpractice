var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var validation = require('../controls/validations')
var knex = require('../db/knex')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { email: req.cookies.user});
});

router.get('/signin', function(req, res, next){
  res.render('signin')
})

router.get('/signup', function(req, res, next){
  res.render('signup')
})

router.post('/signup', function(req, res, next){
  var email = validation.emailIsValid(req.body.email || "");
  var password = validation.passwordIsNotBlank(req.body.password || "")
  var confirm = req.body.password === req.body.confirm ? true : "Your passwords need to match"
  if(email.bool === true && password.bool === true && confirm == true){
    var hash = bcrypt.hashSync(req.body.password, 10);
    Users().insert({email: req.body.email, hallpass: hash}).then(function(){
      res.cookie('user', req.body.email)
      res.redirect('/')
    })
  }else{
    res.render('signup', {email: email, password: password, confirm: confirm})
  }
})

router.post('/signin', function(req, res, next){
  var email = validation.emailIsValid(req.body.email || "");
  var password = validation.passwordIsNotBlank(req.body.password || "")
  if(email.bool === true && password.bool === true){
    Users().where('email', req.body.email).first().then(function(person){
      if(bcrypt.compareSync(req.body.password, person.hallpass)){
        res.send("You're In")
      }else{
        res.send('Wrong fucking password')
      };
    })
  }else{
    res.render('signin', {email: email, password: password})
  }
})

function Users(){
  return knex('users');
}


module.exports = router;
