const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  // Analyse la sauce en utilisant une chaîne de caractères
  console.log(req.body);
  console.log(1); 

  const sauceObject = JSON.parse(req.body.sauce);
  console.log(2);

  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    //Capture et enregistre l'image en définissant correctement son image URL
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    //Remet les sauces aimées et celles détestées à 0
    likes: 0,
    dislikes: 0,
    //et les sauces usersliked et celles usersdisliked aux tableaux vides
    usersLiked: [],
    usersDisliked: [],
  });
  //Enregistre la sauce dans la base de données
  sauce.save()
    .then(() => {
      res.status(201).json({ message: "Sauce enregistrée !" });
    })
    .catch(() => {
      res.status(400).json({ error: "sauce non créée !" });
    });
};

exports.getOneSauce = (req, res, next) => {
  // Renvoie la sauce avec l'ID fourni
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => { res.status(200).json(sauce);
    })
    .catch((error) => { res.status(404).json({ error: error });
    });
};

/*exports.modifySauce = (req, res, next) => {
  //si on modifie le fichier image, récupérer le nom du fichier image sauce actuelle pour la suppréssion
  //pour éviter d'avoir un fichier inutile dans le dossier images 
  if(req.file){
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      const filename = sauce.imageUrl.split("/images")[1];
      //suppression de l'image de la sauce car elle va être remplacer par la nouvelle image de sauce
      fs.unlink(`images/${filename}`, (err) => {
        if(err) throw err;
      })
    })
    .catch(error => res.status(400).json({error}));  
  }else{}

  //l'objet qui va être envoyé dans la base de donnée
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } :
  { ...req.body};

  //update dans la base de donnée
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //2 arguments l'objet et la nouvelle version de l'objet
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(404).json({ error }));
};*/


exports.modifySauce = (req, res, next) => {
  //Met à jour la sauce avec l'ID fourni.  
  const sauceObject = req.file
    ? {
      //Si une image est téléchargée, capturez-la et mettez à jour l'image URL des sauces.
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          //Si aucun fichier n'est fourni, les détails de la sauce figurent directement dans le corps de la demande
          req.file.filename
        }`,
      }
    : { ...req.body };
    //Si un fichier est fourni, la sauce avec chaîne est en req.body.sauce.
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  //Supprime la sauce avec l'ID fourni.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  // Renvoie le tableau de toutes les sauces dans la base de données
  Sauce.find()
    .then((sauces) => { res.status(200).json(sauces);
    })
    .catch((error) => { res.status(400).json({ error: error,});
    });
};