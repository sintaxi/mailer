
var Hook = require('hook.io').Hook,
    util = require('util'),
    mailerModule = require('mailer');

var MailerHook = exports.MailerHook = function(options){

  var self = this;

  Hook.call(self, options);

  self.config.use('file', { file: './config.json'});

  self.on('hook::ready', function(){
    
    self.on('*::sendEmail', function(event, email){
      self.send(email);
    });
  });

};

// Mailer inherits from Hook
util.inherits(MailerHook, Hook);

MailerHook.prototype.send = function(options){

  var self = this,
      settings = self.config.get('mailer');

  mailerModule.send({
    ssl: true,
    to: options.to,
    from: options.from,
    host: settings.host,
    authentication: 'login',
    username: settings.username,
    password: settings.password,
    domain: settings.domain,
    subject: options.subject,
    body: options.body
  },
  function(err, result){
    if(err){ 
      return self.emit('error', err);
    }
      
    self.emit('emailSent', result);
    
  });

};

