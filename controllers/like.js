/*const Sauce = require("../models/Sauce"); //modèle de la base de donnée

exports.likeSauce = (req, res, next) => {
  const sauceObject = req.body;
  //Définit le statut "j'aime" pour userID fourni.
  let likes = req.body.like;
  let userId = req.body.userId;
  delete sauceObject._id;

  //Si j'aime = 1, l'utilisateur aime la sauce. 
  if (likes === 1) {
    Sauce.updateOne({ _id: req.params.id },{ $inc: { likes: +1 }, 
      //L'identifiant de l'utilisateur doit être ajouté en gardant une trace de ses préférences
      $push: { usersLiked: userId } })
      .then(() => res.status(200).json({ message: "Like +1" }))
      .catch((error) => res.status(400).json({ error }));

  //Si j'aime = -1, l'utilisateur n'aime pas la sauce.
  } else if (likes === -1) {
    Sauce.updateOne({ _id: req.params.id },{ $inc: { dislikes: +1 },
      //L'identifiant de l'utilisateur doit être ajouté en gardant une trace de ses préférences
       $push: { usersDisliked: userId } })
      .then(() => res.status(200).json({ message: "Dislike +1" }))
      .catch((error) => res.status(400).json({ error }));

  } else {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        //Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas.
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne({ _id: req.params.id },
            //L'identifiant de l'utilisateur doit être supprimé en gardant une trace de ses préférences
            { $inc: { likes: -1 },
            $pull: { usersLiked: userId } })
            .then(() => { res.status(200).json({ message: "Like -1" });
          })
            .catch((error) => res.status(400).json({ error }));

        } else if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne({ _id: req.params.id },
            //L'identifiant de l'utilisateur doit être supprimé en gardant une trace de ses préférences
            { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } })
            .then(() => { res.status(200).json({ message: "Dislike -1" });
          })
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};*/

const Sauce = require("../models/Sauce"); //modèle de la base de donnée

exports.likeSauce = (req, res, next) => {
  const vote = req.body.like;
  console.log("vote");
  console.log(vote);

  switch(vote){
        //l'utilisateur aime : on ajoute son id au tableau et on incrémente les likes
        case 1 :
            Sauce.updateOne({_id : req.params.id}, {$inc : {likes : +1 },
            $push : { usersLiked : req.body.userId}
          })
              .then(() => res.status(201).json({message : "J'aime ajouté"}))
              .catch(error => res.status(500).json({error}))       
        break;

        //l'utilisateur n'aime pas : on ajoute son id au tableau et on incrémente les likes
        case -1 :
          Sauce.updateOne({_id : req.params.id}, {$inc : {dislikes : +1 },
            $push : { usersDisliked : req.body.userId}, 
          })
              .then(() => res.status(201).json({message : "je n'aime pas ajouté"}))
              .catch(error => res.status(500).json({ error }))
        break;

        //l'utilisateur annule son choix : on retire l'utilisateur du tableau et on désincrémente les likes ou dislikes suivant le tableau dans lequel il se trouvait
        case 0 :  
          Sauce.findOne({_id : req.params.id})
              .then(sauce => {
                  if (sauce.usersLiked.includes(req.body.userId)){
                    Sauce.updateOne( {
                      $pull : { usersLiked : req.body.userId}, $inc : {likes : -1 }
                    })
                      .then(() => res.status(201).json({message : "j'aime a été retiré !"}))
                      .catch(error => res.status(500).json({error}))
                  }
                  if(sauce.usersDisliked.includes(req.body.userId)){
                    Sauce.updateOne( {
                      $pull : { usersDisliked : req.body.userId}, $inc : {dislikes : -1 }
                    })
                      .then(() => res.status(201).json({message : "je n'aime pas été retiré !"}))
                      .catch(error => res.status(500).json({ error }))
                  }

              }) 
              .catch(error => res.status(500).json({ error}))
        break;  
          
        default : console.log(req.body)
    }
  
}