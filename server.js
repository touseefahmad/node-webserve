
const express = require('express');
const fs = require('fs');
const hbs = require('hbs');
//this will be set heroku
//process.env stores all environment variables
// in key value pairs;\ it will get port from heroku
//if running locally it will be set to 3000 to run
//it locally;

const port =process.env.PORT || 3000;

var app = express();
//partials are partial page tages which can b dynamically rendered
hbs.registerPartials(__dirname +'/views/partials');
app.set('view engine','hbs');
app.use((request, response, next)=>{
  //next will not allow app until next is called used for asynchronous behavior
  var now =new Date().toString();
  var log =` ${now}: ${request.method} ${request.url}`;
  fs.appendFile('server.log', log + '\n',(err)=>{
    if(err){
      console.log('unable to append to server.log.');
    }

  });
  next();
});
//app.use((req,res, next)=>{
  //as next() is not called here so actuall handlers below will
  //not be called so it maintanence page will display every time
//   res.render('maintanence.hbs',{
//     pageTitle : 'maintanence',
//     message : 'Sorry for inconvenience! site is down for maintanence. we will get back soon!'
//   })
// });
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', ()=>{
  return new Date().getFullYear();

});
//took paramater passed in arrow function and returned capatalized message
hbs.registerHelper('screamIt',(text)=>{
  return text.toUpperCase();
});
//handler for http get request
app.get('/',(request,response)=>{
  response.render('home.hbs',{
    pageTitle : 'Home',
    message : 'Welcome Home'
  })
//  response.send('<h1>hello express</h1>');
// response.send({
//   name :'andrew',
//   likes : [ 'biking','cities']
// });
});
app.get('/about',(request,response)=>{
  response.render('about.hbs',{
    pageTitle : 'About Page'
  });
//  response.send('about page');
});
app.get('/bad',(request,response)=>{
  response.send({
    errorMessage : 'Unable to connect'
  });
});
//make it dynamic for heroku

app.listen(port,()=>{
  console.log(`server is up and running on port ${port}`);
});
