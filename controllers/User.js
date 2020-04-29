const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
privateKey = "sony456"

module.exports = {
    create: function (req, res, next) {
        User.create({
          email: req.body.email,
          name : req.body.name,
          phone : req.body.phone,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword
        })
        .then((response) => {
          if(req.body.password !== req.body.confirmPassword){
            res.send("your confirm pasword is not match with your password please try again")
          }else(
            res.json(response)
          )
        })    
          .catch ((err) => {
            throw err
          })
          // .then((response) => res.json(response))
          // .catch((err) => {
          //   throw err;
          // });
      },
    
      authenticated: function (req, res, next) {
        User.findOne({
          email: req.body.email,
          name : req.body.name,
          phone : req.body.phone,
        })
          .then((response, err) => {
            if (err) next(err);
            else {
              if (
                response != null &&
                bcrypt.compareSync(req.body.password, response.password)
              ) {
                jwt.sign(
                  {
                    id: response._id,
                  },
                  privateKey,
                  { expiresIn: 60 * 60 },
                  (err, token) => {
                    res.json(token);
                  }
                );
              } else {
                res.json({ status: err });
              }
            }
          })
          .catch((err) => {
            throw err;
          });
      },
    
    
      getData: (req, res, next) => {
        User.find({})
          .then((result) => {
            res.json({ status: "success", data: result });
          })
          .catch((err) => err);
      },
    
      getDatabyId: (req, res) => {
        User.findById(req.params.userId)
          .then((result) => res.json(result))
          .catch((err) => res.json(err));
      },
    
      deleteById: (req, res) => {
        User.findByIdAndRemove(req.params.userId)
          .then((result) => res.json(result))
          .catch((err) => res.json(err));
      },
    
    
    
    
    
    };

