var express = require('express');
var router = express.Router();
var validation = require('../controls/validations')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
    res.send("It worked!")
  }else{
    res.render('signup', {email: email, password: password, confirm: confirm})
  }
})

module.exports = router;
