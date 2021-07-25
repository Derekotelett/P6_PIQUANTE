const passwordValidator = require('password-validator');

let passwordValidatorSchema = new passwordValidator();
 
passwordValidatorSchema
.is().min(8)                                    
.is().max(100)                                  
.has().uppercase(1)                              
.has().lowercase()                              
.has().digits(1)                                
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']);

module.exports = passwordValidatorSchema;